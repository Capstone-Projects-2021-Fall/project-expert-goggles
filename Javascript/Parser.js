var D3InfoObj = {};

//Array of currently supported types
const supportedTypes = ["bar_chart", "candlestick_chart", "line_chart", "pie_chart",
               "sequences_sunburst", "stacked_area_chart", "stacked_bar_chart"];

function sendToDB(sentObj)
{
    try{chrome.runtime.sendMessage(sentObj);}
    catch(err) {console.log("Error in sendToDB()");}
}

function parseType(parseInfo)
{
    //funcList is a list of tracked function calls from
    //the modified D3 source code
    console.log(parseInfo.funcList);
    var funcList = parseInfo.funcList;

    //Parsing Decision Tree goes here.
    //If no D3 calls were detected, set type "none"
    if(funcList.length == 0)
        D3InfoObj.type = "none";
    else if(funcList.includes("node"))
        D3InfoObj.type = "sequences_sunburst";
    else if(funcList.includes("line"))
        D3InfoObj.type = "line_chart";
    else
        D3InfoObj.type = "unsupported";

    sendToDB(D3InfoObj);
}

//Listen for a message from the script we injected
window.addEventListener("message", (event) => {
    //Make Sure we're only processing messages from Expert Goggles
    if(event.data.sender && event.data.sender == "ExpertGoggles")
        parseType(event.data);
});