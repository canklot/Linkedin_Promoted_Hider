"use strict";
async function hidePromotedJobs(promotedText) {
  let PromotedHiderOnOffStatus = await getPromotedHiderOnOffStatus();
  if (!PromotedHiderOnOffStatus) {
    console.log("Promoted hider is off");
    return;
  }
  const notHiddenPromotedXpath = `//li[contains(.,'${promotedText}') and not(contains(@style,'display: none'))]`;
  const elements = commonJs.getElementsByXPath(notHiddenPromotedXpath);
  elements.forEach(commonJs.hideElement);
}

async function getPromotedHiderOnOffStatus() {
  let result = await chrome.storage.local.get([commonJs.promotedHiderOnOffKey]);

  if (result[commonJs.promotedHiderOnOffKey] == undefined) {
    await chrome.storage.local.set({ [commonJs.promotedHiderOnOffKey]: true });
    console.log("Undefined detected. Storage commonJs.promotedHiderOnOffKey is set to " + true);
    result = await chrome.storage.local.get([commonJs.promotedHiderOnOffKey]);
  }

  if (Object.hasOwn(result, commonJs.promotedHiderOnOffKey)) {
    return result[commonJs.promotedHiderOnOffKey];
  }
}

export function setUpDocumentObserver() {
  documentObserver = new MutationObserver(function (mutations, observer) {
    // code below fired when a mutation occurs
    commonJs.otherLangsList.forEach((lang) => {
      hidePromotedJobs(lang);
    });
  });
}

export function startDocumentObserver() {
  documentObserver.observe(document, { subtree: true, attributes: true });
}

export function addRuntimeListener() {
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.data === "getCount") {
      sendResponse({ data: hiddenJobCounter });
    }
  });
}