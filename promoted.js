export function hidePromotedJobs(promotedText) {
  const notHiddenPromotedXpath = `//li[contains(.,'${promotedText}') and not(contains(@style,'display: none'))]`;
  const elements = commonJs.getElementsByXPath(notHiddenPromotedXpath);
  elements.forEach(commonJs.hideElement);
}

export function setUpDocumentObserver() {
  documentObserver = new MutationObserver(function (mutations, observer) {
    // code below fired when a mutation occurs
    commonJs.otherLangsList.forEach((lang) => {
      //promotedJs.hidePromotedJobs(lang);
      console.log("no more hide for debug");
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