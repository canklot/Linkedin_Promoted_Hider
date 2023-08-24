function onoff(){
  const currentvalue = document.getElementById('onoff').value;
  if(currentvalue == "Off"){
    document.getElementById("onoff").value="On";
  }else{
    document.getElementById("onoff").value="Off";
  }
  updateContentScriptStatus();
}

async function updateContentScriptStatus()
{
    const currentvalue = document.getElementById('onoff').value;
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {data: currentvalue});
    document.getElementById("mydebugger").innerText += "Popup.js send a message to active tab. \n"
    document.getElementById("mydebugger").innerText += "Popup.js recived this response: "
    document.getElementById("mydebugger").innerText += response.onOffStatus + "\n"
}

async function getStatusFromContentScript()
{
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {data: "getStatus"});
    return response.data;
}


(async() => {
    //await new Promise(r => setTimeout(r, 1000));
    document.getElementById('onoff').value = await getStatusFromContentScript();
    document.getElementById("onoff").addEventListener("click", onoff);
  })();



