console.log("Extension-to-Dashboard Messenger: On User History Page, getting User ID.");

//Get the User ID From DBConn
var message = {"from": "DashboardMessenger"};
try
{
    chrome.runtime.sendMessage(message, function(reply)
    {
        //Post that info out to the page
        try
        {
            window.postMessage({"userID": reply.uid, "sender": "ExpertGoggles"}, "*");
            console.log("Posted user ID " + reply.uid);
        }
        catch(err) {console.log(err);}
    });
}
catch(err) {console.log(err);}

