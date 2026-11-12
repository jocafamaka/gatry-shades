chrome.omnibox.onInputEntered.addListener(
  function (txt) {
    var url = 'https://gatry.com/promocoes?q=' + encodeURIComponent(txt);
    chrome.tabs.create({ url: url });
  });
