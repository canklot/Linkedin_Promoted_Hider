alert("hello world");
main();

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
  const promotedxpath = '//*[@id="ember152"]/div/div[1]/ul/li[1]'
  const elemets = getElementsByXPath("//node()[div/a[contains(text(), 'Attributes')]]");
  
  elemets.forEach(hideElement);
}


