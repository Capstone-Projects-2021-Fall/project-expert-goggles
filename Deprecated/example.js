
const expertGogglesID = “oaabhcneffbbgikojonjehejjhaobooe”;
var userID;

try{
    chrome.runtime.sendMessage(expertGogglesID, { message: "user_id" },
    function (reply)
    {
        if(reply)
            if(reply.user_id)
            {
                userID = reply.user_id;
                //Callback function to generate custom user history table
                //generateHistoryTable(); //Name it whatever you want
            }
            else
            {
                //Callback to populate page saying no extension was detected or there was an error
                //generateNoExtensionPage(); //Name it Whatever you want
            }
    });
}
catch(err)
{
    //Same as the else statement above
    //Callback to populate page saying no extension was detected or there was an error
    //generateNoExtensionPage(); //Name it Whatever you want
}