/**
    This file is a placeholder for the Scraper class.
    It contains hardcoded test code to show flow of execution.
*/

"use strict";

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
var D3InfoObj = {DOMid:"test", type:"stacked_area_chart"};
sendToDB(D3InfoObj);