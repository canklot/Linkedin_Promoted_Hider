alert("extension activated");
setTimeout(main, 11000);
setTimeout(function(){alert("extension finished"); }, 11000); 

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

function main(){
  const promotedxpath = "//node()[div/div[1]/ul/li[1][contains(text(), 'Promoted')]]"
  const elemets = getElementsByXPath(promotedxpath);
  
  elemets.forEach(hideElement);
}


