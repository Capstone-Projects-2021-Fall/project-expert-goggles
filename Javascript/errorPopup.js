//This file is loaded into the Extension's Error Popup and makes the link to the dashboard clickable

//Communicate with DBConn
var port = chrome.extension.connect({
    name: "Sample Communication"
});

//Populate the error message depending on whether D3 was present or absent, and whether there are iframes
port.onMessage.addListener(function(msg)
{
    //Handle if D3 Code is present
    var d3 = msg.d3type;
    var d3div = document.getElementById("d3div");
    if(d3 == "none")
        d3div.innerHTML = "We have not detected any D3 source code on this page.";
    else
        d3div.innerHTML = "We have detected D3 source code on this page, but are unable to parse its type.";

    //Handle if iframes are present
    var iframes = msg.iframeList;
    var idiv = document.getElementById("iframediv");
    if(iframes.length > 0)
    {
        idiv.innerHTML = "We have detected iframes elements on this page. Currently, Expert Goggles<br>"
                      + "is not able to detect D3 visualizations inside of embedded iframes. If you think<br>"
                      + "there is a visualization on this page that we are not detecting, try visiting the<br>"
                      + "relevant iframe directly. It may circumvent the issue. We have detected iframes<br>"
                      + "with the following URLs:<br>";
        for(i of iframes)
        {
            var iLink = document.createElement("a");
            iLink.href = i;
            iLink.innerHTML = i;
            idiv.appendChild(iLink);
        }
        makeLinksClickable();
    }
});

//Links in Chrome Page Actions are unclickable by default
//This function fixes that. Called at start and whenever links are added.
function makeLinksClickable()
{
    var links = document.getElementsByTagName("a");
    for(let link of links)
    {
        //Check if link already has a click event to avoid duplicate tabs
        if(!link.listener && link.listener != "true")
        {
            link.listener = "true";
            link.addEventListener('click', () => chrome.tabs.create({active: true, url: link.href}));
        }
    }
}

//Make the links clickable since chrome blocks them in popups
document.addEventListener('DOMContentLoaded', function (){ makeLinksClickable(); });