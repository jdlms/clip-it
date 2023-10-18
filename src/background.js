chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: "my_page.html" });
});
