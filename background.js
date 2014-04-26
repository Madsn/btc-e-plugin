// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  console.log("Injecting JS");
  chrome.tabs.executeScript({
    file: "inject.js"
  });
});
