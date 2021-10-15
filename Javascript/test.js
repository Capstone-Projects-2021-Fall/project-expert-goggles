/*

//Replace the D3.create function
var old_create = d3.create;
d3.create = function(args)
{
    console.log("There's some D3 business going on here. And I'm going to find out what it is.");
    old_create(args);
}

var old_select = d3.select;
d3.select = function(args)
{
    console.log("There's some D3 business going on here. And I'm going to find out what it is.");
    old_select(args);
}

Object.defineProperty(window.d3, "property1", {writable: false}); */

function lookForD3()
{
   if(window.d3)
   {
        console.log("I think there's some d3 on this page!");
        return true;
   }

   var iframes = document.getElementsByTagName("iframe");
   for(let frame of iframes)
   {
        if(frame.contentWindow.d3)
        {
            console.log("I think there's some d3 on this page!");
            return true;
        }
   }
}

document.onreadystatechange = function()
{
    if(document.readyState === "complete")
        if(lookForD3() == false)
            console.log("No D3 Found.");
}
