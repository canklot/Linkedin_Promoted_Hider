const onOffButton = document.getElementById('onoff');

function onoff() {
    if (onOffButton.value == "off") {
        onOffButton.value = "on";
    }
    else if (onOffButton.value == "on") {
        onOffButton.value = "off";
    }
    chrome.storage.local.set({ isOn: onOffButton.value }).then(() => {
        console.log("Value is set to " + onOffButton.value);
    });
}

function checkIsOnUndefined() {
    chrome.storage.local.get(["isOn"]).then((result) => {
        if (result.isOn == undefined) {
            chrome.storage.local.set({ isOn: "on" }).then(() => {
                console.log("Value is set to " + "on");
            });
        }
    });
}

function updateButtontext() {
    chrome.storage.local.get(["isOn"]).then((result) => {
        onOffButton.value = result.isOn;
    });
}


(async () => {

    checkIsOnUndefined();
    updateButtontext();
    document.getElementById("onoff").addEventListener("click", onoff);

})();




//await new Promise(r => setTimeout(r, 1000));