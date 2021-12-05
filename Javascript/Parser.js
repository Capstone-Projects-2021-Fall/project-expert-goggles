/**
*                              Expert Goggles Visualization Type Parser
*   Parser.js is a content script (run on every page) that has the job of determining the type
*   of visualizations that are encountered. When it loads, it first queries DBConn for the info
*   loaded from supportedTypes.json, which contains function-to-type mappings. Then, it awaits
*   a list of D3 function calls from the Interceptor. When that is received, it runs the list
*   against its parsing logic to determine what visualization type is most likely. It then
*   appends that info to a D3InfoObj, and forwards that to DBConn to make a guide query.
*/

//-------------------------------------------------------------------------------------------------
// Internal Fields
//-------------------------------------------------------------------------------------------------

var D3InfoObj = {}; //We'll append info about the visualization to this object.
var supportedTypes; //Will hold the mappings loaded from supportedTypes.json
var isTest = false; //Boolean indicating whether Parser is running in a unit test environment.

//-------------------------------------------------------------------------------------------------
// Functions
//-------------------------------------------------------------------------------------------------

//getSupportedTypes() messages DBConn to ask for the information loaded from supportedTypes.json.
//This is handled this way to avoid an asynchronous JSON file load on every webpage.

function getSupportedTypes()
{
    //Prepare the message object
    var message = {};
    message.from = "parser_init";

    //If this is not the unit test environment, message DBConn.js
    if(!isTest)
    {
        try
        {
            chrome.runtime.sendMessage(message, function(reply)
            {
                supportedTypes = reply.supportedTypes;
            });
        }
        catch(error) { console.log(error); }
    }
    //If it is the unit test, listen for the information posted to the test window.
    else
    {
        window.addEventListener("message", (event) =>
        {
            if(event.data.sender && event.data.sender == "ExpertGogglesTest")
                supportedTypes = event.data.supportedTypes;
        });
    }
}

//sendToDB() messages the parsed information out to DBConn.js.
//Parameter: sentObj -- A D3InfoObj being sent. See D3InfoObj.js

function sendToDB(sentObj)
{
    sentObj.from = "parser";
    try{chrome.runtime.sendMessage(sentObj);}
    catch(error) { console.log(error); }
}

//The parseType() function is the meat of the parser. It runs the list of D3 function calls
//against supportedTypes.json to try and determine the most likely visualization type. If
//there are no D3 function calls, "none" is returned. If it cannot determine the type,
//"unsupported" is returned. parseType() calls sendToDB() when it is finished parsing.
//Parameter: parseInfo -- The message from the Interceptor, containing a list of D3 functions
//                        and iframe information.

function parseType(parseInfo)
{
    //Copy the function list and iframe URLs out of parseInfo.
    var funcList = [...parseInfo.funcList];
    D3InfoObj.iframeList = parseInfo.iframeList;

    //Bookkeeping for parsing
    var possType; //Holds the most likely type. Overwritten as logic progresses.
    var prevNumMatches = 0; //Stores the highest number of function-call matches so far.
    var prevDeviation = 7; //Stores lowest deviation (matches vs. total marker functions). Max 7.
    var matches = []; //Holds array of equally likely type matches.

    //If there was no D3 code detected, type is "none", logic is skipped.
    if(funcList.length == 0)
        possType = "none";
    else //Otherwise...
    {
        //Default: unsupported, gets overwritten if a type matches.
        possType = "unsupported";

        //For each supported vis. type in supportedTypes.json...
        for(var jsonEntry = 0; jsonEntry < supportedTypes.length; jsonEntry++)
        {
            //Track the number of function call matches for the current entry.
            var numMatches = 0;
            var currEntry = supportedTypes[jsonEntry];

            //Run the intercepted D3 functions against marker function list.
            for(var currFunc = 0; currFunc < currEntry.functions.length; currFunc++)
            {
                if(funcList.includes(currEntry.functions[currFunc]))
                    numMatches++; //Count Matches
            }

            //Track Deviation: # of marker functions available for that type - # of matches.
            var deviation = currEntry.length - numMatches;

            //If deviation is lower than previous lowest deviation...
            if(deviation < prevDeviation)
            {
                //Current Entry becomes the most likely answer.
                //Overwrite prevDeviation, numMatches, and array of likely matches.
                prevDeviation = deviation;
                prevNumMatches = numMatches;
                matches = [];
                matches.push(currEntry.type);
            }
            //If deviation is a tie with previous lowest deviation, # of function matches tiebreaks.
            else if(deviation == prevDeviation)
            {
                if(numMatches > prevNumMatches)
                {
                    matches = [];
                    prevNumMatches = numMatches;
                    matches = [];
                    matches.push(currEntry.type);
                }
                else if(numMatches == prevNumMatches)
                    matches.push(currEntry.type);
            }
        }//End of supportedTypes.json for loop.

        //If there is only 1 most likely match, that is our parsed type.
        //Otherwise, we failed to parse. Leave type "unsupported."
        if(matches.length == 1)
            possType = matches[0];
    }

    //If it's not the unit test environment, append type to D3InfoObj and message it out.
    if(!isTest)
    {
        D3InfoObj.type = possType;
        sendToDB(D3InfoObj);
    }
    //If it is the test environment, return the type so Unit Test can work with the info directly.
    else
        return possType;
}

//-------------------------------------------------------------------------------------------------
// Main Execution
//-------------------------------------------------------------------------------------------------

//On start, ask DBConn for the info from supportedTypes.json
getSupportedTypes();

//Check if we're running in the Unit Test environment. That page has a marker div.
var check = document.getElementById("ExpertGogglesTestMarker");
if(check)
    isTest = true;

//Listen for a message posted to the page, the Interceptor will send the needed info.
window.addEventListener("message", (event) =>
{
    //Make sure we're only processing messages from Expert Goggles.
    if(event.data.sender && event.data.sender == "ExpertGogglesInterceptor")
        parseType(event.data); //If we are, run parseType() on the message.
});