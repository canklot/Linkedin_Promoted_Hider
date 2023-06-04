document.addEventListener("DOMContentLoaded", () => {
    const hideButton = document.getElementById("hideButton");
    hideButton.addEventListener("click", () => {
      const text = document.getElementById("text").value;
      chrome.runtime.sendMessage({ action: "changePromotedLanguage", text });
    });
  });
  