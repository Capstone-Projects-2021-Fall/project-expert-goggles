var frames = document.getElementsByTagName("iframe");
var index = 0;

while(index < frames.length)
{
    var curr = frames[index];

    console.log(curr.contentWindow.innerHTML);
    index++;
}