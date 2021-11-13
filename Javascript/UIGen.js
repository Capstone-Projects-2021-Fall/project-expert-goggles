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
function createPrompt()
{
    //Try to find an svg to place the prompt by
    var d3 = document.getElementsByTagName("svg")[0];
    if(d3 === null)
        d3 = document.body; //If that didn't work, we'll try appending straight to body
    else
        d3 = d3.parentElement;

    var prompt = document.createElement("div");
    prompt.innerHTML = "Expert Goggles:<br>Click for a guide.";
    prompt.classList.add("expertGogglesPrompt");
    prompt.id = "ExpertGoggles";
    d3.appendChild(prompt);

    //The sidebar opens when the prompt is clicked
    window.onclick = function(event)
    {
        if(event.target.id == "ExpertGoggles")
            toggleSidebar();
    }
    return;
}

function reportError()
{
    var message = {"from": "UI"};
    console.log("Sending Error Report Request to Background");
    try{chrome.runtime.sendMessage(message);}
    catch(err) {console.log(err);}
}

//generateSidebar() generates a sidebar DOM element and populates
//it with a vis. guide that was appended to the D3InfoObj sent
//from DBConn.js

function generateSidebar(guideInfo)
{
    var sb = document.createElement("div");
    sb.classList.add("expertGogglesSidebar");

    //Take the Object Passed by the Database and Generate the Guide
    //Title
    var titleDiv = document.createElement("div");
    var outerDiv = document.createElement("div");
    outerDiv.classList.add("titlediv");
    titleDiv.innerHTML = guideInfo["Name"] + "<br><br>";
    titleDiv.classList.add("guideTitle");
    sb.appendChild(outerDiv);
    outerDiv.appendChild(titleDiv);

    //img
    var pic = document.createElement("img");
    pic.src = guideInfo["img"];
    pic.width = "225";
    outerDiv.appendChild(pic);

    //Body
    var bodyDiv = document.createElement("div");
    bodyDiv.innerHTML = "<br>" + guideInfo["Guide"] + "<br><br>";
    bodyDiv.innerHTML += "-------------------------------------------<br>";
    bodyDiv.innerHTML += "&nbsp;&nbsp;&nbsp;Did we get this type wrong?&nbsp;&nbsp;<br><br>";
    bodyDiv.classList.add("bodyDiv");
    sb.appendChild(bodyDiv);

    //Error Button
    var buttonDiv = document.createElement("div");
    var button = document.createElement("button");
    button.innerHTML = "Report a parsing error.";
    buttonDiv.classList.add("titlediv");
    buttonDiv.appendChild(button);
    sb.appendChild(buttonDiv);
    button.onclick = function(){ reportError(); };

    //End Spacing
    var spaceDiv = document.createElement("div");
    spaceDiv.innerHTML = "<br><br><br>";
    sb.appendChild(spaceDiv);

    return sb;
}

//Listen for a message from DBConn
chrome.runtime.onMessage.addListener(
  function(D3InfoObj, sender, sendResponse)
  {
    if(D3InfoObj.recipient != "UI")
        return;

    myD3 = D3InfoObj;

    try
    {
        sidebar = generateSidebar(myD3.guide);
        document.body.appendChild(sidebar);
        createPrompt();
    }
    catch(err){console.log(err);}
  }
);