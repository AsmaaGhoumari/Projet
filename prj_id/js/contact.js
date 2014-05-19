var contact = {};

contact.start = function () {
	var el = document.getElementById("send"); 
    el.addEventListener("click", contact.send, false);
};

contact.send = function ()  {
	var nom = document.getElementById("name").value; 
	var email = document.getElementById("email").value; 
	var message = document.getElementById("message").value; 
	var data = {action: "contact", name: nom, mail: email, msg: message};
	contact.post(data,contact.retour_cb);
};

contact.retour_cb = function(){
	if (this.readyState == 4 ){
		if(this.status == 200 ) {
			document.getElementById("message").innerHTML = '<div class="alert alert-success"><strong>Envoi réussi</strong></div>';
	 	}else{
			document.getElementById("message").innerHTML = '<div class="alert alert-danger"><strong>Envoi échoué</strong></div>';
		}
		setTimeout(function(){ document.getElementById("message").innerHTML = '';}, 3000);
	}
};

contact.post = function (data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.onreadystatechange = callback;
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
};

window.onload = function () {
	setTimeout(contact.start, 1);
};
