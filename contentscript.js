let onOffStatus;

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

function hideElement(element) { element.style.display = "none"; }

function hidePromotedJobs(promotedText) {
  if (onOffStatus == false) {
    // maybe do === "false"
    return;
  }

  //Template literals are literals delimited with backtick (`) characters, string interpolation with embedded expressions
  const promotedxpath = `//li[contains(. , '${promotedText}')]`
  //li[contains(.,'Promoted')]
  const elemets = getElementsByXPath(promotedxpath);
  elemets.forEach(hideElement);
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

  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
      onOffStatus = changes.isOn.newValue;
    }
  });
})();

