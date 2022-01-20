/**
*                              Expert Goggles Interceptor/Injector
*   Expert Goggles detects D3 visualizations by looking for the presence of D3 source code, then
*   replacing it with a self-logging version of the same code. We have called the script that does
*   this the interceptor. The interceptor grabs a list of all D3 functions that have run on a page,
*   then messages that to the Parser script to determine its type.
*
*   Because Chrome extensions have a limited scope for interacting with scripts on a webpage, the
*   interceptor code has to be injected into a webpage as its own script tag. This file contains
*   both the interceptor code, and the injector code.
*/

//Start a long string literal that holds the interceptor code.
var scriptText = `

//-------------------------------------------------------------------------------------------------
// Internal Fields
//-------------------------------------------------------------------------------------------------

var funcLogger = {}; //funcLogger holds the interception functions
funcLogger.funcsCalled = []; //funcsCalled will store a list of D3 functions called by the page.
funcLogger.argList = [];
var alreadyFired = false; //to ensure D3 source code is only fired once.
var iframeList = []; //Cannot detect code inside of iframes, we'll let the Parser know they're here
var needArgs = ["select", "attr", "csv", "append"];

//-------------------------------------------------------------------------------------------------
// Functions
//-------------------------------------------------------------------------------------------------

//funcLogger.replace() replaces any function with a self-logging version of that function. The
//input and output of the function are unchanged, but the function will push its name into
//the funcsCalled array when it is invoked.
//Parameter: old_func -- The code of the function to replace.
//Parameter: func_name -- The name of the function to replace.

funcLogger.replace = function(old_func, func_name)
{
    return function()
    {
        //We don't need duplicates; Only push the function name if not already there.
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

        //Return the old function with this extra snippet of code appended.
        return old_func.apply(this, arguments);
    }
}

//InterceptD3() checks whether D3 source code has loaded on the page. If it has, it uses
//funcLogger.replace() to replace all D3 functions with self-logging functions. Additionally,
//it disables the MutationObserver watching for script loading, to avoid a slow page execution.

function interceptD3()
{
    //Only fire the interceptor once.
    if(alreadyFired)
        return;

    //Window.d3 is created by D3 source code.
    if(window.d3)
    {
        //Set internal fields to avoid a second interception, disable the mutation observer.
        alreadyFired = true;
        mo.disconnect();
        console.log("Expert Goggles: Interceptor Fired.")

        //For all fields in window.d3...
        for(var name in window.d3)
        {
            var func = window.d3[name];
            if(typeof func == "function") //...if that field is a function...
                window.d3[name] = funcLogger.replace(func, name); //...replace it.
            else //...if that field is not a function...
                for(var subName in window.d3[name])
                {
                    //...check if that field itself has associated functions.
                    var subFunc = window.d3[name][subName]
                    if(typeof subFunc == "function") //Replace those.
                        window.d3[name][subName] = funcLogger.replace(subFunc, subName);
                }
        }
    }
}

//inspectMutations() is the callback function for our mutation observer. It takes a list
//of captured mutations (changes to the DOM), and looks over those to determine if any
//were script loads. If they were, it calls interceptD3() to check if D3 source code
//was loaded. This approach allows D3 code to be intercepted between script loads.

function inspectMutations(mutations)
{
    for(let m of mutations)
    {
        //addedNodes is the field of a single mutation indicating what was added.
        var newNode = m.addedNodes[0];
        try
        {
            if(newNode.tagName == "SCRIPT")
                interceptD3();
        }
        catch(err){}//Thousands of mutations occur, we can't handle errors w/o slowing the page.
    }
}

//sendToParser() messages the captured list of D3 functions called by the page, as well as the URLs
//of any iframes, out to the Parser script. If those lists are empty, the message is still sent.

function sendToParser()
{
    //Generate a message with the necessary info
    var message = {};
    message.funcList = funcLogger.funcsCalled;
    message.argList = funcLogger.argList;
    message.sender = "ExpertGogglesInterceptor";
    message.iframeList = iframeList;

    //Log Info Out
    console.log(message.funcList);
    console.log(message.argList);

    //Since this script is injected, we have to use window.postMessage
    try{window.postMessage(message, "*");}
    catch(error) {console.log(error)};
}

//-------------------------------------------------------------------------------------------------
// Main Execution
//-------------------------------------------------------------------------------------------------

//The interceptor is appended to document before anything else loads.
//Create a mutation observer to watch for changes to the DOM. inspectMutations() is the callback.
var mo = new MutationObserver(inspectMutations);
mo.observe(document, {subtree: true, childList: true});

//Listen for when the document is finished loading. When it is, grab the URLs of any iframes.
document.addEventListener("DOMContentLoaded", function()
{
    var iframes = document.getElementsByTagName("iframe");
    for(let i of iframes)
        iframeList.push(i.src);
});

//We use setTimeout to message out because some pages never finish loading, especially if
//D3 code is manipulating elements. 1.2 seconds seems to be a reliable timer.
setTimeout( function() {sendToParser();}, 1200);
`;

//-------------------------------------------------------------------------------------------------
// End of Interceptor Code --> Injector Code
//-------------------------------------------------------------------------------------------------

//Manually create a script tag with the interceptor code set as its textContent.
//async is set to false to try and avoid racing script loads.
var d3script = document.createElement("script");
d3script.textContent = scriptText;
d3script.type = "text/javascript";
d3script.id = "ExpertGoggles";
d3script.setAttribute("async", "false");

//Append that script to document.
document.documentElement.append(d3script);
console.log("Expert Goggles: Injected D3 Interception Script.");


