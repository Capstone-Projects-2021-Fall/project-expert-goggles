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

    // If funcList is empty...
    if(funcList.length == 0 || funcList == null){
        // check for an iframe. 
        var iframes = document.getElementsByTagName('iframe');
        if(!(iframes.length == 0)){
            if(confirm("Could not locate a D3, should we open the iframe in a new tab?")){
                window.open(iframes[0].src);
            }
            else{
                console.log("User did not want to open the iframe.");
            }
        }
        console.log("No D3 or iframe located.");
    }
    // if it exists, prompt the user to open it in a new tab
    // then possibly run the method to check the savedHTML JSON's URL value and compare it to the iframe URL
    // if it is a match, then the new tab that was opened gave us the contents of the iframe


    //Default: Unsupported
    D3InfoObj.type = "unsupported";


    //Logic:
    //waitForJson();

    var possType;
    var funcListLen = funcList.length;
    var prevNumMatches = 0;

    for(var jsonEntry = 0; jsonEntry < supportedTypes.length; jsonEntry++){

        var numMatches = 0;
        var currEntry = supportedTypes[jsonEntry];

        for(var currFunc = 0; currFunc < currEntry.functions.length; currFunc++){
            if(funcList.includes(currEntry.functions[currFunc])){
                numMatches++;
            }
        }
        if(numMatches > prevNumMatches){
            // possType becomes the most likely answer
            possType = currEntry.type;
            prevNumMatches = numMatches;

            // if the number of matches matches the amount of functions defined for a type, then we've found it. break the loop
            if(numMatches == currEntry.functions.length){ break; }
        }
        else if(numMatches != 0 && numMatches == prevNumMatches){
            console.log("Could either be type \'" + possType
             + "\' or \'" + currEntry.type);
        }
    }

    console.log("It is likely: " + possType);
    D3InfoObj.type = possType;
    sendToDB(D3InfoObj);

    if(funcList.length == 0 || funcList == null || possType == undefined){
        // check for an iframe. 
        var iframes = document.getElementsByTagName('iframe');
        if(!(iframes.length == 0)){
            if(confirm("Could not locate a D3, should we open the iframe in a new tab?")){
                window.open(iframes[0].src);
            }
            else{
                console.log("User did not want to open the iframe.");
            }
        }
        console.log("No D3 or iframe located.");
    }

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