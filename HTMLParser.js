// [FIELD VARIABLES]
const SCRIPT_MIME_TYPES = [
    "application/javascript",
    "text/javascript",
    "module",
];
const sourceVersions = [
    "/d3.v2.min.js", 
    "/d3.v3.min.js", 
    "/d3.v4.min.js",
    "/d3.v5.min.js",
    "/d3.v6.min.js",
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


// [FUNCTIONS]

function main(){
    //getScripts();

    hasD3SourceCode = checkForD3Sources();
    // First, save some time by checking whether or not the open source code for D3s are on this page 
    if(hasD3SourceCode == false){
        console.warn("Could not find D3 source code on this page.");
        //return;
    }

    const scripts = Array.from(document.getElementsByTagName('script'));
    console.log(scripts);

    const javascriptScripts = scripts.filter(isJavaScript);
    console.log(javascriptScripts);

    const sMap = javascriptScripts.map(getContentFromScript);
    console.log("LENGTH OF MAP: " + sMap.length);
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
                const currentScript = javascriptScripts[indexOfThisIteration].getAttribute('src');
                
                console.log("Iteration: " + indexOfThisIteration);
                //console.log(text);

                if(scriptContainsD3(text)){ // if not found, indexOf returns -1
                    console.log('Index of D3 in ' + currentScript + ': ' + text.indexOf("d3"));
                    scriptsWithD3sMap.set(currentScript, text);
                }else{
                    //console.log('No d3 found in: ' + currentScript);
                }
            }else{
                console.log('Text item undefined at: ' + index);
                continue;
            }
        }
        console.log('My map:');
        console.log(...scriptsWithD3sMap.entries());
        console.log(scriptsWithD3sMap.values().next().value);
        locateD3InPage();
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
        console.log('Script: ' + script.getAttribute('src') + ' has type \'null\'.');
        if(checkFileExtension(script.getAttribute('src'))){
            console.log('Has a .js extension');
            return true;
        }
        return false;
    }else if(SCRIPT_MIME_TYPES.includes(type)){
        console.log('Script: ' + script.getAttribute('src') + ' has type \''+ type + '\'');
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
        console.warn('ERROR: Could not retrieve the content from: ', script);
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
            console.warn("Cannot find the binding element. So select or selectAll.");
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

    var bEM = boundElementName.replace(/[^a-zA-Z]+/g, '');
    var boundElement = document.getElementById(bEM);
    
    console.log(boundElement.childNodes);


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












/*          [NOTES]

Arrow functions:

    These two functions are the same:

    function sum(a, b){
        return a + b
    }

    let sum2 = (a, b) => a + b

    Note that there isn't a "function" keyword before sum2. The arrow function assumes the function keyword.
    Another example:

    function isPositive(number){
        return number >= 0
    }

    let isPositive2 = number => number >= 0

    All the arrow does is specifies that the value before it is a parameter incoming and that the thing it 
    points to is the logic to be executed on it.


Promises:

    let p = new Promise((resolve, reject) => {
        let a = 1 + 1
        if(a == 2){
            resolve('Success!')
        }else{
            reject('Failed!')
        }
    })

    Promises are basically exactly what they sound like. They are meant to assert that something must
    be the case. If that thing promise holds true, it will call resolve() and confirm that it was a success.
    If it doesn't turn out the way that we expect, it will reject() it. 

    p.then((message) => {
        console.log('This is in the then: ' + message)
    }).catch((message) => {
        console.log('This is in the catch: ' + message)
    })

    For promises, there is a .then() method that tells us what to do after the promise succeeds. The .catch()
    method catches the error given from reject method. The variable "message", in this case, is whatever 
    value gets passed from resolve()'s field or reject()'s field in the declaration of p above. So, for then(),
    the "message" value would be "Success!", and it works the other way around for reject() and catch().

    Callbacks:

    const userLeft = false
    const userWatchingCatMeme = false

    function watchTutorialCallback(callback, errorCallback) {
        if(userLeft){
            errorCallback({
                name: 'User Left',
                message: ':('
            })
        }else if(userWatchingCatMeme) {
            errorCallback({
                name: 'User Watching Cat Meme',
                message: 'WebDevSimplified < Cat'
            })
        }else{
            callback('Thumbs up and Subscribe')
        }
    }

    watchTutorialCallback((message) => {
        console.log('Success: ' + message)
    }, (error) => {
        console.log(error.name + ' ' + error.message)
    })




    for use later (maybe but probably not):

    function getScripts(){

    for(var i = scripts.length-1; i--;){
        //const thisScript = scripts[i].src;
        //fetch(scripts[i].src).then(response => response.text().then(data => console.log(data)));
        console.log(scripts[i]);
        scriptsContent.push(getScriptContent(scripts[i]));
    }
}

*/