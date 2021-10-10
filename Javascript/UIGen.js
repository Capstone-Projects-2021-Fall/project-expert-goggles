"use strict";

function createSidebar()
{
    var sb = document.createElement("div");
    sb.classList.add("sidebar");
    sb.innerHTML = "Hello World!"
    console.log("Sidebar Created.");
    document.body.style.marginRight = "250px";
    document.body.appendChild(sb);
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
            createSidebar();
    }
    return;
}

try
{
    createPrompt("test");
    console.log("prompt created.");
}
    catch(err) {console.log("Page not loaded yet.");}