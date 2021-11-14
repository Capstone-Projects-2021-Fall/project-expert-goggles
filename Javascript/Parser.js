var D3InfoObj = {};

//Array of currently supported types
var supportedTypes;

function sendToDB(sentObj)
{
    console.log("Type: " + sentObj.type);
    try{chrome.runtime.sendMessage(sentObj);}
    catch(err) {console.log("Error in sendToDB()");}
}

function parseType(parseInfo)
{
    //funcList is a list of tracked function calls from
    //the modified D3 source code
    console.log(parseInfo.funcList);
    var funcList = [...parseInfo.funcList];
    var argList = [...parseInfo.argList];

    //Default: Unsupported
    D3InfoObj.type = "unsupported";


    //Logic:
    //waitForJson();

    var possType;
    var funcListLen = funcList.length;
    var prevNumMatches = 0;
    var prevDeviation = 5;
    var matches = [];

    console.log("Args passed: " + argList);

    //No D3 Code
    if(funcListLen == 0)
        possType = "none";
    else //Default: unsupported, gets overwritten if it is supported
        possType = "unsupported";

    for(var jsonEntry = 0; jsonEntry < supportedTypes.length; jsonEntry++){

        var numMatches = 0;
        var currEntry = supportedTypes[jsonEntry];
        console.log("Current Entry functions: " + supportedTypes[jsonEntry].functions);

        for(var currFunc = 0; currFunc < currEntry.functions.length; currFunc++){
            if(funcList.includes(currEntry.functions[currFunc])){
                console.log("Matched: " + currEntry.functions[currFunc]);
                numMatches++;
            }
        }
        if(numMatches > prevNumMatches){
            // possType becomes the most likely answer
            var deviation = currentEntry.length - numMatches;
            possType = currEntry.type;

            if(deviation < prevDeviation){
                matches.push(possType);
            }
            else if(deviation == prevDeviation && numMatches > prevNumMatches){
                matches = [];
                matches.push(possType);
                prevDeviation = deviation;
            }
            else if(deviation == prevDeviation && numMatches == prevNumMatches){
                matches.push(possType);
                prevDeviation = deviation
            }
            prevNumMatches = numMatches;
        }
        else if(numMatches != 0 && numMatches == prevNumMatches){
            console.log("Could either be type \'" + possType
             + "\' or \'" + currEntry.type);
        }
    }

    console.log("It is likely: " + possType);
    D3InfoObj.type = possType;
    sendToDB(D3InfoObj);

}

// Populates the parser with the JSON configuration file types that are currently supported
async function populateTypes(){
    return fetch(chrome.extension.getURL('Javascript/SupportedTypes.json'))
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        });
}

// Wait for the JSON fetch...
async function waitForJson() {
    supportedTypes = await this.populateTypes();
}

//Listen for a message from the script we injected
window.addEventListener("message", (event) => {
    //Make Sure we're only processing messages from Expert Goggles
    if(event.data.sender && event.data.sender == "ExpertGoggles")
        parseType(event.data);
});

waitForJson();