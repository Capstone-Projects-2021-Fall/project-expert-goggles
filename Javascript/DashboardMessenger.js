/**
*                                Expert Goggles Dashboard Messenger
*   DashboardMessenger.js is a content script run only on the Dashboard's User History page.
*   It simply queries the User ID from DBConn.js, and posts that information to the page.
*   This allows the Dashboard Page to detect the user without requiring manual sign-in.
*/

//Message to DBConn.js
var message = {"from": "DashboardMessenger"};
try
{
    chrome.runtime.sendMessage(message, function(reply)
    {
        //When a reply is received, post that message to the webpage.
        window.postMessage({"userID": reply.uid, "sender": "ExpertGoggles"}, "*");
    });
}
catch(error) {console.log(error);}

