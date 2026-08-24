/** A badge link parsed from rendered Markdown for terminal display. */
export interface TerminalBadge {
    readonly alt: string;
    readonly color: string;
    readonly error?: string;
    readonly image: string;
    readonly service: string;
    readonly target: string;
    readonly title?: string;
}

const badgePattern =
    /\[!\[(?<alt>[^\]]*)\]\((?<image>https:\/\/[^\s\)]+)\)\]\((?<target>https:\/\/[^\s\)]+)\)/gv;
const suspiciousTitlePattern =
    /(?:^|\b)(?:429|500|discontinued|error|timeout|undefined|unknown)(?:\b|$)/iv;
const xmlEntityPattern = /&(?:amp|apos|gt|lt|quot|#\d+|#x[\da-f]+);/giv;

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
        badges.push({
            alt: groups["alt"] ?? "Badge",
            color: badgeColor(url),
            image,
            service: firstPathSegment(url.pathname),
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

async function fetchLiveBadgeTitle(
    badge: TerminalBadge,
    timeoutMilliseconds: number
): Promise<TerminalBadge> {
    const url = new URL(badge.image);
    if (
        url.protocol !== "https:" ||
        (url.hostname !== "badgen.net" && url.hostname !== "flat.badgen.net")
    ) {
        return { ...badge, error: "unsupported badge host" };
    }
    const response = await fetch(url, {
        headers: { accept: "image/svg+xml" },
        signal: AbortSignal.timeout(timeoutMilliseconds),
    });
    if (!response.ok) return { ...badge, error: `HTTP ${response.status}` };
    const title = /<title>(?<title>[\s\S]*?)<\/title>/v.exec(
        await response.text()
    )?.groups?.["title"];
    if (title === undefined || title.trim().length === 0) {
        return { ...badge, error: "SVG title unavailable" };
    }
    const decodedTitle = decodeXml(title.trim());
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
