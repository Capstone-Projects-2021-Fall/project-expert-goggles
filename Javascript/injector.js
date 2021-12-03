//Inject Interceptor onto the page

//Code that is injected has to be a string literal here.
//The original source file is at Deprecated/interceptor.js
//It has to be done this way because the original approach, messing with Localstorage, caused
//issues logging into Canvas (which is admittedly kinda funny).
var scriptText = `
//Interceptor Code starts here, is injected.
//Expert Goggles: Function Logger Tracks function calls from D3
var funcLogger = {};
funcLogger.funcsCalled = [];
funcLogger.argList = [];
var alreadyFired = false;
var iframeList = [] ;

var needArgs = ["append", "attr"];

var needArgs = ["append", "attr"];

//This is called to replace D3 functions with functions that log themselves but return the same thing
funcLogger.replace = function(old_func, func_name)
{
    return function()
    {
        if(!funcLogger.funcsCalled.includes(func_name))
            funcLogger.funcsCalled.push(func_name);

        if(needArgs.includes(func_name) && arguments)
        {
            var argString = func_name + "(";
            var count = 0;
            for(let arg of arguments)
            {
                if(count > 0)
                    argString += ", ";

                 argString += arg.toString();
                 count++;
            }
            argString += ")";
            funcLogger.argList.push(argString);
        }

        return old_func.apply(this, arguments);
    }
}

//Expert Goggles Interception: SendToParser()
//sendToParser() Sends a list of tracked function from the injected script
//back out to the extension's parser
function sendToParser()
{
    //Generate an object with the necessary info, append funcList to it
    var parseObj = {};
    parseObj.funcList = funcLogger.funcsCalled;
    parseObj.argList = funcLogger.argList;
    parseObj.sender = "ExpertGoggles";
    parseObj.iframeList = iframeList;

    console.log("Expert Goggles Scraper: Sending message to background.");

     //Message ParseObj out
     try{window.postMessage(parseObj, "*");}
     catch(err) {console.log(err)};

}

function interceptD3()
{
    if(alreadyFired)
        return;

    if(window.d3)
    {
        alreadyFired = true;
        mo.disconnect();
        console.log("Expert Goggles: Interceptor Fired.")

        //Expert Goggles Interception: Add a logger to all functions
        for(var name in window.d3)
        {
            var func = window.d3[name];
            if(typeof func == "function") //Intercept functions
                window.d3[name] = funcLogger.replace(func, name);
            else //Intercept Subfunctions
                for(var subName in window.d3[name])
                {
                    var subFunc = window.d3[name][subName]
                    if(typeof subFunc == "function")
                        window.d3[name][subName] = funcLogger.replace(subFunc, subName);
                }
        }
    }
}

var count = 0;

//Callback for Mutation Observer that watches Window.d3
function callback(mutations)
{
    for(let m of mutations)
    {
        var newNode = m.addedNodes[0];
        try
        {
            if(newNode.tagName == "SCRIPT")
                interceptD3();
        }catch(err){}
    }
}

//Watch for changes to window.d3, indicating it was loaded
var mo = new MutationObserver(callback);
mo.observe(document, {subtree: true, childList: true});

//Also watch for iframes on the page
document.addEventListener("DOMContentLoaded", function()
{
    var iframes = document.getElementsByTagName("iframe");
    for(let i of iframes)
    {
      iframeList.push(i.src);
    }
});

 setTimeout( function() {sendToParser();}, 1000);
`; //End of Interceptor Code

//Append that long string into the document head
var d3script = document.createElement("script");
d3script.textContent = scriptText;
d3script.charset = "utf-8";
d3script.type = "text/javascript";
d3script.id = "ExpertGoggles";
d3script.setAttribute("async", "false");
document.documentElement.append(d3script);
console.log("Expert Goggles: Injected D3 Interception Script.");

//Check if we're on the Dashboard's User History Page
var userID;
if(location.href == "https://expertgoggles-b21b1.web.app/HistoryofViews")
{
    //Get the User ID From DBConn
    var message = {"from": "injector"};
    try{chrome.runtime.sendMessage(message, function(reply)
    {
        userID = reply.uid;
    }
    );}
    catch(err) {console.log(err);}

    //Post that info out to the page
    try(window.postMessage({"userID": userID, "sender": "ExpertGoggles"}, "*"))
    catch(err) {console.log(err);}
}




