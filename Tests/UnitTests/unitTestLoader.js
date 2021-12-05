var supportedTypes;

// Moved out of Parser to avoid multiple loads
// Populates the parser with the JSON configuration file types that are currently supported
async function populateTypes(){
    return fetch('../../Javascript/SupportedTypes.json')
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        });
}

// Wait for the JSON fetch...
async function waitForJson() {
    supportedTypes = await populateTypes();

    var message = {"sender": "ExpertGogglesTest", "supportedTypes": supportedTypes};
    window.postMessage(message, "*");
}
//Load the Supported Types JSON File on Start
waitForJson();
