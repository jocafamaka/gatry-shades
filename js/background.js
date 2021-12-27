chrome.omnibox.onInputEntered.addListener(
  function (txt) {
    var url = 'https://gatry.com/promocoes?q=' + encodeURIComponent(txt);
    chrome.tabs.create({ url: url });
  });

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {

  if (sender.id === chrome.runtime.id && msg.init) {
    chrome.storage.local.get("gs_config", function (config) {

      if (Object.keys(config).length === 0) {
        config = {
          tema: "true-dark",
          escurecer: true,
          escurecerClarear: true,
          escurecerNivel: 2
        }
      } else if (config.hasOwnProperty('gs_config')) {
        config = config.gs_config;
      }

      chrome.tabs.sendMessage(sender.tab.id, { opt: 'tema', valor: config.tema, config: config }, function (r) { });
      chrome.tabs.sendMessage(sender.tab.id, { opt: 'esc', valor: config.escurecer, config: config }, function (r) { });
      chrome.tabs.sendMessage(sender.tab.id, { opt: 'clarear', valor: config.escurecerClarear, config: config }, function (r) { });
    });

    sendResponse(true);
  }
});