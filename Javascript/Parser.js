var D3InfoObj = {};

//Array of currently supported types
const supportedTypes = ["bar_chart", "scatter_plot", "line_chart", "pie_chart",
               "sequences_sunburst", "stacked_area_chart", "stacked_bar_chart",
               "box_plot"];

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
    var funcList = [...parseInfo.funcList];
    D3InfoObj.iframeList = parseInfo.iframeList;

    //Parsing Decision Tree goes here.
    //If no D3 calls were detected, send no information out
    if(funcList.length == 0)
        D3InfoObj.type = "none";
    else if(funcList.includes("line"))
        D3InfoObj.type = "line_chart";
    else if(funcList.includes("keys"))
        D3InfoObj.type = "scatter_plot";
    else if(funcList.includes("histogram"))
        D3InfoObj.type = "histogram";
    else if(funcList.includes("hierarchy"))
        D3InfoObj.type = "sequences_sunburst";
    else if(funcList.includes("scaleQuantize"))
        D3InfoObj.type = "candlestick_chart";
    else if(funcList.includes("pie"))
        D3InfoObj.type = "pie_chart";
    else if(funcList.includes("stack"))
    {
        if(funcList.includes("area"))
            D3InfoObj.type = "stacked_area_chart";
        else
            D3InfoObj.type = "stacked_bar_chart";
    }
    else if(funcList.includes("linear"))
    {
        if(funcList.includes("quantile"))
            D3InfoObj.type = "box_plot";
        else
            D3InfoObj.type = "bar_chart";
    }
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