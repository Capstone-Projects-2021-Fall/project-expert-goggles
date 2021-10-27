var D3InfoObj = {};

function sendToDB(sentObj)
{
    try
    {
        chrome.runtime.sendMessage(sentObj);
    }
    catch(err) {console.log("Error in sendToDB()");}
}

function parseType(parseInfo)
{
    //Check to make sure the message is from us
    if(parseInfo.sender != "ExpertGoggles")
        return;

    var funcList = parseInfo.funcs;
    if(funcList.includes("line"))
        D3InfoObj.type = "line_chart";

    console.log(D3InfoObj.type);
    sendToDB(D3InfoObj);
}

//Listen for a message from the script we injected
window.addEventListener("message", (event) => {
    parseType(event.data);
});