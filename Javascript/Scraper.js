/**
    This file is a placeholder for the Scraper class.
    It contains hardcoded test code to show flow of execution.
*/

"use strict";

//Makes D3 source code Available on every page
var myScript = document.createElement('script');
myScript.src = chrome.runtime.getURL("Javascript/test.js");
myScript.id = "EGScript";
myScript.async = "false";

(document.head || document.documentElement).appendChild(myScript);
myScript.addEventListener("load", function(){console.log("D3 injected onto page.");});

//Injects a custom D3 object before other execution so we can
//intercept any D3 happening on the page.
function injectD3()
{
   var test = testFunc();
   //console.log(test);
}
//This function messages the DBConn background script to run a query.
function sendToDB(sentObj)
{
    try
    {
        chrome.runtime.sendMessage(sentObj);
    }
    catch(err) {console.log("Error in sendToDB()");}
}

//Creates a simulated D3InfoObj as if it had identified its DOMid and type
/*
var D3InfoObj = {DOMid:"test", type:"Pie Chart"};
sendToDB(D3InfoObj);
*/

injectD3();
