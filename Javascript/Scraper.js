// The scraper is responsible for getting the contents of a page to look for D3s
// This script will take the webpage and save it as our own for access to data

const thisDoc = document;


// Creates the new, custom 'save' functionality of the console we will use for keeping the logs!
(function(console){

    console.save = function(data, filename){

        var stringifyStatus = false;

        if(!data) {
            console.error('console.save error: No data!');
            return;
        }

        if(!filename){
            filename = 'console.json';
        }

        var newData = new Array();
        if(typeof data === "object"){
            stringifyStatus = true;

            var max = data.length;
            for(var i = 0; i < max; i++){
                data[i] = JSON.stringify(data[i], undefined, 4);
            }
        }

        var blob = new Blob([data], {type: 'text/json'});
        var event    = document.createEvent('MouseEvents');
        var action    = document.createElement('a');

        action.download = filename;
        action.href = window.URL.createObjectURL(blob);
        action.dataset.downloadurl =  ['text/json', action.download, action.href].join(':');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        action.dispatchEvent(event);
    }
})(console)


// This prints literally every element on a page. Use it for debugging.
// UPDATE: This now saves every single element to an array, prints it, and stores it in a downloadable file
function printAllElements(doc, thisFileName){
    var allElements = doc.getElementsByTagName('*');
    var max = allElements.length;
    var allElementsArray = new Array();

    console.log("Document element list length: " + max);
    for(var i = 0; i < max; i++){
        var htmlEle = allElements[i].outerHTML;
        var data = { html: htmlEle };
        allElementsArray.push(data);
    }
    console.warn("allElementsArray length: " + allElementsArray.length);
    console.save(allElementsArray, thisFileName);
}

printAllElements(thisDoc, "documentConsoleLog.json");




var iframes = thisDoc.getElementsByTagName('iframe');       // Returns object HTMLCollection
    
console.log("iframes array: \n" + iframes);
console.log("iframes array length: " + iframes.length)
console.log("iframes array index test: \n" + iframes[0]); // returns object HTMLIframeElement. ZERO is usually the index, here, since there's one iframe on ObservableHQ


// Try to go down the iframe rabbit hole
try{
    console.log("iframe index name test: \n" + iframes[0].src);

    // Try to display certain content from the iframe
    getIframeContent(iframes[0]);

    //var popup = window.open(iframes[0].src);
    //popup.blur();
    //window.focus();
}catch(error){
    console.log("Couldn't find another iframe. Error message: " + error);
}
//console.log("iframe name test: \n" + iframes[0].name) // no name


function getIframeContent(iframe){
    try{
        
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        console.log(iframeDocument);
        // Print the iframe's innerHTML (sometimes this only prints SOME of it, so there's another approach below)
        console.log(iframeDocument.innerHTML);


        // Loop through every element in the iframe manually and print every single piece of it
        printAllElements(iframeDocument, "iframeConsoleLog.json");



        // TESTING AN IFRAME INJECTED WITH THE ORIGINAL SCRIPTS
        // This is literally hardcoded to only support the following link: https://observablehq.com/@d3/index-chart
        let newIframe = document.createElement('iframe');
        newIframe.id = 'testIframe';

        let newScript = document.createElement('script');
        newScript.src = 'https://static.observableusercontent.com/next/worker-507d3fb4.js';

        let newLink = document.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.type = 'text/css';
        newLink.href = 'https://static.observableusercontent.com/next/worker-24c44ac6.css';

        newIframe.appendChild(newLink);
        newIframe.appendChild(newScript);
        document.body.appendChild(newIframe);

        newIframe.appendChild(newLink);
        newIframe.appendChild(newScript);



        const iframeDocumentScripts = iframeDocument.getElementsByTagName('script');

        console.log("iframe document scripts length: " + iframeDocumentScripts.length);
        console.log("iframe document scripts: " + iframeDocumentScripts); // returns another HTMLCollections object
        console.log("iframe document scripts: " + iframeDocumentScripts[0]); // returns undefined

    }catch(error){
        console.log("Could not get work with the content document properly: " + error);
    }
}





//          [[[[[ ALTERNATE TESTING SCRIPTS ]]]]]

// Gets all of the scripts on the page and prints their name.
function getScripts(){
    var scripts;
    try{
        scripts = Array.from(document.getElementsByTagName('script'));
        console.log("scripts length: " + scripts.length);
        for(var i = 0; i < scripts.length; i++){
            console.log(scripts[i]);
        }
    }catch(error){
        console.warn("Getting iframeScripts error: " + error);
    }
}


// Gets all of the links on a page and prints their name.
function getLinks(){
    var links;
    try{
        links = Array.from(document.getElementsByTagName('link'));
        console.log("links length: " + links.length);
        for(var i = 0; i < links.length; i++){
            console.log(links[i]);
        }
    }catch(error){
        console.warn("Getting iframeScripts error: " + error);
    }
}







/*
// Alternatively, because the HTMLCollection is a reference to a constantly changing thing, save its current state as an array
var iframesArray = Array.from(thisDoc.getElementsByTagName('iframe'));
*/