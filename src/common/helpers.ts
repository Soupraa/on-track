export const isValidLength = (s: any, length: number) => {
    if (s.length > length) {
        return false;
    }
    return true;
};
