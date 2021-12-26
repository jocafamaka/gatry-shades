document.addEventListener("DOMContentLoaded", function (e) {
    document.getElementsByClassName('scroll-to-top')[0].children[0].src = chrome.extension.getURL('images/up_dark.png');
    document.querySelector(".share .link-icon").style.backgroundImage = `url("${chrome.extension.getURL('images/icone_adicionar.png')}")`;
    document.querySelector(".login .link-icon").style.backgroundImage = `url("${chrome.extension.getURL('images/icone_login_dark.png')}")`;

    ready();
});

chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {

    if (sender.id === chrome.runtime.id) {
        let head = document.getElementsByTagName('head')[0];
        let link = document.createElement('link');
        link.media = 'all';
        link.rel = 'stylesheet';
        link.type = 'text/css';

        if (msg.opt == 'tema') {
            let old = document.getElementById("gs-style");

            if (old !== null)
                old.remove();

            link.id = "gs-style";
            link.href = chrome.extension.getURL(`css/${msg.valor}.min.css`);

            head.appendChild(link);
        }

        if (msg.opt == 'esc') {

            let escCss = document.getElementById("gs-escn-style");

            if (msg.valor && escCss === null) {
                link.id = "gs-escn-style";
                link.href = chrome.extension.getURL(`css/image-n${msg.config.escurecerNivel}.min.css`);

                head.appendChild(link);
            }

            if (!msg.valor && escCss !== null) {
                escCss.remove();
            }
        }

        if (msg.opt == 'nivel' && msg.config.escurecer) {
            let old = document.getElementById("gs-escn-style");

            if (old !== null)
                old.remove();

            link.id = "gs-escn-style";
            link.href = chrome.extension.getURL(`css/image-n${msg.valor}.min.css`);

            head.appendChild(link);
        }

        if (msg.opt == 'clarear') {

            let escClarearCss = document.getElementById("gs-escc-style");

            if (msg.valor && escClarearCss === null) {
                link.id = "gs-escc-style";
                link.href = chrome.extension.getURL('css/image-clarear.min.css');

                head.appendChild(link);
            }

            if (!msg.valor && escClarearCss !== null) {
                escClarearCss.remove();
            }
        }

        sendResponse(true);
    }
});

function ready() {
    chrome.runtime.sendMessage({ init: true }, function (r) {
        if (chrome.runtime.lastError) {
            setTimeout(ready, 1000);
        }
    });
}