/**
*This file is used to generate posts from the web pages
*/
var ind = {};
var div_class = {};
/**
*This method is waiting for a event on the plug
*/
ind.init = function () {
    document.addEventListener("click", ind.on_click);//attends event 
};

/**
*This method is used to match en click when an event occurs
*@param ev : event 
*/
ind.on_click = function (ev) { 
    var src = ev.target;
    if (src.has_class("post1")) {
        console.log("Post1 clic");
        ind.send_post();
    } else if (src.has_class("post2")) {
        console.log("Post2 clic");
        ind.send_post2();
    }
};

/**
*This method is used to send a post for the inscription 
*/
ind.send_post_inscrip = function() {
    var n = document.getElementsByClassName("inp_name")[0].value;
    var fn = document.getElementsByClassName("inp_fname")[0].value;
    var em = document.getElementsByClassName("inp_email")[0].value;
    var pw = document.getElementsByClassName("inp_passwd")[0].value;
    var r = document.getElementsByClassName("inp_role")[0].value;
    var data = {action: login, name: n, fname : fn, login : em, passwd: pw, role: r};
    ind.post(data, ind.post_back);
};



/**
*This method is used to call the callback 
*/
ind.post_back = function () {
    if (this.readyState == 4 && this.status == 200) {
        var r = this.responseText;
        console.log("Post resp : " + r);
    }
};



/**
*This method is used to  send the POST (en format JSON)

*/
ind.post = function (data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.onreadystatechange = callback;
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
}; 

/**
* Test if this HTMLElement has the class given
* This isa add to the HTMLElement prototype
* if we look for the class : "bob" and we got a bobby class in this element it returns true
* we can fix that with c = " " + c + " ";
* @param c (String) the name of the class given //by exemple "class-input-log"
* @return true if the element have this class, false if not
*/
HTMLElement.prototype.has_class = function (c) {
    return (this.className.indexOf(c) >= 0); 
};

/**
*This method is used to load a function with a 1ms delay 
*/
window.onload = function () {
    setTimeout(ind.init, 1);
};

/**
*This method is used to sign in a new user 
*
*/
login = function () {
var name = document.getElementById("inp-login").value;
var pass= document.getElementById("inp-pass").value;
var data = {action: login, log:name, pw: pass};
post(data, ma_callback);
};

