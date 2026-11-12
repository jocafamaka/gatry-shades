const gsConfig = {
    defaults: Object.freeze({
        tema: "true-dark",
        corDestaque: "original",
        estiloRetro: false,
        escurecer: true,
        escurecerClarear: true,
        escurecerNivel: 2
    }),

    normalize(value) {
        const config = value && typeof value === "object" ? value : {};
        const level = Number(config.escurecerNivel);

        return {
            tema: ["original", "true-dark", "dim"].includes(config.tema) ? config.tema : this.defaults.tema,
            corDestaque: ["original", "blue", "green", "amber"].includes(config.corDestaque) ? config.corDestaque : this.defaults.corDestaque,
            estiloRetro: typeof config.estiloRetro === "boolean" ? config.estiloRetro : this.defaults.estiloRetro,
            escurecer: typeof config.escurecer === "boolean" ? config.escurecer : this.defaults.escurecer,
            escurecerClarear: typeof config.escurecerClarear === "boolean" ? config.escurecerClarear : this.defaults.escurecerClarear,
            escurecerNivel: [1, 2, 3].includes(level) ? level : this.defaults.escurecerNivel
        };
    }
};
