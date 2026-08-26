import type { BadgeProvider, BadgeProviderId } from "./types.js";

import { badgeCatalog } from "./catalog.js";

const providersByHost = new Map<string, BadgeProvider>(
    badgeCatalog.providers.flatMap((provider) =>
        provider.imageHosts.map((host): readonly [string, BadgeProvider] => [
            host,
            provider,
        ])
    )
);

/** Resolve a registered badge service from an HTTPS image URL. */
export function identifyBadgeProvider(
    value: Readonly<URL> | string
): BadgeProvider | undefined {
    const url = parseBadgeUrl(value);
    if (
        url?.protocol !== "https:" ||
        url.username.length > 0 ||
        url.password.length > 0
    ) {
        return undefined;
    }
    return providersByHost.get(url.hostname.toLocaleLowerCase());
}

/** Return whether a URL belongs to the expected registered service. */
export function isBadgeProviderUrl(
    value: Readonly<URL> | string,
    providerId: BadgeProviderId
): boolean {
    const url = parseBadgeUrl(value);
    if (url === undefined) return false;
    const provider = badgeCatalog.providers.find(
        (candidate) => candidate.id === providerId
    );
    if (provider === undefined) return false;
    const hostname = url.hostname.toLocaleLowerCase();
    const allowedHosts = new Set(provider.imageHosts);
    for (const deliveryHost of provider.deliveryHosts) {
        allowedHosts.add(deliveryHost);
    }
    return (
        url.protocol === "https:" &&
        url.username.length === 0 &&
        url.password.length === 0 &&
        allowedHosts.has(hostname)
    );
}

function parseBadgeUrl(value: Readonly<URL> | string): undefined | URL {
    if (typeof value !== "string") return new URL(value.href);
    try {
        return new URL(value);
    } catch {
        return undefined;
    }
}
