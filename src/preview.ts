import type { BadgeProviderId } from "./types.js";

import { identifyBadgeProvider, isBadgeProviderUrl } from "./providers.js";

/** A badge link parsed from rendered Markdown for terminal display. */
export interface TerminalBadge {
    readonly alt: string;
    readonly color: string;
    readonly error?: string;
    readonly image: string;
    readonly provider?: BadgeProviderId;
    readonly service: string;
    readonly target: string;
    readonly title?: string;
}

const badgePattern =
    /\[!\[(?<alt>[^\]]*)\]\((?<image>https:\/\/[^\s\)]+)\)\]\((?<target>https:\/\/[^\s\)]+)\)/gv;
const suspiciousTitlePattern =
    /(?:^|\b)(?:429|500|discontinued|error|timeout|undefined|unknown)(?:\b|$)/iv;
const xmlEntityPattern = /&(?:amp|apos|gt|lt|quot|#\d+|#x[\da-f]+);/giv;
const maximumSvgBytes = 256_000;
const maximumRedirects = 3;

/** Fetch live SVG titles for parsed Badgen images with bounded timeouts. */
export async function loadLiveBadgeTitles(
    badges: readonly TerminalBadge[],
    timeoutMilliseconds = 6000
): Promise<readonly TerminalBadge[]> {
    return Promise.all(
        badges.map((badge) => loadLiveBadgeTitle(badge, timeoutMilliseconds))
    );
}

/** Parse linked badge images from Markdown without making network requests. */
export function parseTerminalBadges(
    markdown: string
): readonly TerminalBadge[] {
    const badges: TerminalBadge[] = [];
    for (const match of markdown.matchAll(badgePattern)) {
        const groups = match.groups;
        if (groups === undefined) continue;
        const image = groups["image"] ?? "";
        const url = new URL(image);
        const provider = identifyBadgeProvider(url);
        badges.push({
            alt: groups["alt"] ?? "Badge",
            color: badgeColor(url),
            image,
            ...(provider !== undefined && { provider: provider.id }),
            service: provider?.name ?? firstPathSegment(url.pathname),
            target: groups["target"] ?? "",
        });
    }
    return badges;
}

function badgeColor(url: Readonly<URL>): string {
    const queryColor = url.searchParams.get("color");
    if (queryColor !== null && /^[\da-f]{6}$/iv.test(queryColor)) {
        return queryColor;
    }
    if (url.pathname.startsWith("/static/")) {
        const lastSeparator = url.pathname.lastIndexOf("/");
        const lastSegment = url.pathname.slice(lastSeparator + 1);
        if (/^[\da-f]{6}$/iv.test(lastSegment)) return lastSegment;
    }
    return "0E7490";
}

function decodeXml(value: string): string {
    let decoded = "";
    let cursor = 0;
    for (const match of value.matchAll(xmlEntityPattern)) {
        const index = match.index;
        decoded += value.slice(cursor, index);
        decoded += decodeXmlEntity(match[0]);
        cursor = index + match[0].length;
    }
    return decoded + value.slice(cursor);
}

function decodeXmlEntity(entity: string): string {
    const normalized = entity.toLowerCase();
    if (normalized === "&amp;") return "&";
    if (normalized === "&apos;") return "'";
    if (normalized === "&gt;") return ">";
    if (normalized === "&lt;") return "<";
    if (normalized === "&quot;") return '"';

    const isHexadecimal = normalized.startsWith("&#x");
    const codePoint = Number.parseInt(
        normalized.slice(isHexadecimal ? 3 : 2, -1),
        isHexadecimal ? 16 : 10
    );
    return isXmlCodePoint(codePoint) ? String.fromCodePoint(codePoint) : entity;
}

function extractElementValues(svg: string, tagName: string): readonly string[] {
    const lowerSvg = svg.toLocaleLowerCase();
    const openToken = `<${tagName}`;
    const closeToken = `</${tagName}>`;
    const values: string[] = [];
    let cursor = 0;
    for (;;) {
        const openStart = lowerSvg.indexOf(openToken, cursor);
        if (openStart === -1) return values;
        const openEnd = lowerSvg.indexOf(">", openStart + openToken.length);
        if (openEnd === -1) return values;
        const closeStart = lowerSvg.indexOf(closeToken, openEnd + 1);
        if (closeStart === -1) return values;
        const value = stripMarkup(svg.slice(openEnd + 1, closeStart)).trim();
        if (value.length > 0) values.push(value);
        cursor = closeStart + closeToken.length;
    }
}

function extractOpenTag(svg: string, tagName: string): string | undefined {
    const lowerSvg = svg.toLocaleLowerCase();
    const openStart = lowerSvg.indexOf(`<${tagName}`);
    if (openStart === -1) return undefined;
    const openEnd = lowerSvg.indexOf(">", openStart + tagName.length + 1);
    return openEnd === -1 ? undefined : svg.slice(openStart, openEnd + 1);
}

function extractQuotedAttribute(
    openTag: string,
    attributeName: string
): string | undefined {
    const lowerTag = openTag.toLocaleLowerCase();
    const nameStart = lowerTag.indexOf(attributeName.toLocaleLowerCase());
    if (nameStart === -1) return undefined;
    let cursor = nameStart + attributeName.length;
    while (openTag[cursor] === " " || openTag[cursor] === "\t") cursor += 1;
    if (openTag[cursor] !== "=") return undefined;
    cursor += 1;
    while (openTag[cursor] === " " || openTag[cursor] === "\t") cursor += 1;
    const quote = openTag[cursor];
    if (quote !== '"' && quote !== "'") return undefined;
    const valueStart = cursor + 1;
    const valueEnd = openTag.indexOf(quote, valueStart);
    return valueEnd === -1 ? undefined : openTag.slice(valueStart, valueEnd);
}

function extractSvgLabel(svg: string, fallback: string): string {
    const title = extractElementValues(svg, "title")[0];
    if (title !== undefined && title.length > 0) {
        return decodeXml(title);
    }
    const svgOpenTag = extractOpenTag(svg, "svg");
    const ariaLabel =
        svgOpenTag === undefined
            ? undefined
            : extractQuotedAttribute(svgOpenTag, "aria-label");
    if (ariaLabel !== undefined && ariaLabel.trim().length > 0) {
        return decodeXml(ariaLabel.trim());
    }
    const textValues = extractElementValues(svg, "text");
    if (textValues.length > 0) return decodeXml(textValues.join(": "));
    const trimmedFallback = fallback.trim();
    return trimmedFallback.endsWith(".")
        ? trimmedFallback.slice(0, -1)
        : trimmedFallback;
}

async function fetchBadgeResponse(
    initialUrl: Readonly<URL>,
    provider: BadgeProviderId,
    timeoutMilliseconds: number
): Promise<Response> {
    let currentUrl = new URL(initialUrl.href);
    for (let redirectCount = 0; ; redirectCount += 1) {
        // eslint-disable-next-line no-await-in-loop -- Redirects must be sequential so each destination is validated before the next request.
        const response = await fetch(currentUrl, {
            headers: { accept: "image/svg+xml" },
            redirect: "manual",
            signal: AbortSignal.timeout(timeoutMilliseconds),
        });
        if (response.status < 300 || response.status >= 400) return response;
        if (redirectCount >= maximumRedirects) {
            throw new Error("badge redirected too many times");
        }
        const location = response.headers.get("location");
        if (location === null) {
            throw new Error("badge redirect omitted its destination");
        }
        const destination = new URL(location, currentUrl);
        if (!isBadgeProviderUrl(destination, provider)) {
            throw new Error("badge redirected to an unsupported host");
        }
        currentUrl = destination;
    }
}

async function fetchLiveBadgeTitle(
    badge: TerminalBadge,
    timeoutMilliseconds: number
): Promise<TerminalBadge> {
    const url = new URL(badge.image);
    const provider = badge.provider ?? identifyBadgeProvider(url)?.id;
    if (provider === undefined || !isBadgeProviderUrl(url, provider)) {
        return { ...badge, error: "unsupported badge host" };
    }
    const response = await fetchBadgeResponse(
        url,
        provider,
        timeoutMilliseconds
    );
    if (!response.ok) return { ...badge, error: `HTTP ${response.status}` };
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLocaleLowerCase().includes("image/svg+xml")) {
        return { ...badge, error: "response was not SVG" };
    }
    const svg = await response.text();
    const textEncoder = new TextEncoder();
    if (textEncoder.encode(svg).byteLength > maximumSvgBytes) {
        return { ...badge, error: "SVG exceeded preview size limit" };
    }
    const decodedTitle = extractSvgLabel(svg, badge.alt);
    if (decodedTitle.length === 0) {
        return { ...badge, error: "SVG label unavailable" };
    }
    return suspiciousTitlePattern.test(decodedTitle)
        ? {
              ...badge,
              error: `badge rendered ${decodedTitle}`,
              title: decodedTitle,
          }
        : { ...badge, title: decodedTitle };
}

