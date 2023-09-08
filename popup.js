const onOffButton = document.getElementById('onoff');

function onoff() {
    chrome.storage.local.set({ isOn: onOffButton.checked }).then(() => {
        console.log("Value is set to " + onOffButton.checked);
    });
}

function checkStorageUndefined() {
    chrome.storage.local.get(["isOn"]).then((result) => {
        if (result.isOn == undefined) {
            chrome.storage.local.set({ isOn: true }).then(() => {
                console.log("Undefined detected. Storage isOn is set to " + true);
            });
        }
    });
}

function updateButtonState() {
    chrome.storage.local.get(["isOn"]).then((result) => {
        onOffButton.checked = result.isOn;
    });
}

async function getHiddenCountFromContentScript() {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { data: "getCount" });
    return response.data;
}

(async function main() {
    checkStorageUndefined();
    updateButtonState();
    document.getElementById("onoff").addEventListener("click", onoff);
    //document.getElementById("hidden-counter").innerText = await getHiddenCountFromContentScript();

})();
