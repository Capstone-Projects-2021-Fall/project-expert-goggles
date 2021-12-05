/**
*   Given that defining global classes is not straightforward in Chrome Development,
*   and also given that Javascript doesn't require object to be strictly defined,
*   this file is a reference to see what the object holds, and what names to use
*   for the fields passed between the extension's pieces. This file is not
*   actually used by the extension.
*/

class D3InfoObj
{
    constructor()
    {
        this.DOMid = null; // The DOM Element ID of a located D3
        this.type = null; // The Type of the parsed D3 Element
        this.guide = null; // An object that holds the JSON Representing a Vis. Guide
        this.URL = null; // The URL the D3 was located at.
        this.img = null; // The URL for an image to include with the guide.
        this.tab = null; // The Tab ID where a D3 was located. For use in messaging between scripts.
        this.from = null; // Identifies which script messaged this object, used in extension logic.
    }
}