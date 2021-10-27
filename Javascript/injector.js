//Inject D3 source code onto the page
var d3script = document.createElement("script");
d3script.src = chrome.extension.getURL("Javascript/d3.js");
d3script.charset = "utf-8";
d3script.id = "EGScript";
document.documentElement.appendChild(d3script);
console.log("Injected D3 Source Code.");

var interceptor = document.createElement("script");
interceptor.src = chrome.extension.getURL("Javascript/interceptor.js");
interceptor.charset = "utf-8";

//Wait for that script to load to overwrite d3 functions
d3script.addEventListener('load', injectInterceptor());

//Inject an interceptor that will overwrite d3 functions
function injectInterceptor()
{
    document.documentElement.appendChild(interceptor);
    console.log("Injected Interceptor Code.");
}


