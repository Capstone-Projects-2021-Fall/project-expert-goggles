/**
*                           Expert Goggles Database Connector
*   DBConn.js is the extension's database connector code. It runs in the background,
*   so its execution is not relative to page content. It awaits a message from Parser.js,
*   which includes the type of guide to make a Database Query for. It handles the case
*   of an unsupported guide type, and then forwards information to UIGen.js.
*/

"use strict";

var myD3 = {};

const firebaseConfig = {
  apiKey: "AIzaSyDZoQ24-ym0W4wbJeuRopvlwt5AwT9KQ4M",
  authDomain: "expertgoggles-b21b1.firebaseapp.com",
  databaseURL: "https://expertgoggles-b21b1-default-rtdb.firebaseio.com",
  projectId: "expertgoggles-b21b1",
  storageBucket: "expertgoggles-b21b1.appspot.com",
  messagingSenderId: "842842636015",
  appId: "1:842842636015:web:6063d22d26749d71e7251a"
};

// Initialize Firebase, database object, and Local D3InfoObj storage
firebase.initializeApp(firebaseConfig);
const vis_db = firebase.firestore().collection("visualizations");

//The fetchGuide(type) function runs a query to the firestore database
//to check if the type argument passed to it has a guide associated with it
//in the team database.

async function fetchGuide()
{
    var type = myD3.type;

    const query = await vis_db.doc(type).get();
    if(query.empty)
    {
        //If we somehow get here with an unsupported type, create error notification
        myD3.type = "unsupported";
        notifyUnsupported();
    }
    else //Otherwise, Parse Out the returned info into to myD3 and forward it to the UI
    {
        myD3.guide = query.data();
        console.log("Fetched a guide for " + type + " and forwarding to UI.");
        sendToUI(myD3);
    }
}

//Callback function to forward guides to the UI Generator
function sendToUI(sentObj)
{
    try{chrome.tabs.sendMessage(myD3.tab, sentObj);}
    catch(err){console.log(err);}
}

//function to create a Chrome Notification in the case of an unsupported or null type parsed
function notifyUnsupported()
{
    console.log("Unsupported type. Creating error notification.");
    var icon = chrome.runtime.getURL("style/errIcon.png");

    //Create a notification to the toolbar icon
    chrome.pageAction.show(myD3.tab);
    chrome.pageAction.setIcon({tabId: myD3.tab,path: icon});
}

var scriptList;
var tab;

//Listens for a message from the scriptGrabber
chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse)
  {
    if(!message.scripts)
        return;

    tab = sender.tab.id;

    //Grab the info needed to post messages into the sandbox
    var sandbox = document.getElementById("sandbox").contentWindow;


    sandbox.postMessage(message, "*");
  }
);

/* For Reference
    //If the Parser determined there was no D3 on a page or if there was an error,
    //do nothing and make sure the extension isn't showing anything
    if(!myD3.type || myD3.type == "none")
        chrome.pageAction.hide(myD3.tab);
    else if(myD3.type == "unsupported") //If we detected D3 but couldnt Parse it, notify an error
        notifyUnsupported();
    else //Otherwise, FetchGuide retrieves a guide from the DB, appends it to myD3, and forwards it
        fetchGuide();
*/
