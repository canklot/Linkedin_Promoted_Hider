/* function myalert(){alert("myalert");}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "myalert") {
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        function: myalert,
        args: [request.text],
      });
    }
  }); */

  // background.js
  chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['content.js']
    });
  });