function firstPathSegment(pathname: string): string {
    const pathWithoutRoot = pathname.startsWith("/")
        ? pathname.slice(1)
        : pathname;
    const separator = pathWithoutRoot.indexOf("/");
    const segment =
        separator === -1
            ? pathWithoutRoot
            : pathWithoutRoot.slice(0, separator);
    return segment.length > 0 ? segment : "badge";
}

function isXmlCodePoint(codePoint: number): boolean {
    return (
        codePoint === 0x9 ||
        codePoint === 0xa ||
        codePoint === 0xd ||
        (codePoint >= 0x20 && codePoint <= 0xd7_ff) ||
        (codePoint >= 0xe0_00 && codePoint <= 0xff_fd) ||
        (codePoint >= 0x1_00_00 && codePoint <= 0x10_ff_ff)
    );
}

async function loadLiveBadgeTitle(
    badge: TerminalBadge,
    timeoutMilliseconds: number
): Promise<TerminalBadge> {
    try {
        return await fetchLiveBadgeTitle(badge, timeoutMilliseconds);
    } catch (error) {
        return { ...badge, error: String(error) };
    }
}

function stripMarkup(value: string): string {
    let result = "";
    let cursor = 0;
    for (;;) {
        const tagStart = value.indexOf("<", cursor);
        if (tagStart === -1) return result + value.slice(cursor);
        result += value.slice(cursor, tagStart);
        const tagEnd = value.indexOf(">", tagStart + 1);
        if (tagEnd === -1) return result;
        cursor = tagEnd + 1;
    }
}
