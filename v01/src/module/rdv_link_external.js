export const openInNewTab = (url, target) => {
    if (target) {
        window.open(url, target, "noopener,noreferrer");
    } else {
        window.open(url, "_blank", "noopener,noreferrer");
    }
}
