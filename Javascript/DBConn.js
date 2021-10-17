/**
    This is a placeholder file for the Database Connector code.
    Currently, it is hardcoded to show flow of execution for the extension.
*/

"use strict";

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
var myD3 = {};

//The fetchGuide(type) function runs a query to the firestore database
//to check if the type argument passed to it has a guide associated with it
//in the team database.

async function fetchGuide(type)
{
    const query = await vis_db.doc(type).get();
    if(query.empty) //If no guide for that type existed, log that fact
        console.log("Queried for " + type + " but no guide found.");
    else //Otherwise, Parse Out the returned info and append to myD3
        myD3.guide = query.data();

    //Forward to the UI Generator. This is here to avoid a race condition.
    sendToUI(myD3);
}

//MockUp Function for sending the object to the UIGenerator
function sendToUI(sentObj)
{
    try{chrome.tabs.sendMessage(myD3.tab, sentObj);}
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

    //Run a query based on the info that the scraper passed over
    //FetchGuide appends necessary info into the D3InfoObj
    fetchGuide(myD3.type);
  }
);
