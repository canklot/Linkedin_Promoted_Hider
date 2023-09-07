export function colorCurrentJob(textToHave, clear = false) {
    const wordCheckXpath = `.//*[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"),"${textToHave}")]`;
    let jobDetailsNode = document.querySelector(jobDetailsCssSelector);
    let doeshaveText = commonJs.getElementsByXPath(wordCheckXpath, jobDetailsNode);

    if (clear) {
        jobDetailsNode.firstElementChild.style.removeProperty("background-color");
        return;
    }

    if (doeshaveText.length === 0) {
        jobDetailsNode.firstElementChild.style.setProperty(
            "background-color",
            "red",
            "important"
        );
    } else if (doeshaveText.length > 0) {
        jobDetailsNode.firstElementChild.style.setProperty(
            "background-color",
            "green",
            "important"
        );
    }
}

export function setUpJobObserver(keywords) {
    jobDetailsObserver = new MutationObserver(function (mutations, observer) {
        colorJs.colorCurrentJob(keywords);
    });
}

export function startJobObserver() {
    commonJs.waitForElm(jobDetailsCssSelector).then((elm) => {
        jobDetailsObserver.observe(elm, {
            subtree: true,
            childList: true,
            characterData: true,
        });
    });
}

export function setStoreKeywords() {
    const mobileParam = "keyword";
    const desktopParam = "keywords";
    let searchParams = new URLSearchParams(document.location.search);

    if (searchParams.has(desktopParam) === true) {
        let keywords = searchParams.get(desktopParam);
        chrome.storage.local.set({ keywordsStorage: keywords }).then(() => {
            console.log("Keywords are " + keywords);
        });
    } else if (searchParams.has(mobileParam) === true) {
        let keywords = searchParams.get(mobileParam);
        chrome.storage.local.set({ keywordsStorage: keywords }).then(() => {
            console.log("Keywords are " + keywords);
        });
    }
}

export function setupUrlObserver() {
    let previousUrl = "";
    urlObserver = new MutationObserver(function (mutations) {
        if (location.href !== previousUrl) {
            previousUrl = location.href;
            console.log(`URL changed to ${location.href}`);
            colorJs.setStoreKeywords();
            colorJs.startJobObserver();
        }
    });
    urlObserver.observe(document, { subtree: true, childList: true });
}