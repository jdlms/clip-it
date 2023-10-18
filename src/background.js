chrome.action.onClicked.addListener(() => {
  const url = chrome.runtime.getURL("my_page.html");
  chrome.tabs.create({ url });
});
