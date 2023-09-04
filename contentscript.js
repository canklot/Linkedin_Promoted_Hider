let onOffStatus;
let hiddenJobCounter = 0;
const jobDetailsXpath = "//*[@id='job-details']"
const jobDetailsCssSelector = "#job-details"

// Add your translation of promoted to this list
const otherLangsList = ["Promoted", "Öne çıkarılan içerik", "Anzeige", "Promocionado", "Sponsorisé"];

function getElementsByXPath(xpath, baseNode = document) {
  // I dont know how to use base node
  const elements = [];
  const query = document.evaluate(xpath, baseNode, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

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
  // Discarding already hidden elemets to prevent duplicate counting
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

function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

function getAllJobListing() {
  const xpathForJobListing = "//*[contains(@class, 'job-card-container--clickable')]";
  const jobListings = getElementsByXPath(xpathForJobListing);
  return jobListings;
}

function* clicker(jobListings) {
  for (let element in jobListings) {
    element.click();
    yield;
  }
}

/* function filterJobsWithWord() {
  //const wordCheckXpath = "//*[contains(text(),'python')]"
  // xpath to check if given text exist. Uses translate for working case insensitive
  const wordCheckXpath = "//text()[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),'python')]"
  const jobDetailsXpath = "//*[@id='job-details']"
  let jobListings = getAllJobListing();
  let jobIter = jobListings[Symbol.iterator]();
  let clickme = jobIter.next();
  while (!clickme.done) {

    clickme.value.click();
    let jobDescriptionNode = getElementsByXPath(jobDetailsXpath)[0];
    let doeshaveText = getElementsByXPath(wordCheckXpath, jobDescriptionNode);
    if (doeshaveText.length === 0) {
      clickme.value.style.display = "none";
    }
  }
} */

function filterCurrentJob(textToHave) {
  const wordCheckXpath = `.//*[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"),"${textToHave}")]`
  let jobDetailsNode = document.querySelector(jobDetailsCssSelector)
  let doeshaveText = getElementsByXPath(wordCheckXpath, jobDetailsNode);
  if (doeshaveText.length === 0) {
    jobDetailsNode.style.backgroundColor = "red";
  }
  else if (doeshaveText.length > 0) {
    jobDetailsNode.style.backgroundColor = "green";
  }
}

function setUpObservers() {
  var documentObserver = new MutationObserver(function (mutations, observer) {
    // code below fired when a mutation occurs
    otherLangsList.forEach(lang => {
      hidePromotedJobs(lang);
    });
  });

  // define what element should be observed by the observer
  // and what types of mutations trigger the callback
  documentObserver.observe(document, {
    subtree: true,
    attributes: true
  });

  var jobDetailsObserver = new MutationObserver(function (mutations, observer) {
    // code below fired when a mutation occurs
    filterCurrentJob("python");
  });

  //let jobDetailsNode = document.querySelector(jobDetailsCssSelector)
  waitForElm(jobDetailsCssSelector).then((elm) => {
    console.log('Element is ready');
    jobDetailsObserver.observe(elm, {
      subtree: true,
      attributes: true
    });
  });

}

(function main() {
  chrome.storage.local.get(["isOn"]).then((result) => {
    onOffStatus = result.isOn;
  });

  setUpObservers();
  addStoreListenerForOnOff();
  addRuntimeListener();

})();

