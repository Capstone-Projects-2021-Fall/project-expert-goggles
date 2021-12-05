/**
*                                   Expert Goggles Database Connector
*   DBConn.js is the extension's middle-man code. It runs in the background, communicating between
*   the extension's other pieces. When the browser is started, it connects to the extension's
*   remote database, receiving an anonymous sign-in user ID. Then, it awaits a message from the
*   Parser.js content script, with the determined type of an encountered D3 visualization. It then
*   queries the database for the associated guide, and forwards that information to the UIGen.js
*   content script.
*
*   Additionally, as the middle-man communicator, DBConn.js receives error reports  from Parser.js
*   or UIGen.js, and either files an error report to the database, or updates the extension's page
*   action to be relevant to the extension's context.
*/

"use strict";

//-------------------------------------------------------------------------------------------------
// Internal Fields
//-------------------------------------------------------------------------------------------------

var myD3 = {}; //See D3InfoObj.js to see the fields passed between the pieces.
var supportedTypes; //A JSON list of supported types and their associated D3 function calls.
var uid; //The Anonymous Sign-in ID of the current user

//The extension's configuration for connecting to Firebase
const firebaseConfig =
{
  apiKey: "AIzaSyDZoQ24-ym0W4wbJeuRopvlwt5AwT9KQ4M",
  authDomain: "expertgoggles-b21b1.firebaseapp.com",
  databaseURL: "https://expertgoggles-b21b1-default-rtdb.firebaseio.com",
  projectId: "expertgoggles-b21b1",
  storageBucket: "expertgoggles-b21b1.appspot.com",
  messagingSenderId: "842842636015",
  appId: "1:842842636015:web:6063d22d26749d71e7251a"
};

//Initialize Firebase connection w/ that config, then save connections to the 3 Database tables.
firebase.initializeApp(firebaseConfig);
const vis_db = firebase.firestore().collection("visualizations"); //Visualization Guides
const his_db = firebase.firestore().collection("UserHistories"); //User History
const error_db = firebase.firestore().collection("ErrorReports"); //Error Reports

//-------------------------------------------------------------------------------------------------
// Database Connection Functions
//-------------------------------------------------------------------------------------------------

//The fetchGuide() function runs a query to the Firestore database for the type currently set in
//the myD3 internal field. In order to avoid a race condition with communication functions,
//fetchGuide() then calls both saveToHistory() and sendToUI() after the guide is fetched.

async function fetchGuide()
{
    console.log("Received a guide request from the Parser for " + myD3.type);

     //Type of visualization to query a guide for.
    var type = myD3.type;

    //Run the query for that type against visualization table and receive raw output
    const query = await vis_db.doc(type).get();

    if(query.empty) //If we somehow queried for an unsupported type...
    {
        //...Update the type field, call notifyUnsupported(), creating an error page action.
        myD3.type = "unsupported";
        notifyUnsupported();
    }
    else //If the query was successful...
    {
        //...append the guide to myD3, forward it to the UI, log the URL to User History
        console.log("Fetched a guide for " + type + ", forwarding to UI and logging to History.");
        myD3.guide = query.data();
        sendToUI(myD3);
        saveToHistory(myD3);
    }
}

//The makeErrorReport() logs a user-reported error to the Error Reports table on
//the remote database. The data includes a URL to the reported page, timestamp
//of the most recent report, and an incremented number of reports made on that page.

function makeErrorReport()
{
    console.log("Received an Error Report from the UI.");

    //Use our hashing helper function to make an ID for the entry to the table.
    let docName = jenkinsOneAtATimeHash(myD3.url);

    //Use our connection to the Error Reports table to see if a report for that
    //URL already exists.
    error_db.doc(docName).get().then((doc) =>
    {
        if(doc.exists) //If there's already an entry for that URL...
        {
            //If the number of reports is populated, get that count.
            if(doc.data().times_reported != null)
                var count = doc.data().times_reported + 1;

            //Update that entry with the new timestamp and updated count.
            error_db.doc(docName).set
            ({
                url: myD3.url,
                timestamp: firebase.firestore.Timestamp.now(),
                times_reported: count
            });
        }
        else //If there is not an entry for that URL...
        {
            //Create one with the URL, current timestamp, and count set to 1
            error_db.doc(docName).set
            ({
                url: myD3.url,
                timestamp: firebase.firestore.Timestamp.now(),
                times_reported: 1
            });
        }
    }).catch((error) =>
    {
      console.log("Error - could not upload error report. We'd ask you to report this but, ya know...", error);
    });
}

//The saveToHistory() function creates an entry to the User History table. The information
//stored includes the anonymous sign-in ID of the user, the type of visualization detected,
//the URL where it was encountered, and a timestamp of the most recent encounter. A history
//report is made whenever a D3 visualization is identified and the guide is successfully
//fetched from the Database.
//Parameter: sentObj -- An object with fields containing the necessary info.

function saveToHistory(sentObj)
{
    //Use the hashing helper function to create unique entry ID relative to
    //the current user and the URL. This hash will be identical to one created
    //by a prior encounter to the same URL.
    his_db.doc(jenkinsOneAtATimeHash(uid + String(sentObj.url))).set
    ({
        user: uid,
        type: sentObj.type,
        url: String(sentObj.url),
        last_accessed: firebase.firestore.Timestamp.now()
    })
    .catch((error) =>
    {
        console.error("Error making User History Report: ", error);
    });
}

