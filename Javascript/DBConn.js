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

// Initialize Firebase, Local D3InfoObj storage
firebase.initializeApp(firebaseConfig);
var myD3 = {};


/* For reference
var visref = firebase.firestore().collection('visualizations')
firebase
  .firestore()
  .collection("visualizations")
  .onSnapshot((snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("All data in 'visualizations' collection", data);
  }); */

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

    //Populates Guide and sends a fake message to the UIGenerator
    myD3.guide = "Pie charts are just awful.";
    console.log("Sending: " + myD3);
    sendToUI(myD3);
  }
);

