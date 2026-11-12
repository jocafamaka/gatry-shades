let config = gsConfig.normalize();

function init() {
    chrome.storage.local.get("gs_config", function (items) {

        config = gsConfig.normalize(items.gs_config);

        atualizarMenu();

        $('input[name="temaOpt"]').on('change', function () {
            alterarOpc('tema', this.value);
        });

        $('input[name="corDestaqueOpt"]').on('change', function () {
            alterarOpc('accent', this.value);
        });

        $('#estiloRetroOpt').on('change', function () {
            alterarOpc('retro', this.checked);
        });

        $('#escurecerOpt').on('change', function () {
            alterarOpc('esc', this.checked);
        });

        $('input[name="escurecerNivelOpt"]').on('change', function () {
            alterarOpc('nivel', this.value);
        });

        $('#escurecerClarearOpt').on('change', function () {
            alterarOpc('clarear', this.checked);
        });

        $('#gitLink').on('click', function (event) {
            event.preventDefault();
            chrome.tabs.create({ url: "https://github.com/jocafamaka/gatry-shades" });
        });
    });
}

function salvarConfig() {
    chrome.storage.local.set({ "gs_config": config });
}

function atualizarMenu() {
    const tema = $('input[name="temaOpt"]');
    const esc = $("#escurecerOpt");
    const nivel = $('input[name="escurecerNivelOpt"]');
    const clarear = $("#escurecerClarearOpt");

    $('input[name="corDestaqueOpt"]').each(function (i, e) {
        e.checked = e.value === config.corDestaque;
    });
    $('#estiloRetroOpt').prop('checked', config.estiloRetro);
    const accents = { original: 'Original', blue: 'Azul', green: 'Verde', amber: 'Âmbar' };
    $('#corDestaqueNome').text(accents[config.corDestaque]);

    if (config.corDestaque === 'original') {
        document.documentElement.removeAttribute('data-gs-accent');
    } else {
        document.documentElement.setAttribute('data-gs-accent', config.corDestaque);
    }

    tema.each(function (i, e) {
        e.checked = e.value === config.tema;
    });

    esc.prop("checked", config.escurecer);

    nivel.each(function (i, e) {
        e.checked = Number(e.value) === config.escurecerNivel;
    });

    clarear.prop("checked", config.escurecerClarear);

    const disabled = !config.escurecer;
    nivel.prop("disabled", disabled);
    clarear.prop("disabled", disabled);
    $('#imagemOpcoes').toggleClass('is-disabled', disabled);
}

function alterarOpc(item, valor) {
    if (item == 'tema') {
        config.tema = valor;
    }

    if (item == 'accent') {
        config.corDestaque = valor;
    }

    if (item == 'retro') {
        config.estiloRetro = valor;
    }

    if (item == 'esc') {
        config.escurecer = valor;
    }

    if (item == 'nivel') {
        config.escurecerNivel = Number(valor);
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
    $("#aviso").prop("hidden", false);
}

$(document).ready(function () {
    init();
});
