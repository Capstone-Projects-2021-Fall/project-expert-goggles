/*
*   Interceptor.js is injected into webpages at load to replace
*   some key D3 functions with "intercepted" functions. These
*   return the same output as D3 source code, but include extra
*   steps to extract information out for use in Expert Goggles's
*   parsing functions.
*/

var parseObj = {};
var funcs = [];

function interceptD3()
{
    var old_create = d3.create;
    var old_select = d3.select;
    var old_selectAll = d3.selectAll;
    var old_line = d3.line;

    var new_create = function(args)
    {
        console.log("d3.create() was called");
        funcs.push("create");
        var d3elem = old_create(args);
        return d3elem;
    };

    var new_select = function(args)
    {
        console.log("d3.select() was called");
        funcs.push("select");
        var d3elem = old_select(args);
        return d3elem;
    };

    var new_selectAll = function(args)
    {
        console.log("d3.selectAll() was called");
        funcs.push("selectAll");
        d3elem = old_selectAll(args);
        return d3elem;
    };

    var new_line = function(args)
    {
         console.log("d3.line() was called");
         funcs.push("line");
         d3elem = old_line(args);
         return d3elem;
    };


    Object.defineProperty(window.d3, "create", {value: new_create, writable: false});
    Object.defineProperty(window.d3, "select", {value: new_select, writable: false});
    Object.defineProperty(window.d3, "selectAll", {value: new_selectAll, writable: false});
    Object.defineProperty(window.d3, "line", {value: new_line, writable: false});

}

function sendToBackground()
{
    //Append funcs[] array to parseObj
    parseObj.funcs = funcs;
    parseObj.sender = "ExpertGoggles";

    console.log("Sending message to background.");

    //Message ParseObj out
    try
    {
        window.postMessage(parseObj, "*");
    }
    catch(err) {console.log(err);}
}

//Main Execution

//Overwrite D3 Code once source code has loaded
var d3script = document.getElementById("EGScript");
d3script.addEventListener("load", interceptD3);

//Wait to message out so execution can finish
setTimeout(function() {sendToBackground(); }, 1500);
