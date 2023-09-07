let onOffStatus;
let hiddenJobCounter = 0;
let jobDetailsObserver;
let documentObserver;
let urlObserver;
let commonJs;
let jobDetailsCssSelector;
const keywordsStorageStr = "keywordsStorage";

function addStoreListenerForOnOff() {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
      if (Object.hasOwn(changes, "isOn")) {
        onOffStatus = changes.isOn.newValue;
        if (onOffStatus === true) {
          promotedJs.startDocumentObserver();
          colorJs.startJobObserver();
        } else {
          console.log("disconnect");
          jobDetailsObserver.disconnect();
          documentObserver.disconnect();
          colorJs.colorCurrentJob("", (clear = true));
        }
      }
    }
  });
}

function getOnOffStorage() {
  chrome.storage.local.get(["isOn"]).then((result) => {
    if (Object.hasOwn(result, "onOffStatus")) {
      onOffStatus = result.isOn;
    }
  });
}

(async function main() {
  const srcCommon = chrome.runtime.getURL("./common.js");
  commonJs = await import(srcCommon);
  const srcPromoted = chrome.runtime.getURL("./promoted.js");
  promotedJs = await import(srcPromoted);
  const srcColor = chrome.runtime.getURL("./color.js");
  colorJs = await import(srcColor);


  getOnOffStorage();
  if (commonJs.mobileCheck()) {
    jobDetailsCssSelector = ".job-description";
  } else {
    jobDetailsCssSelector = "#job-details";
  }
  colorJs.setupUrlObserver();
  chrome.storage.local.get([keywordsStorageStr]).then((result) => {
    if (Object.hasOwn(result, keywordsStorageStr)) {
      // if search has quotas it causes bug sanitize keywords
      promotedJs.setUpDocumentObserver();
      colorJs.setUpJobObserver(result.keywordsStorage);
      promotedJs.startDocumentObserver();
      colorJs.startJobObserver();
    }
  });
  addStoreListenerForOnOff();
  promotedJs.addRuntimeListener();
})();
