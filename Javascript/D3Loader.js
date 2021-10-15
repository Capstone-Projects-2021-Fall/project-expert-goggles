"use strict";

/*
//Makes D3 source code Available on every page
var myScript = document.createElement('script');
myScript.src = chrome.runtime.getURL("Javascript/d3.js");
myScript.id = "EGScript";
myScript.async = "false";
myScript.type = "module";
*/
var myScript2 = document.createElement('script');
myScript2.src = chrome.runtime.getURL("Javascript/test.js");
myScript2.id = "EGScript2";
myScript2.async = "false";
myScript2.type = "module";

//(document.head || document.documentElement).appendChild(myScript);

//myScript.addEventListener("load", function() {
(document.head || document.documentElement).appendChild(myScript2);
//});


