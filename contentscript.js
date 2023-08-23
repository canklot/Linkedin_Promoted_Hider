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
var timer = 0;
  var si = setInterval(() => {
            try {
               chrome.runtime.sendMessage({
                    data: "This is a message send by contentscript"
                }, function (response) {
                    console.dir(response.data);
                });
                timer++;
                if (timer === 3) {
                    clearInterval(si);
                }
            } catch (error) {
                // debugger;
                console.log(error);
            }
        }, 2000);
