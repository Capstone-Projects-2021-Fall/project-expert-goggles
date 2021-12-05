//This file is loaded into the Extension's Error Popup and makes the link to the dashboard clickable

//Make the links clickable since chrome blocks them in popups
document.addEventListener('DOMContentLoaded', function ()
{
    var link = document.getElementById("link");
    var location = link.href;
    link.addEventListener('click', () => chrome.tabs.create({active: true, url: location}));
});