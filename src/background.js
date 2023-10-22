chrome.action.onClicked.addListener(() => {
  const url = chrome.runtime.getURL("src/index.html");
  chrome.tabs.create({ url });
});
