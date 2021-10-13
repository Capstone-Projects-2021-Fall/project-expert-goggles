"use strict";

var sbOpened = -1;
var sb;

function toggleSidebar()
{
    if(sbOpened < 0)
    {
        document.body.style.marginRight = "250px";
        sb.style.width = "250px";
    }
    else
    {
        document.body.style.marginRight = "0px";
        sb.style.width = "0px";
    }

    sbOpened *= -1;
    return;
}

function createPrompt(DOMid)
{
    var d3 = document.getElementById(DOMid);

    var prompt = document.createElement("div");
    prompt.innerHTML = "Expert Goggles!";
    prompt.classList.add("prompt");
    prompt.id = "ExpertGoggles";
    d3.appendChild(prompt);

    window.onclick = function(event)
    {
        if(event.target.id == "ExpertGoggles")
            toggleSidebar();
    }
    return;
}

try
{
    sb = document.createElement("div");
    sb.classList.add("sidebar");
    sb.innerHTML = "Hello World!";
    document.body.appendChild(sb);
    createPrompt("test");
    console.log("prompt created.");
}
    catch(err) {console.log("Page not loaded yet.");}