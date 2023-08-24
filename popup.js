function onoff(){
  const currentvalue = document.getElementById('onoff').value;
  if(currentvalue == "Off"){
    document.getElementById("onoff").value="On";
    communicate()
  }else{
    document.getElementById("onoff").value="Off";
  }
}

async function communicate()
{
    const currentvalue = document.getElementById('onoff').value;
    await new Promise(r => setTimeout(r, 2000));
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {onOffStatus: currentvalue});
    document.getElementById("mydebugger").innerText += "Popup.js send a message to active tab. \n"
    document.getElementById("mydebugger").innerText += "Popup.js recived this response: "
    document.getElementById("mydebugger").innerText += response.onOffStatus + "\n"
}

communicate();
document.getElementById("onoff").addEventListener("click", onoff);
