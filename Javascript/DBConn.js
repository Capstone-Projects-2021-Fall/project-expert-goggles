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
const his_db = firebase.firestore().collection("UserHistories");

firebase.auth().signInAnonymously()
  .then(() => {
    console.log("sign-in successful")
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("sign-in failed")
  });
var uid;
firebase.auth().onAuthStateChanged((user) => {
if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    uid = user.uid;
    console.log("obtained user id");
} else { console.log(" User is signed out"); }
});


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
        saveToHistory(myD3);
    }
}

//Callback function to forward guides to the UI Generator
function sendToUI(sentObj)
{
    sentObj.recipient = "UI";
    try{chrome.tabs.sendMessage(myD3.tab, sentObj);}
    catch(err){console.log(err);}
}

//function to create a Chrome Notification in the case of an unsupported or null type parsed
function notifyUnsupported()
{
    console.log("Unsupported type. Creating error notification.");
    var icon = chrome.runtime.getURL("style/errIcon.png");

    //Create a notification to the toolbar icon
    chrome.pageAction.setPopup({popup: "HTML/error.html", tabId: myD3.tab});
    chrome.pageAction.show(myD3.tab);
    chrome.pageAction.setIcon({tabId: myD3.tab,path: icon});

    var message = {"iframeList": myD3.iframeList};
    message.recipient = "Popup";

    if(myD3.iframeList.length > 0) //Send Iframe Information if Present
    {
        //Communicate with Error Popup
        chrome.extension.onConnect.addListener(function(port)
        {
            port.postMessage(message);
        });
    }
}



//Listens for a message from the Parser
chrome.runtime.onMessage.addListener(
  function(D3InfoObj, sender, sendResponse)
  {
    //Append tab information so we know where to send info back to
    myD3 = D3InfoObj;
    myD3.tab = sender.tab.id;
    console.log("Received a guide request from the Parser for " + myD3.type);
    myD3.url = sender.tab.url;
    myD3.iframeList = D3InfoObj.iframeList;

    //If the Parser determined there was no D3 on a page or if there was an error,
    //do nothing and make sure the extension isn't showing anything
    if(!myD3.type || myD3.type == "none")
        chrome.pageAction.show(myD3.tab);
    else if(myD3.type == "unsupported") //If we detected D3 but couldnt Parse it, notify an error
        notifyUnsupported();
    else //Otherwise, FetchGuide retrieves a guide from the DB, appends it to myD3, and forwards it
        fetchGuide();
  }
);

//saves document to database containing ID of relevant user,
//vis. type, URL, and date last accessed
function saveToHistory(sentObj) {

  his_db.doc(jenkinsOneAtATimeHash(uid + String(sentObj.url))).set({
      user: uid,
      type: sentObj.type,
      url: String(sentObj.url),
      last_accessed: firebase.firestore.Timestamp.now()
  })
  .then(() => {
    console.log("document saved to history");
  })
  .catch((error) => {
    console.error("Error saving doc: ", error);
  });

//Credits (modified code): Bob Jenkins (http://www.burtleburtle.net/bob/hash/doobs.html)
//See also: https://en.wikipedia.org/wiki/Jenkins_hash_function
//Takes a string of any size and returns an avalanching hash string of 8 hex characters.
function jenkinsOneAtATimeHash(keyString)
{
  let hash = 0;
  for (let charIndex = 0; charIndex < keyString.length; ++charIndex)
  {
    hash += keyString.charCodeAt(charIndex);
    hash += hash << 10;
    hash ^= hash >> 6;
  }
  hash += hash << 3;
  hash ^= hash >> 11;
  //4,294,967,295 is FFFFFFFF, the maximum 32 bit unsigned integer value, used here as a mask.
  return (((hash + (hash << 15)) & 4294967295) >>> 0).toString(16)
};

}
