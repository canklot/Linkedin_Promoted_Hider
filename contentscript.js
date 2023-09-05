let onOffStatus;
let hiddenJobCounter = 0;
let jobDetailsObserver;
let documentObserver;
//const jobDetailsXpath = "//*[@id='job-details']"
let jobDetailsCssSelector;

// Add your translation of promoted to this list
const otherLangsList = ["Promoted", "Öne çıkarılan içerik", "Anzeige", "Promocionado", "Sponsorisé"];

function getElementsByXPath(xpath, contextNode = document) {
  // When using contextNode use .// selector. 
  // Because even when you specify a context, the path is relative to the root for some reason
  const elements = [];
  const query = document.evaluate(xpath, contextNode, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

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
      if (onOffStatus === true) {
        startObservers();
      }
      else {
        jobDetailsObserver.disconnect();
        documentObserver.disconnect();
        colorCurrentJob("", clear = true);
      }
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

function mobileCheck() {
  let check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};


/* function getAllJobListing() {
  const xpathForJobListing = "//*[contains(@class, 'job-card-container--clickable')]";
  const jobListings = getElementsByXPath(xpathForJobListing);
  return jobListings;
}

function* clicker(jobListings) {
  for (let element in jobListings) {
    element.click();
    yield;
  }
} */

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

function colorCurrentJob(textToHave, clear = false) {
  const wordCheckXpath = `.//*[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"),"${textToHave}")]`
  let jobDetailsNode = document.querySelector(jobDetailsCssSelector)
  let doeshaveText = getElementsByXPath(wordCheckXpath, jobDetailsNode);

  if (clear) {
    jobDetailsNode.firstElementChild.style.removeProperty('background-color');
    return
  }
  // maybe add color selector for user
  if (doeshaveText.length === 0) {
    jobDetailsNode.firstElementChild.style.setProperty('background-color', 'red', 'important');
  }
  else if (doeshaveText.length > 0) {
    jobDetailsNode.firstElementChild.style.setProperty('background-color', 'green', 'important');
  }

}

function setUpObservers() {
  documentObserver = new MutationObserver(function (mutations, observer) {
    // code below fired when a mutation occurs
    otherLangsList.forEach(lang => {
      hidePromotedJobs(lang);
    });
  });

  jobDetailsObserver = new MutationObserver(function (mutations, observer) {
    colorCurrentJob("python");
  });

  startObservers();
}

function startObservers() {
  // define what element should be observed by the observer
  // and what types of mutations trigger the callback
  documentObserver.observe(document, {
    subtree: true,
    attributes: true
  });

  waitForElm(jobDetailsCssSelector).then((elm) => {
    jobDetailsObserver.observe(elm, {
      subtree: true,
      childList: true,
      attributes: false,
      characterData: true
    });
  });

}

(function main() {
  chrome.storage.local.get(["isOn"]).then((result) => {
    onOffStatus = result.isOn;
  });

  console.log("is mobile " + mobileCheck());
  if (mobileCheck()) {
    jobDetailsCssSelector = ".job-description"
  }
  else {
    jobDetailsCssSelector = "#job-details";
  }

  setUpObservers();
  addStoreListenerForOnOff();
  addRuntimeListener();

})();

