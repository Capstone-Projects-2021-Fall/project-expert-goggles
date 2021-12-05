/**
*   ErrorPopup.js is the logic for the extension's Error-state Page Action. It informs
*   the user whether D3 source code was detected, what errors occurred, and if any
*   iframes are present.
*/

//Links in Chrome Page Actions are unclickable by default.
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

//Establish a connection with DBConn.js
var port = chrome.extension.connect
({
    name: "Error Popup Communication"
});

//Listen on that port for DBConn to send D3 and iframe information
port.onMessage.addListener(function(message)
{
    //Handle if D3 Code is present
    var d3 = message.d3type;
    var d3div = document.getElementById("d3div");
    if(d3 == "none")
        d3div.innerHTML = "We have not detected any D3 source code on this page.";
    else
        d3div.innerHTML = "We have detected D3 source code on this page, but are unable to parse its type.";

    //Handle if iframes are present
    var iframes = message.iframeList;
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

//Make the links clickable since chrome blocks them in popups
document.addEventListener('DOMContentLoaded', function (){ makeLinksClickable(); });