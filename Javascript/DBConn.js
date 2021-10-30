/**
    DBConn.js is the extension's database connector code. It runs in the background,
    so its execution is not relative to page content. It awaits a message from Parser.js,
    which includes the type of guide to make a Database Query for. It handles the case
    of an unsupported guide type, and then forwards information to UIGen.js.
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
        //If no guide for that type existed, log that fact and set type to "unsupported"
        console.log("Queried for " + type + " but no guide found.");
        myD3.type = "unsupported";
    }
    else //Otherwise, Parse Out the returned info and append to myD3
        myD3.guide = query.data();

    console.log("Fetched a guide for " + type + " and forwarding to UI.");

    //Forward to the UI Generator. This is here to avoid a race condition.
    sendToUI(myD3);
}

//Callback function to forward guides to the UI Generator
function sendToUI(sentObj)
{
    try{chrome.tabs.sendMessage(myD3.tab, sentObj);}
    catch(err){console.log(err);}
}

//Listens for a message from the Parser
chrome.runtime.onMessage.addListener(
  function(D3InfoObj, sender, sendResponse)
  {
    //Append tab information so we know where to send info back to
    myD3 = D3InfoObj;
    myD3.tab = sender.tab.id;
    console.log("Received a guide request from the Parser for " + myD3.type);


    //If the Parser determined that type to be unsupported, or there was an error,
    //do not attempt to fetch the guide. Simply forward that info to the UIGen
    if(!myD3.type || myD3.type == "unsupported")
        sendToUI(myD3);
    else //Otherwise, FetchGuide retrieves a guide from the DB, appends it to myD3, and forwards it
        fetchGuide();
  }
);
