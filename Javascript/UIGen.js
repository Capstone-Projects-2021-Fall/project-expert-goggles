/**
*                      Expert Goggles UI Generation
*   UIGen.js represents the scripts for the Extension's UI Generation.
*   It listens for information from the Database Connector (DBConn.js),
*   then generates a floating prompt to the user near the DOM element
*   associated with the DOMid that was passed to it. When the prompt is
*   clicked, it splits the page with a sidebar holding the visualization
*   guide that was sent to it from the Database Connector.
*/

"use strict";

//Internal Variables
var sbOpened = -1; //-1 if the Sidebar is not currently showing, 1 if so.
var sb = null; //Holds a sidebar DOM Element

//Toggles the sidebar open and closed.
//If this is somehow called while no sidebar is generated, logs to the console instead.
function toggleSidebar()
{
    //Check that sidebar exists, return if not
    if(sb === null)
    {
        console.log("Cannot open sidebar: doesn't exist.");
        return;
    }

    //If the sidebar is closed, open it
    if(sbOpened < 0)
    {
        document.body.style.marginRight = "250px";
        sb.style.width = "250px";
    }
    else //Otherwise, hide it.
    {
        document.body.style.marginRight = "0px";
        sb.style.width = "0px";
    }

    sbOpened *= -1;
    return;
}

//createPrompt(id) uses the DOM id passed to it from the rest of the program, and generates
//a floating prompt near that DOM element on the page.
function createPrompt(id)
{
    var d3 = document.getElementById(id);

    var prompt = document.createElement("div");
    prompt.innerHTML = "Expert Goggles!";
    prompt.classList.add("prompt");
    prompt.id = "ExpertGoggles";
    d3.appendChild(prompt);

    window.onclick = function(event)
    {
        if(event.target.id == "ExpertGoggles")
            toggleSidebar();
    }
    return;
}

//Listen for a message from DBConn
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

try
{
    sb = document.createElement("div");
    sb.classList.add("sidebar");
    sb.innerHTML = "Hello World!";
    document.body.appendChild(sb);
    createPrompt("test");
    console.log("prompt created.");
}