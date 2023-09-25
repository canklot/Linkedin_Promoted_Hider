const onOffButton = document.getElementById("onoff");
const onOffKey = "isOn";

function onoff() {
    chrome.storage.local.set({ [onOffKey]: onOffButton.checked }).then(() => {
        console.log("Value is set to " + onOffButton.checked);
    });
}


function updateButtonState() {
    chrome.storage.local.get([onOffKey]).then((result) => {
        onOffButton.checked = result.isOn;
    });
}

async function getHiddenCountFromContentScript() {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { data: "getCount" });
    return response.data;
}

(async function main() {
    updateButtonState();
    onOffButton.addEventListener("click", onoff);
    //document.getElementById("hidden-counter").innerText = await getHiddenCountFromContentScript();

})();
