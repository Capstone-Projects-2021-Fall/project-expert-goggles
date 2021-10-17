// [FIELD VARIABLES]
const SCRIPT_MIME_TYPES = [
    "application/javascript",
    "text/javascript",
    "module",
];
const sourceVersions = [
    "/d3.v2.js",
    "/d3.v2.min.js",
    "/d3.v3.js",
    "/d3.v3.min.js",
    "/d3.v4.js",
    "/d3.v4.min.js",
    "/d3.v5.js",
    "/d3.v5.min.js",
    "/d3.v6.js",
    "/d3.v6.min.js",
    "/d3.v7.js",
    "/d3.v7.min.js",
]; // Keeps a list of the various versions of D3 source code file names
const d3LocationTags = [
    "d3.select(",
    "d3.selectAll(",
];
var currentPage = document;
var hasD3SourceCode;
var savedScriptsText = new Array();
var scriptsWithD3sMap = new Map(); // This map keeps track of the savedScriptsText files that DO use a d3, and takes its index mapped to the raw text value.
var D3InfoObj = {};

// [FUNCTIONS]

function main(){
    //getScripts();

    hasD3SourceCode = checkForD3Sources();
    // First, save some time by checking whether or not the open source code for D3s are on this page
    if(hasD3SourceCode == false){
        console.warn("Could not find D3 source code on this page.");
        return;
    }

    const scripts = Array.from(document.getElementsByTagName('script'));
    //console.log(scripts);

    //const javascriptScripts = scripts.filter(isJavaScript);
    //console.log(javascriptScripts);

    const sMap = scripts.map(getContentFromScript);
    //console.log("LENGTH OF MAP: " + sMap.length);
    const scriptsText = Promise.all(sMap);

    // This iterates through the text in scriptData to get the text and index values
    var index = 0;
    scriptsText.then(scriptData => {
        for (const text of scriptData) {
            index++; // redundant with indexOf() function. Further, an error was thrown from indexOf when we aren't checking if the text is null, so an index may actually be good to use instead of the indexOf().
            if(text){
                // This gives us the index of the current script text within our script texts array initialized for the loop, called "texts"
                const indexOfThisIteration = scriptData.indexOf(text);
                // Below gives the value at the current index we're working with
                const currentScript = scripts[indexOfThisIteration].getAttribute('src');

                //console.log("Iteration: " + indexOfThisIteration);
                //console.log(text);

                if(scriptContainsD3(text)){ // if not found, indexOf returns -1
                    //console.log('Index of D3 in ' + currentScript + ': ' + text.indexOf("d3"));
                    scriptsWithD3sMap.set(currentScript, text);
                }else{
                    //console.log('No d3 found in: ' + currentScript);
                }
            }else{
                //console.log('Text item undefined at: ' + index);
                continue;
            }
        }
        //console.log('My map:');
        //console.log(...scriptsWithD3sMap.entries());
        //console.log(scriptsWithD3sMap.values().next().value);
        D3InfoObj.DOMid = locateD3InPage();
        D3InfoObj.type = "stacked_area_chart"; //Hardcoded for now
        console.log(D3InfoObj.DOMid);
        //Send that info along to DBConn
        if(D3InfoObj.DOMid)
            sendToDB(D3InfoObj);


    });
}


function checkForD3Sources(){

    scripts = currentPage.getElementsByTagName('script');
    for(var i = scripts.length; i--;){
        // Gets the file
        const fileEnding = scripts[i].src

        // If the last 13 characters (including the "/") match
        if(sourceVersions.includes(fileEnding.slice(fileEnding.length - 13))){
            console.log("Found a D3 source file in the page.");

            return true;
        }

        if(sourceVersions.includes(fileEnding.slice(fileEnding.length - 9))){
            console.log("Found a D3 source file in the page.");
            return true;
        }

    }


    // If we want this method to short-circuit the search for D3s and save time/energy, we need
    // to expand this and look for more than just the source code. The souce code could be stored
    // in an external HTML, like in the case of observablehq's online examples. Possible solutions"
    //      - Check for Global Variables associated with D3s.
    //      - Try another method of pulling sources from a page to look for source code again.

    return false;
}


function isJavaScript(script){
    const type = script.getAttribute('type');
    if(type === null){
        //console.log('Script: ' + script.getAttribute('src') + ' has type \'null\'.');
        if(checkFileExtension(script.getAttribute('src'))){
            //console.log('Has a .js extension');
            return true;
        }
        return false;
    }else if(SCRIPT_MIME_TYPES.includes(type)){
        //console.log('Script: ' + script.getAttribute('src') + ' has type \''+ type + '\'');
        return true;
    }
}


