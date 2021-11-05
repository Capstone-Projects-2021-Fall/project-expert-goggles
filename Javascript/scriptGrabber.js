var elems = document.getElementsByTagName("script");
var scripts = [];
var index = 0;

for(let script of elems)
{
    var sObj = {};

    if(script.src)
    {
        sObj.type = "inline";
        var xhr = new XMLHttpRequest();
        xhr.open('GET', script.src, false);
        xhr.onload = function(e)
            {
                if ((xhr.readyState === 4) && (xhr.status === 200))
                {
                    sObj.inline = xhr.responseText;
                    scripts[index] = sObj;
                    index++;
                }
            };
        xhr.send(null);
    }
    else if(script.innerHTML)
    {
        sObj.type = "inline";
        sObj.inline = script.textContent;
        scripts[index] = sObj;
        index++;
    }
    else
        sObj.type = "unknown";
}

var message = {};
message.scripts = scripts;
console.log(scripts);

function sendToBackground()
{
     try{chrome.runtime.sendMessage(message);}
     catch(err) {console.log(err);}
}

sendToBackground();