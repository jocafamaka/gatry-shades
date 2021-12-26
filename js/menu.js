function init() {
    chrome.storage.local.get("gs_config", function (items) {

        if (Object.keys(items).length === 0) {
            items = {
                tema: "true-dark",
                escurecer: true,
                escurecerClarear: true,
                escurecerNivel: 2
            }
        } else if (items.hasOwnProperty('gs_config')) {
            items = items.gs_config;
        }

        config = items;

        atualizarMenu();

        $('#temaOpt').on('change', function () {
            alterarOpc('tema', this.value);
        });

        $('#escurecerOpt').on('change', function () {
            alterarOpc('esc', this.checked);
        });

        $('#escurecerNivelOpt').on('change', function () {
            alterarOpc('nivel', this.value);
        });

        $('#escurecerClarearOpt').on('change', function () {
            alterarOpc('clarear', this.checked);
        });

        $('#gitLink').on('click', function () {
            chrome.tabs.create({ url: "https://github.com/jocafamaka/gatry-shades" });
        });

        $("#opcoes").css("opacity", 1);
    });
}

function salvarConfig() {
    chrome.storage.local.set({ "gs_config": config });
}

function atualizarMenu() {
    tema = $("#temaOpt");
    esc = $("#escurecerOpt");
    nivel = $("#escurecerNivelOpt");
    clarear = $("#escurecerClarearOpt");

    tema.children().each(function (i, e) {
        if (e.value == config.tema)
            $(e).attr('selected', 'selected');
        else
            $(e).removeAttr("selected");
    })

    esc.prop("checked", config.escurecer);

    nivel.children().each(function (i, e) {
        if (e.value == config.escurecerNivel)
            $(e).attr('selected', 'selected');
        else
            $(e).removeAttr("selected");
    })

    clarear.prop("checked", config.escurecerClarear);

    if (esc.prop("checked")) {
        nivel.prop("disabled", false);
        clarear.prop("disabled", false);
        clarear.parent().removeClass("disabled");
    }
    else {
        nivel.prop("disabled", true);
        clarear.prop("disabled", true);
        clarear.parent().addClass("disabled");
    }
}

function alterarOpc(item, valor) {
    if (item == 'tema') {
        config.tema = valor;
    }

    if (item == 'esc') {
        config.escurecer = valor;
    }

    if (item == 'nivel') {
        config.escurecerNivel = valor;
    }

    if (item == 'clarear') {
        config.escurecerClarear = valor;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { opt: item, valor: valor, config: config }, function (r) {
            if (chrome.runtime.lastError) {
                exibirAviso();
            }
        });
    });

    salvarConfig();
    atualizarMenu();
}

function exibirAviso() {
    $("#gitLink").css("display", "none");
    $("#aviso").css("display", "block");
    setTimeout(function () { $("#aviso").css("opacity", "1") }, 100);
}

$(document).ready(function () {
    init();
});