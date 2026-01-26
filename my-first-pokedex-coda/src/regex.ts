export function getIdFromUrl (url:string) :string | null {
    const regex = /(\d+)\/$/;
    const result = url.match(regex);

    if (result) {
        return result[1];
    }

    return null;
}