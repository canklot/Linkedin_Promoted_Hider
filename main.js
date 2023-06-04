//alert("extension activated");

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
    // fired when a mutation occurs
    hidePromotedJobs();
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document, {
  subtree: true,
  attributes: true
});

/* chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "changePromotedLanguage") {
    chrome.scripting.executeScript({
      function: processPageElements,
      args: [request.text],
    });
  }
}); */

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

function hidePromotedJobs(promotedText= 'Promoted'){
  //Template literals are literals delimited with backtick (`) characters, string interpolation with embedded expressions
  const promotedxpath = `//node()[div/div[1]/ul/li[1][contains(text(), '${promotedText}')]]`
  const elemets = getElementsByXPath(promotedxpath);
  elemets.forEach(hideElement);
}


