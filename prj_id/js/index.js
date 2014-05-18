
var index = {};

index.run = function () {
	document.getElementsByClassName("validate")[0].addEventListener("click", index.send, false);
};

/**
*This method sends data coming from the modal "connexion" 
*/
index.send = function ()  {
	var msg = document.getElementById('message');
	msg.innerHTML = "";
	var login = document.getElementById("login").value; 
	var pwd = document.getElementById("pwd").value; 
	var data = {action: "first_log", email: login, password: pwd};
	index.post(data, index.receive);
};


/**
*This method gives a cookie, and sends the users on its page account 
*/
index.receive = function ()  { 
	var rep = JSON.parse(this.responseText);
	if( rep.resp.log == "true" ) {
		if(rep.resp.role == 1)
			self.location.href = "/site/redac.html";
		else if(rep.resp.role == 2 )
			self.location.href = "/site/admin.html";
	}else{
		document.getElementById('message').innerHTML = '<div class="alert alert-danger">Mauvais mot de passe et/ou login</div>';
	}
}; 

/**
*This methods send data in JSON format
*@param data 
*@param callback 
*/
index.post = function (data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.onreadystatechange = callback;
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
};


window.onload = function () {
	setTimeout(index.run, 1);
};
