const colorJobsOnOffButton = document.getElementById("color-jobs-on-off");
const promotedHiderOnOffButton = document.getElementById("promoted-hider-on-off");

function colorJobsOnOffToggle() {
    chrome.storage.local.set({ [commonJs.colorJobsOnOffKey]: colorJobsOnOffButton.checked }).then(() => {
        console.log("Value is set to " + colorJobsOnOffButton.checked);
    });
}

function promotedHiderOnOffToggle() {
    chrome.storage.local.set({ [commonJs.promotedHiderOnOffKey]: promotedHiderOnOffButton.checked }).then(() => {
        console.log("Value is set to " + promotedHiderOnOffButton.checked);
    });
}

function updateButtonState() {
    chrome.storage.local.get([commonJs.colorJobsOnOffKey]).then((result) => {
        colorJobsOnOffButton.checked = result[commonJs.colorJobsOnOffKey];
    });
    chrome.storage.local.get([commonJs.promotedHiderOnOffKey]).then((result) => {
        promotedHiderOnOffButton.checked = result[commonJs.promotedHiderOnOffKey];
    });
}

async function getHiddenCountFromContentScript() {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { data: "getCount" });
    return response.data;
}

(async function main() {
    const srcCommon = chrome.runtime.getURL("./common.js");
    commonJs = await import(srcCommon);


    updateButtonState();
    colorJobsOnOffButton.addEventListener("click", colorJobsOnOffToggle);
    colorJobsOnOffButton.addEventListener("click", promotedHiderOnOffToggle);

    //document.getElementById("hidden-counter").innerText = await getHiddenCountFromContentScript();

})();
