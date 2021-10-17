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
var sidebar = null; //Holds a sidebar DOM Element
var myD3; //Holds the D3InfoObj that is sent to it.

//Toggles the sidebar open and closed.
//If this is somehow called while no sidebar is generated, logs to the console instead.
function toggleSidebar()
{
    //Check that sidebar exists, return if not
    if(sidebar === null)
    {
        console.log("Cannot open sidebar: doesn't exist.");
        return;
    }

    //If the sidebar is closed, open it
    if(sbOpened < 0)
    {
        document.body.style.marginRight = "260px";
        sidebar.style.width = "248px";
        sidebar.style["padding-left"] = "5px";
        sidebar.style["padding-right"] = "5px";
    }
    else //Otherwise, hide it.
    {
        document.body.style.marginRight = "0px";
        sidebar.style.width = "0px";
        sidebar.style["padding-left"] = "0px";
        sidebar.style["padding-right"] = "0px";
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
    prompt.innerHTML = "Expert Goggles:<br>Click for a guide.";
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

//generateSidebar() generates a sidebar DOM element and populates
//it with a vis. guide that was appended to the D3InfoObj sent
//from DBConn.js

function generateSidebar(guideInfo)
{
    var sb = document.createElement("div");
    sb.classList.add("sidebar");

    //Take the Object Passed by the Database and Generate the Guide
    //Title
    var titleDiv = document.createElement("div");
    var outerDiv = document.createElement("div");
    outerDiv.classList.add("titlediv");
    titleDiv.innerHTML = guideInfo["Name"] + "<br><br>";
    titleDiv.classList.add("guideTitle");
    sb.appendChild(outerDiv);
    outerDiv.appendChild(titleDiv);

    //Body
    var bodyDiv = document.createElement("div");
    bodyDiv.innerHTML = guideInfo["Guide"];
    bodyDiv.classList.add("bodyDiv");
    sb.appendChild(bodyDiv);

    return sb;
}



//Listen for a message from DBConn
chrome.runtime.onMessage.addListener(
  function(D3InfoObj, sender, sendResponse)
  {
    myD3 = D3InfoObj;

    //Test Code: Make a sidebar from the Object Recieved
    try
    {
        sidebar = generateSidebar(myD3.guide);
        document.body.appendChild(sidebar);
        createPrompt(myD3.DOMid);
    }
    catch(err)
    {
        console.log("Error in UI Generation");
        console.log(err);
    }
  }
);