//-------------------------------------------------------------------------------------------------
// Extension Communication Functions
//-------------------------------------------------------------------------------------------------

//The sendToUI() function takes an Object parameter and messages it to the UI Content Script.
//The object sent should only ever be structured like D3InfoObj.js

function sendToUI(sentObj)
{
    //Using the tab ID of the guide request from the Parser, forward to the UI Script on that tab.
    try{chrome.tabs.sendMessage(myD3.tab, sentObj);}
    catch(error){console.log("Error in messaging to UI: " + error);}
}

//The notifyUnsupported() function updates the extension's Page Action (what appears when the
//extension's icon is clicked) to alert the user to the extension's state. It is called when
//either D3 code was detected but unparsed, or iframes were detected on a webpage, blocking
//a potential parse.

function notifyUnsupported()
{
    //Get the URL for the Red Error Icon
    var icon = chrome.runtime.getURL("style/errIcon.png");

    //Using the tab ID from the Parser, set that tab's icon and on-click popup to the error state.
    chrome.pageAction.setPopup({popup: "HTML/error.html", tabId: myD3.tab});
    chrome.pageAction.show(myD3.tab);
    chrome.pageAction.setIcon({tabId: myD3.tab,path: icon});

    //Create a message to that popup page w/ iframe URLs and whether D3 source code was present.
    var message = {"iframeList": myD3.iframeList, "d3type": myD3.type};
    chrome.extension.onConnect.addListener(function(port){ port.postMessage(message); });
}

//-------------------------------------------------------------------------------------------------
// Helper Functions
//-------------------------------------------------------------------------------------------------

//This function takes a string of any size and returns an avalanching hash string of 8 hex
//characters. It is used by Database Query Functions to generate compatible entry IDs for the
//Firestore database tables.
//Credits (modified code): Bob Jenkins (http://www.burtleburtle.net/bob/hash/doobs.html)
//See also: https://en.wikipedia.org/wiki/Jenkins_hash_function

function jenkinsOneAtATimeHash(keyString)
{
    let hash = 0;
    for(let charIndex = 0; charIndex < keyString.length; ++charIndex)
    {
        hash += keyString.charCodeAt(charIndex);
        hash += hash << 10;
        hash ^= hash >> 6;
    }
    hash += hash << 3;
    hash ^= hash >> 11;

    //4,294,967,295 is FFFFFFFF, the maximum 32 bit unsigned integer value, used here as a mask.
    return (((hash + (hash << 15)) & 4294967295) >>> 0).toString(16);
}

//The populateTypes() function loads the SupportedTypes.json file, which contains the mappings
//for visualization type parsing. This information is forwarded to the Parser script on each
//page. This avoids having to reload the JSON file on every webpage.

async function populateTypes()
{
    return fetch(chrome.extension.getURL('Javascript/SupportedTypes.json'))
           .then((response) => response.json())
           .then((responseJson) =>
           {
                return responseJson;
           });
}

//Since the await keyword can only be used inside of async functions, waitForJson is used
//to get the output of populateTypes()

async function waitForJson() {supportedTypes = await populateTypes();}

//-------------------------------------------------------------------------------------------------
// Main Execution
//-------------------------------------------------------------------------------------------------

//Load the Supported Types JSON File on Start
waitForJson();

//Invoke Firebase's Anonymous Sign-in
firebase.auth().signInAnonymously()
    .catch((error) =>
    {
        console.log("Anonymous Sign in Failed: " + error.message);
    });

//Listen for when Anonymous Sign-in completes.
firebase.auth().onAuthStateChanged((user) =>
{
    if(user) //If sign-in was successful, store the ID
    {
        uid = user.uid;
        console.log("Anonymous Sign-in Successful");
    }
    //If something causes a log-out, note that to the background console.
    else{console.log("Error in Anonymous User Tracking: User is signed out.");}
});

//Other than initial set-up, DBConn.js is reactive.
//This establishes a listener for intra-extension communication.

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse)
{
    //Gather Necessary Info from the message
    myD3 = message; //In most cases, message is a D3InfoObj
    myD3.tab = sender.tab.id; //Tab identifier of sender
    myD3.url = sender.tab.url; //URL of sender

    //The decision tree calls different functions based on the sender and the message.
    if(myD3.from == "UI")
    {
        //The only messages the UI sends to DBConn are user-made error reports.
        makeErrorReport();
    }
    else if(myD3.from == "DashboardMessenger")
    {
        //The Dashboard Messenger Script makes a request from the Dashboard for the User ID
        if(uid != null)
            sendResponse({"uid": uid});
    }
    else if(myD3.from == "parser_init")
    {
        //"parser_init" is the request for the supportedTypes JSON info by the Parser on start.
        sendResponse({"supportedTypes": supportedTypes});
    }
    else if(myD3.from == "parser")
    {
        //"parser" is the general output from the parsing logic.

        if(myD3.type == "none") //If there was no D3...
        {
            //...and there were no iframes, show the default page action and do nothing else
            if(myD3.iframeList.length == 0)
                chrome.pageAction.show(myD3.tab);
            //...but there were iframes, create an error popup to allow workaround
            else
                notifyUnsupported();
        }
        //If there was D3 code but it was unparsed, also create the error popup
        else if(myD3.type == "unsupported")
            notifyUnsupported();
        else //Otherwise, FetchGuide retrieves a guide from the DB, appends it to myD3, and forwards it
            fetchGuide();
    }
});







