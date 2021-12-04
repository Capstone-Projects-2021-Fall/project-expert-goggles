var supportedTypes;

// Moved out of Parser to avoid multiple loads
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
    supportedTypes = await populateTypes();
    console.log("DBConn is ready.");
}
//Load the Supported Types JSON File on Start
waitForJson();

chrome.runtime.onMessage.addListener(
  function(D3InfoObj, sender, sendResponse)
  {
    //Gather Information from the message
    myD3 = D3InfoObj;

    if(myD3.from == "parser_init")
    {
        sendResponse({"supportedTypes": supportedTypes});
    }
  });

