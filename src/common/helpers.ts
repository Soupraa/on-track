export const isValidLength = (s: string, length: number) => {
    if (s.length > length) {
        return false;
    }
    return true;
};
