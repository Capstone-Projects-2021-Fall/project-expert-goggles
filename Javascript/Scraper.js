// The scraper is responsible for getting the contents of a page to look for D3s
// This script will take the webpage and save it as our own for access to data

const thisDoc = document;
var d3functions;

var iframes = thisDoc.getElementsByTagName('iframe');       // Returns object HTMLCollection
    
console.log("iframes array: \n" + iframes);
console.log("iframes array length: " + iframes.length)
console.log("iframes array index test: \n" + iframes[0]); // returns object HTMLIframeElement. ZERO is usually the index, here, since there's one iframe on ObservableHQ



// Send message to iframeScraper
function sendToIframeScraper(thisIframe){
    try{
        window.open(thisIframe.src, "", "width=100,height=100");
    }catch(error){
        console.warn("Error sending src message to IframeScraper: " + message);
    }
}

// Main routine
function scraperMain(){
    // if no D3 found and there IS an iframe...:
    if(!d3functions && iframes.length > 0){
        console.log("Iframe source: " + iframes[0].src);
        getIframeContent(iframes[0].src);
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



window.addEventListener("message", (event) => {
    //Make Sure we're only processing messages from Expert Goggles
    if(event.data.sender && event.data.sender == "ExpertGoggles")
        d3functions = event.data;
        scraperMain();
});



/*
// Alternatively, because the HTMLCollection is a reference to a constantly changing thing, save its current state as an array
var iframesArray = Array.from(thisDoc.getElementsByTagName('iframe'));
*/