async function getContentFromScript(script){
    const src = script.getAttribute('src');
    if(src === null){
        return script.textContent;
    }
    try{
        const response = await fetch(src);
        const text = await response.text();
        return text;
    }catch{
        //console.warn('ERROR: Could not retrieve the content from: ', script);
    }
}


function scriptContainsD3(thisText){
    return !(thisText.indexOf('d3.') == -1);
}


function checkFileExtension(givenScript){
    if(givenScript === null) {
        return false;
    }

    const fileExtension = givenScript.toString().slice(givenScript.length - 3);
    if(fileExtension == '.js') {
        return true;
    }
    return false;
}

//This function messages the DBConn background script to run a query.
function sendToDB(sentObj)
{
    try
    {
        chrome.runtime.sendMessage(sentObj);
    }
    catch(err) {console.log("Error in sendToDB()");}
}

function locateD3InPage(){
    var textData = scriptsWithD3sMap.values().next().value;
    const textDataString = new String(textData.toString());

    // If the d3 is global and not private, we should be able to get access to it.
    var bindFunctionID = 0; // select by default
    var boundElementNameIndex = 8; // 8 characters ".select(" by default

    let regexSelect = /(\.select\()/;
    let regexSelectAll = /(\.selectAll\()/;
    let regexSelectedElement = "";
    let regexSelectedElementData = ""; // looks for the values fed to .data() method bound to this.

    // Search for instances of "select" and "selectAll"
    var indexOfSelect = textDataString.search(regexSelect);
    if(indexOfSelect == -1){
        indexOfSelect = textDataString.search(regexSelectAll);
        // if it can't find selectAll() either...
        if(indexOfSelect == -1){
            //console.warn("Cannot find the binding element. So select or selectAll.");
            return;
        }
        bindFunctionID = 1;
        boundElementNameIndex = 11;
    }
    console.log("IndexOfSelect: " + indexOfSelect);


    var currCharIndex = indexOfSelect + boundElementNameIndex;
    var boundElementName = "";
    while(textDataString[currCharIndex] != ')'){
        boundElementName += textDataString[currCharIndex];
        currCharIndex++;
    }


    // OOOOH. Found this: HTMLCollection Objects: namedItem() function: returns the element with the specified ID/name in the HTML collection
    // ... Possibly make a D3 and grab the same thing? Check if an SVG is being attached? etc.?
    console.log("boundElement: " + boundElementName);
    var bEM = boundElementName;

    //check if first character is letter
    while(bEM.charAt(0).toUpperCase() == bEM.charAt(0).toLowerCase())
        bEM = bEM.substring(1);

    return bEM;


    /*
    var boundElement = document.getElementById(boundElementName);
    console.log(boundElement.childNodes);
    var elementCoords = boundElement.getBoundingClientRect();
    console.log("Here's the bounding element: ");
    console.log(elementCoords.top,
        elementCoords.right,
        elementCoords.bottom,
        elementCoords.left);

    */

}


// CTRL + K + C OR CTRL + K + U to comment/uncomment blocks
// A very, VERY rough demonstration of how we may find a d3 object's connection to an HTML element.
// function locateD3InPage(){
//     // In the map entries, look for code that uses "d3.select" or "d3.selectAll", and check the element it references.
//     var textData = scriptsWithD3sMap.values().next().value;

//     var index = textData.indexOf('d3.');
//     var d3SelectLine = textData.indexOf('select', index);
//     var selectLineParam = textData.substring(
//         textData.indexOf('(', d3SelectLine),
//         textData.indexOf(')', d3SelectLine)
//     );
//     var trimmedSelectLineParam = selectLineParam.substring(2, selectLineParam.length-1);
//     console.log('SELECT LINE FOUND AT CHARACTER INDEX: ' + d3SelectLine);
//     console.log('SELECT LINE\'S VALUE: ' + trimmedSelectLineParam);

//     var matchedHTMLElement = document.getElementsByName(trimmedSelectLineParam);
//     console.log(matchedHTMLElement.nodeName);


//     /*
//     while(index != -1){
//         console.log('in first loop');

//         var d3SelectLine = textData.indexOf('select', index);
//         console.log('SELECT LINE FOUND: ' + d3SelectLine);

//         index = textData.indexOf('d3.', index);        // increments the while loop when looking for next match
//     }
//     */
// }



// [ROUTINE]

main();
