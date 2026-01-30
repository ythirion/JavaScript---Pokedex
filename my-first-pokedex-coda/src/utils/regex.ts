export function getIdFromUrl(url: string): string | null {
    const regex = /(\d+)\/$/;

    const result = url.match(regex);
    if (!result) return null;

    return result[1];
}