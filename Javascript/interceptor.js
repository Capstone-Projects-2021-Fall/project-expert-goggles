//Expert Goggles: Function Logger Tracks function calls from D3
var funcLogger = {};
funcLogger.funcsCalled = [];
var alreadyFired = false;

//This is called to replace D3 functions with functions that log themselves but return the same thing
funcLogger.replace = function(old_func, func_name)
{
    return function()
    {
        if(!funcLogger.funcsCalled.includes(func_name))
            funcLogger.funcsCalled.push(func_name);
        return old_func.apply(this, arguments);
    }
}

//Expert Goggles Interception: SendToParser()
//sendToParser() Sends a list of tracked function from the injected script
//back out to the extension's parser
function sendToParser()
{
    if(!alreadyFired)
        return;

    //Generate an object with the necessary info, append funcList to it
    var parseObj = {};
    parseObj.funcList = funcLogger.funcsCalled;
    parseObj.sender = "ExpertGoggles";

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

        //Expert Goggles Interception: Add a logger to all functions
        for(var name in window.d3)
        {
            var func = window.d3[name];
            if(typeof func == "function")
                window.d3[name] = funcLogger.replace(func, name);
        }
    }
}

document.addEventListener("DOMContentLoaded", function()
{
    var scripts = document.getElementsByTagName("script");
    for(let script of scripts)
    {
        script.onload = interceptD3();
    }
});

setTimeout( function() {sendToParser();}, 1500);


