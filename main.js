



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

function detectLanguage(){
  const messagesXpath = '//*[@id="msg-overlay"]/div[1]/header/div[2]/button/span/span[1]'
  const elemets = getElementsByXPath(messagesXpath);
  const homePageText = elemets[0].textContent
  if(homePageText=="Mesajlaşma"){
    return "Öne çıkarılan içerik";
  }
  if(homePageText=="Home"){
    return "Promoted";
  }
  
}

detectLanguage();

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
