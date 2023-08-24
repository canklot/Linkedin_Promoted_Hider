let onOffStatus = "On";

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

function hidePromotedJobs(promotedText){
  if (onOffStatus==="Off"){
    return;
  }
  //Template literals are literals delimited with backtick (`) characters, string interpolation with embedded expressions
  const promotedxpath = `//li[contains(. , '${promotedText}')]`
  //li[contains(.,'Promoted')]
  const elemets = getElementsByXPath(promotedxpath);
  elemets.forEach(hideElement);
}

const otherLangsList = ["Promoted","Öne çıkarılan içerik","Anzeige","Promocionado","Sponsorisé"];

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
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

// Test messaging

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log( "Contentscript recieved the on off status");
    if (request.data === "On" || request.data === "Off"){
      onOffStatus = request.data;
      sendResponse({onOffStatus: "Contentscript recieved the on off status"});
    }
    else if(request.data==="getStatus")
      sendResponse({data: onOffStatus});
    else{
      sendResponse({data: "Wrong parameter"});
    }
  }
);

console.log("content script counter");
