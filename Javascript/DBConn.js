/**
    This is a placeholder file for the Database Connector code.
    Currently, it is hardcoded to show flow of execution for the extension.
*/

"use strict";

console.log("DBConn class is running.");
var myD3 = {};

//MockUp Function for sending the object to the UIGenerator
function sendToUI(sentObj)
{
    try
        {
            chrome.tabs.sendMessage(myD3.tab, sentObj);
        }
        catch(err)
        {
            console.log(err);
            console.log(sentObj);
        }
}

//Listens for a message from the Scraper
chrome.runtime.onMessage.addListener(
  function(D3InfoObj, sender, sendResponse)
  {
    myD3 = D3InfoObj;
    myD3.tab = sender.tab.id;

    //Populates Guide and sends a fake message to the UIGenerator
    myD3.guide = "Pie Charts are just fabulous.";
    console.log("Sending: " + myD3);
    sendToUI(myD3);
  }
);


