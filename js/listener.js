(() => {
    let config;
    let updated = false;

    function applyConfig() {
        const root = document.documentElement;

        if (!root || !config) {
            return;
        }

        if (config.tema === "original") {
            root.removeAttribute("data-gs-theme");
        } else {
            root.setAttribute("data-gs-theme", config.tema);
        }

        if (config.corDestaque === "original") {
            root.removeAttribute("data-gs-accent");
        } else {
            root.setAttribute("data-gs-accent", config.corDestaque);
        }

        root.toggleAttribute("data-gs-retro", config.estiloRetro);
        root.setAttribute("data-gs-image-level", config.escurecer ? config.escurecerNivel : 0);
        root.toggleAttribute("data-gs-image-hover", config.escurecer && config.escurecerClarear);
    }

    function updateConfig(value) {
        updated = true;
        config = gsConfig.normalize(value);
        applyConfig();
    }

    // Content scripts may start before <html> exists. Observe only its creation.
    if (!document.documentElement) {
        const observer = new MutationObserver(() => {
            if (document.documentElement) {
                applyConfig();
                observer.disconnect();
            }
        });

        observer.observe(document, { childList: true });
    }

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === "local" && Object.prototype.hasOwnProperty.call(changes, "gs_config")) {
            updateConfig(changes.gs_config.newValue);
        }
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (sender.id !== chrome.runtime.id || !message ||
            !["tema", "accent", "retro", "esc", "nivel", "clarear"].includes(message.opt)) {
            return;
        }

        updateConfig(message.config);
        sendResponse(true);
    });

    chrome.storage.local.get("gs_config", (items = {}) => {
        const error = chrome.runtime.lastError;

        // A newer popup/storage update must win over this initial asynchronous read.
        // Wait for storage so a saved Original theme never flashes dark on startup.
        if (!updated) {
            config = gsConfig.normalize(error ? undefined : items.gs_config);
            applyConfig();
        }
    });
})();
