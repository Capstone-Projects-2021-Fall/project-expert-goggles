var D3InfoObj = {};

//Array of currently supported types
var supportedTypes;
var isTest = false;

function sendToDB(sentObj)
{
    sentObj.from = "parser";
    console.log("Type: " + sentObj.type);
    try{chrome.runtime.sendMessage(sentObj);}
    catch(err) {console.log("Error in sendToDB()");}
}

function getSupportedTypes()
{
    var message = {};
    message.from = "parser_init";
    if(!isTest)
    {
        try{chrome.runtime.sendMessage(message, function(reply)
        {
            if(reply)
                if(reply.supportedTypes)
                    supportedTypes = reply.supportedTypes;
        }
        );}
        catch(err) {console.log(err);}
    }
    else
    {
        window.addEventListener("message", (event) =>
        {
            if(event.data.sender && event.data.sender == "ExpertGogglesTest")
                if(event.data.supportedTypes)
                    supportedTypes = event.data.supportedTypes;
        });
    }
}

function parseType(parseInfo)
{
    //funcList is a list of tracked function calls from
    //the modified D3 source code
    console.log(parseInfo.funcList);
    console.log(parseInfo.argList);
    var funcList = [...parseInfo.funcList];
    D3InfoObj.iframeList = parseInfo.iframeList;

    //Logic:
    //waitForJson();

    var possType;
    var funcListLen = funcList.length;
    var prevNumMatches = 0;
    var prevDeviation = 6;
    var matches = [];

    //No D3 Code
    if(funcListLen == 0)
        possType = "none";
    else
    {
        //Default: unsupported, gets overwritten if it is supported
        possType = "unsupported";

        for(var jsonEntry = 0; jsonEntry < supportedTypes.length; jsonEntry++)
        {
            var numMatches = 0;
            var currEntry = supportedTypes[jsonEntry];

            for(var currFunc = 0; currFunc < currEntry.functions.length; currFunc++)
            {
                if(funcList.includes(currEntry.functions[currFunc]))
                    numMatches++;
            }

            var deviation = currEntry.length - numMatches;
            if(deviation < prevDeviation)
            {
                // possType becomes the most likely answer
                prevDeviation = deviation;
                prevNumMatches = numMatches;
                matches = [];
                matches.push(currEntry.type);
            }
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
        }

        if(matches.length == 1)
        {
            possType = matches[0];
            console.log("It is likely: " + possType);
        }
        else
        {
            var output = "Failed to parse type. Cannot differentiate this between";
            for(let match of matches)
                output += " " + match;
            console.log(output);
        }
    }
    D3InfoObj.type = possType;

    if(!isTest)
        sendToDB(D3InfoObj);

    //Return statement returns type of object that was detected by te extension
    return D3InfoObj.type;
}

//Listen for a message from the script we injected
window.addEventListener("message", (event) => {
    //Make Sure we're only processing messages from Expert Goggles
    if(event.data.sender && event.data.sender == "ExpertGogglesInterceptor")
        parseType(event.data);
});

//Check if this is being run on the test page
var check = document.getElementById("ExpertGogglesTestMarker");
if(check)
    isTest = true;

//Ask DBConn for SupportedTypes on Load
getSupportedTypes();