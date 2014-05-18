var ind = {};

ind.init = function () {
    document.addEventListener("click", ind.on_click);//attends event 
};

ind.on_click = function (ev) { //quand on clique, ev event 
    var src = ev.target;
    if (src.has_class("validate-login")) {
        console.log("validate-login");
        ind.validate_login();
    } else if (src.has_class("post2")) {
        console.log("Post2 clic");
        ind.send_post2();
    }
};

/**
*This method takes the inputs and gatheres them into the variable in order to send the post request
*/
ind.validate_login = function() {
    var mail = document.getElementsByClassName("input-mail")[0].value;
    var pw = document.getElementsByClassName("input-password")[0].value;
    var data = {action: "first_login", login : mail, password: pw};
    ind.post(data, ind.resp_valid_login);
};

/**
*This method defines the data variable taking the inputs
*/
ind.send_post2 = function() {
    var a = document.getElementsByClassName("inp1")[0].value;
    var b = document.getElementsByClassName("inp2")[0].value;
    var data = {arg1: b, arg2 : a};
    ind.post(data, ind.post2_back);
};

/**
*This method returns the response 
*/
ind.resp_valid_login = function () {
    if (this.readyState == 4 && this.status == 200) {
        var r = this.responseText;
        r = JSON.parse(r);
		if (r.resp == "ok") {
			console.log("ok");
		} else if (r.resp == "ko") {
			console.log("ko");
		}
    }
};

/**
*The method displays the response
*/
ind.post2_back = function () {
    if (this.readyState == 4 && this.status == 200) {
        var r = this.responseText;
        console.log("Post2 resp : " + r);
    }
};

ind.post = function (data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.onreadystatechange = callback;
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
};

window.onload = function () {
    setTimeout(ind.init, 1);
};

HTMLElement.prototype.has_class = function (c) {
    return (this.className.indexOf(c) >= 0);
};