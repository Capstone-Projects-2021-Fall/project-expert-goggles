//This file is loaded into the Extension's Error Popup and makes the link to the dashboard clickable

//Communicate with DBConn
var port = chrome.extension.connect({
    name: "Sample Communication"
});

//Await a Message with Iframe Information
//We only get this message if iframes are on the page, so we can add information
//about them to our error popup without a check
port.onMessage.addListener(function(msg)
{
    var iframes = msg.iframeList;
    var div = document.getElementById("iframes");
    div.innerHTML = "We have detected iframes elements on this page. Currently, Expert Goggles<br>"
                  + "is not able to detect D3 visualizations inside of embedded iframes. If you think<br>"
                  + "there is a visualization on this page that we are not detecting, try visiting the<br>"
                  + "relevant iframe directly. It may circumvent the issue. We have detected iframes<br>"
                  + "with the following URLs:<br><br>";
    for(i of iframes)
    {
        var iLink = document.createElement("a");
        iLink.href = i;
        iLink.innerHTML = i;
        div.appendChild(iLink);
    }
    makeLinksClickable();
});

//Links in Chrome Page Actions are unclickable by default
//This fixes that.
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
document.addEventListener('DOMContentLoaded', function ()
{
    makeLinksClickable();
});