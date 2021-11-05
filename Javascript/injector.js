//Inject Interceptor onto the page

//Workaround to race condition
//Recommended by Comments Section Addressing this Bug
//https://bugs.chromium.org/p/chromium/issues/detail?id=634381
var url = chrome.extension.getURL("Javascript/interceptor.js");
var urlEncoded = window.btoa(unescape(encodeURIComponent(url)));
var urlContent = localStorage.getItem(urlEncoded);

if (!urlContent)
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onload = function(e)
    {
        if ((xhr.readyState === 4) && (xhr.status === 200))
        {
            localStorage.setItem(urlEncoded, xhr.responseText);
            window.location.reload(true);
        }
    };

    xhr.send(null);

    document.write('<script src="' + url + '"><\/scr' + 'ipt>');
}
else
{
    var d3script = document.createElement("script");
    //d3script.src = chrome.extension.getURL("Javascript/d3.js");
    d3script.textContent = urlContent;
    d3script.charset = "utf-8";
    d3script.type = "text/javascript";
    d3script.id = "ExpertGoggles";
    d3script.setAttribute("async", "false");
    document.documentElement.append(d3script);
    localStorage.removeItem(urlEncoded);
    console.log("Expert Goggles: Injected D3 Interception Script.");
}




