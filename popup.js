chrome.storage.local.set({ key: "myvalue3" }).then(() => {
    alert("Value is set");
});

document.addEventListener("DOMContentLoaded", () => {
    const hideButton = document.getElementById("hideButton");
    hideButton.addEventListener("click", () => {
      const text = document.getElementById("text").value;
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content.js']
      });
      //chrome.runtime.sendMessage({ action: "myalert", text });
    });
  });


  