//Expert Goggles: Function Logger Tracks function calls from D3
"use strict";

var funcLogger = {};
funcLogger.funcsCalled = [];
var alreadyFired = false;
var scriptList;
var index = 0;

window.onerror = function (msg, url, lineNo, columnNo, error) {
  console.log("Error Line Number: " + lineNo);
  console.log(columnNo);
  console.log(error);
  interceptD3();

  return false;
}

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

function interceptD3()
{
    if(window.d3 && !alreadyFired)
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

    index++;
    console.log(alreadyFired);

    if(index < scriptList.length)
        runNext();
    else
        outputResult();
}

function outputResult()
{
    console.log(funcLogger.funcsCalled);
}

//Appends the scripts passed by the Parser to the background page
//and runs them one at a time. If D3 source code was loaded, it calls interceptD3
//to overwrite it with the interception function. When the last is run, it reloads
//the background page.
function runNext()
{
    var curr = scriptList[index];

    var script = window.document.createElement("script");
    script.charset = "utf-8";
    script.textContent = curr.inline;

    console.log(script);
    window.document.body.appendChild(script);
    console.log("script appended.");
    interceptD3();
}

//Listen for a message from the scriptGrabber forwarded by DBConn
window.addEventListener("message", (event) =>
  {
    var message = event.data;
    if(!message.scripts)
        return;

    scriptList = message.scripts;
    console.log(scriptList);

    runNext();
  }
);
