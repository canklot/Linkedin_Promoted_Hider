chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    document.getElementById("mydebugger").innerText += "Popup.js recived this message: "
    document.getElementById("mydebugger").innerText += message.data + "\n"
    sendResponse({
        data: "This is a reply from popup.js"
    });
});



  