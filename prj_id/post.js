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
ind.send_post = function() {
    var name = document.getElementsByClassName("inp1")[0].value;
    var fname = document.getElementsByClassName("inp2")[0].value;
    var email = document.getElementsByClassName("inp3")[0].value;
    var passwd = document.getElementsByClassName("inp4")[0].value;
    var role = document.getElementsByClassName("inp5")[0].value;
    var data = {arg1: name, arg2 : fname, arg3 : email, arg4 : passwd, arg5 : role};
    ind.post(data, ind.post_back);
};

/**
*This method is used to send a post
*/
/*
ind.send_post2 = function() {
    var a = document.getElementsByClassName("inp1")[0].value;
    var b = document.getElementsByClassName("inp2")[0].value;
    var data = {arg1: b, arg2 : a};
    ind.post(data, ind.post2_back);
};
*/
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
*This method is used to call the callback 
*/
/*
ind.post2_back = function () {
    if (this.readyState == 4 && this.status == 200) {
        var r = this.responseText;
        console.log("Post2 resp : " + r);
    }
};*/

/**
*This method is used to ....
*/
ind.post = function (data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.onreadystatechange = callback;
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
};

/**
*This method is added to the HTMLElement library 
*@param c (String) 
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
