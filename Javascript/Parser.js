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

    //Parsing Decision Tree goes here.
    //If no D3 calls were detected, set type "none"
    if(funcList.length == 0)
        D3InfoObj.type = "none";
    else if(funcList.includes("sum"))
        D3InfoObj.type = "pie_chart";
    else if(funcList.includes("keys"))
        D3InfoObj.type = "scatter_plot";
    else if(funcList.includes("max"))
    {
        if(funcList.includes("permute"))
            D3InfoObj.type = "stacked_bar_chart";
        else if(funcList.includes("min"))
            D3InfoObj.type = "line_chart";
        else
            D3InfoObj.type = "bar_chart";
    }
    else if(funcList.includes("functor"))
        D3InfoObj.type = "box_plot";
    else if(funcList.includes("extent"))
        D3InfoObj.type = "stacked_area_chart";
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