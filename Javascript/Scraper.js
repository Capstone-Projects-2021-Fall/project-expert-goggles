// The scraper is responsible for getting the contents of a page to look for D3s
// This script will take the webpage and save it as our own for access to data

const thisDoc = document;

// This prints literally every element on a page. Use it for debugging.
function printAllElements(doc){
    var allElements = doc.getElementsByTagName('*');
    var max = allElements.length;
    console.log("Document element list length: " + max);
    for(var i = 0; i < max; i++){
        console.log(allElements[i]);
    }
}
// printAllElements(thisDoc);



var iframes = thisDoc.getElementsByTagName('iframe');       // Returns object HTMLCollection
    
console.log("iframes array: \n" + iframes);
console.log("iframes array length: " + iframes.length)
console.log("iframes array index test: \n" + iframes[0]); // returns object HTMLIframeElement. ZERO is usually the index, here, since there's one iframe on ObservableHQ


// Try to go down the iframe rabbit hole
try{
    console.log("iframe index name test: \n" + iframes[0].src);

    // Try to display certain content from the iframe
    getIframeContent(iframes[0]);

    var popup = window.open(iframes[0].src);
    popup.blur();
    window.focus();
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
        printAllElements(iframeDocument);


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