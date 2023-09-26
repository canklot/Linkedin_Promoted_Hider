//"use strict";
let hiddenJobCounter = 0;
let jobDetailsObserver;
let documentObserver;
let urlObserver;
let commonJs;
let jobDetailsCssSelector;
let colorJs;
let jobTitleSelector;
const keywordsKey = "keywords";

async function colorCurrentJob() {
  let ColorJobsOnOffStatus = await getColorJobsOnOffStatus();
  if (!ColorJobsOnOffStatus) {
    console.log("Job painter is off");
    return;
  }

  let keywords;
  let result = await chrome.storage.local.get([keywordsKey]);
  if (Object.hasOwn(result, keywordsKey)) {
    // if search has quotas it causes bug sanitize keywords
    keywords = result[keywordsKey].toLowerCase();
  }
  console.log(keywords);
  const wordCheckXpath = `.//*[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"),"${keywords}")]`;
  // maybe I can recursivly check if node and childs have text
  let jobDetailsNode = document.querySelector(jobDetailsCssSelector);
  let doeshaveText = commonJs.getElementsByXPath(
    wordCheckXpath,
    jobDetailsNode
  );

  if (doeshaveText.length === 0) {
    document
      .querySelector(jobTitleSelector)
      .style.setProperty("background-color", "red", "important");
  } else if (doeshaveText.length > 0) {
    document
      .querySelector(jobTitleSelector)
      .style.setProperty("background-color", "green", "important");
  }
}

function clearCurrentJob() {
  let jobTitleNode = document.querySelector(jobTitleSelector);
  jobTitleNode.style.removeProperty("background-color");
}

async function setUpJobObserver() {
  // Cant just use UrlObserver to call colorCurrentJob() bacause on desktop version jobdetail loads asynchronously
  // Generally a few cycles after url changes
  jobDetailsObserver = new MutationObserver(colorCurrentJob);
  let jobDetailsNode = await commonJs.waitForElm(jobDetailsCssSelector);
  // Because JobDeails node is static in mobile version and page navigation causes a full page load
  // it causes JobDetailsObserver to loose its data and not fire.
  // Because of that colorCurrentJob() need to be called manually.
  colorCurrentJob();

  jobDetailsObserver.observe(jobDetailsNode, {
    subtree: true,
    childList: true,
    characterData: true,
  });
}

function saveKeywordsToLocalStorage() {
  const mobileParam = "keyword";
  const desktopParam = "keywords";
  let searchParams = new URLSearchParams(document.location.search);

  if (searchParams.has(desktopParam)) {
    let keywords = searchParams.get(desktopParam);
    chrome.storage.local.set({ [keywordsKey]: keywords });
  } else if (searchParams.has(mobileParam)) {
    let keywords = searchParams.get(mobileParam);
    chrome.storage.local.set({ [keywordsKey]: keywords });
  }
}

function setupUrlObserver() {
  let previousUrl = "";
  urlObserver = new MutationObserver(function (mutations) {
    if (location.href !== previousUrl) {
      previousUrl = location.href;
      console.log(`URL changed to ${location.href}`);
      saveKeywordsToLocalStorage();
      // When navigating to another page from jobs page jobs node element deleted causing observerto not work anymore. I migh have fixed this.
      setUpJobObserver();
    }
  });
  urlObserver.observe(document, { subtree: true, childList: true });
}

function ClearColorWhenTurnedOff() {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );

      if (Object.hasOwn(changes, commonJs.colorJobsOnOffKey)) {
        if (changes[commonJs.colorJobsOnOffKey].newValue === false) {
          clearCurrentJob();
        }
      }
    }
  });
}

async function getColorJobsOnOffStatus() {
  let result = await chrome.storage.local.get([commonJs.colorJobsOnOffKey]);

  if (result[commonJs.colorJobsOnOffKey] == undefined) {
    await chrome.storage.local.set({ [commonJs.colorJobsOnOffKey]: true });
    console.log("Undefined detected. Storage commonJs.colorJobsOnOffKey is set to " + true);
    result = await chrome.storage.local.get([commonJs.colorJobsOnOffKey]);
  }

  if (Object.hasOwn(result, commonJs.colorJobsOnOffKey)) {
    return result[commonJs.colorJobsOnOffKey];
  }
}

function setCssSelector() {
  if (commonJs.mobileCheck()) {
    jobDetailsCssSelector = ".job-description";
    jobTitleSelector = '[class="position-overview"] dt';
  } else {
    jobDetailsCssSelector = "#job-details";
    jobTitleSelector = '[class*="jobs-unified-top-card__job-title"]';
  }
}

(async function main() {
  const srcCommon = chrome.runtime.getURL("./common.js");
  const srcPromoted = chrome.runtime.getURL("./promoted.js");

  commonJs = await import(srcCommon);
  promotedjs = await import(srcPromoted);


  ClearColorWhenTurnedOff();
  setCssSelector();
  setupUrlObserver();
  promotedjs.setUpDocumentObserver();
  promotedjs.startDocumentObserver();
  promotedjs.addRuntimeListener();
})();
