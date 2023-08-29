let onOffStatus;
let hiddenJobCounter = 0;
const otherLangsList = ["Promoted", "Öne çıkarılan içerik", "Anzeige", "Promocionado", "Sponsorisé"];

function getElementsByXPath(xpath) {
  const elements = [];
  const query = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

  let node = query.iterateNext();
  while (node) {
    elements.push(node);
    node = query.iterateNext();
  }
  return elements;
}

function hideElement(element) {
  element.style.display = "none";
  hiddenJobCounter++;
  console.log(hiddenJobCounter);
}

function hidePromotedJobs(promotedText) {
  if (onOffStatus == false) {
    return;
  }

  // Uses template literals with backtick (`) characters to use string interpolation with embedded expressions
  // Xpath for finding li elements with promoted text in all languages
  // Discarding already hidden elemets
  // Plain version for testing //li[contains(.,'Promoted') and not(contains(@style,'display: none'))]
  const notHiddenPromotedXpath = `//li[contains(.,'${promotedText}') and not(contains(@style,'display: none'))]`
  const elements = getElementsByXPath(notHiddenPromotedXpath);
  elements.forEach(hideElement);
}

function addStoreListenerForOnOff() {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
      onOffStatus = changes.isOn.newValue;
    }
  });
}

function addRuntimeListener() {
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      console.log("Contentscript recieved someting");
      if (request.data === "getCount") {
        sendResponse({ data: hiddenJobCounter });
      }
      else {
        sendResponse({ data: "Wrong parameter" });
      }
    }
  );

}

(function main() {

  chrome.storage.local.get(["isOn"]).then((result) => {
    onOffStatus = result.isOn;
  });

  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  var observer = new MutationObserver(function (mutations, observer) {
    // fired when a mutation occurs
    otherLangsList.forEach(lang => {
      hidePromotedJobs(lang);
    });
  });

  // define what element should be observed by the observer
  // and what types of mutations trigger the callback
  observer.observe(document, {
    subtree: true,
    attributes: true
  });

  addStoreListenerForOnOff();
  addRuntimeListener();
})();

