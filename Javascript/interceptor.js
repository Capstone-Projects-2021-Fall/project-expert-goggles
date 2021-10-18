//Callback function once document has loaded
var d3elem;

function interceptD3()
{
    var old_create = d3.create;
    var old_select = d3.select;

    var new_create = function(args)
    {
        console.log("d3.create() was called");
        d3elem = old_create(args);
        console.log(d3elem); //We have the element that d3 is now, just logging it for now!
        return d3elem;
    };

    var new_select = function(args)
    {
        console.log("d3.select() was called");
        d3elem = old_select(args);
        console.log(d3elem);//We have the element that d3 is now, just logging it for now!
        return d3elem;
    }

    Object.defineProperty(window.d3, "create", {value: new_create, writable: false});
    Object.defineProperty(window.d3, "select", {value: new_select, writable: false});
}

var d3script = document.getElementById("EGScript");
d3script.addEventListener("load", interceptD3);
