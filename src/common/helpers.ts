export const isValidLength = (s: any, length: number) => {
    if (s.length > length) {
        return false;
    }
    return true;
};

export function formatPlainText(text: string | undefined): string {
    if (text) {
        const escaped = text
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        const linked = escaped.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );

        return linked.replace(/\n/g, "<br>");
    }
    return "";
}
