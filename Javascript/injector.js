//Inject modfieid D3 source code onto the page
var d3script = document.createElement("script");
d3script.src = chrome.extension.getURL("Javascript/d3.js");
d3script.charset = "utf-8";
d3script.id = "EGScript";
document.documentElement.appendChild(d3script);
console.log("Expert Goggles: Injected D3 Source Code.");


