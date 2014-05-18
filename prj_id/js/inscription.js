 
var inscription = {};

inscription.start = function () {
	document.getElementById("send").addEventListener("click", inscription.send, false);
	document.getElementById("reset").addEventListener("click", inscription.reset_form, false);
};

inscription.send = function ()  {
	var statu = 0;
	var nom = document.getElementById("n_name").value; 
	var f_n = document.getElementById("f_name").value; 
	var pwd = document.getElementById("pwd").value; 
	var mail = document.getElementById("mail").value; 
	var radios = document.getElementsByName("statu");
	for (var i = 0, length = radios.length; i < length; i++) {
	    if (radios[i].checked) {
 	       	statu = radios[i].value;
	        break;
	    }
	}
	var data = {action: "inscription", n_name:  nom, f_name: f_n, email:  mail,passwd : pwd, role: statu};
	console.log(data);
	inscription.post(data,inscription.message);
};

inscription.message = function ()  {
	if (this.readyState == 4 ){
		if(this.status == 200) {
			document.getElementById("message").innerHTML = '<div class="alert alert-success"><strong>Success, Inscription effectué </strong></div>';
			document.getElementsByClassName("small")[0].innerHTML = "Votre inscription a bien été prise en compte";
	 	}else{
			document.getElementById("message").innerHTML = '<div class="alert alert-danger"><strong>Error, l\'inscription n\'a pas été faite</strong></div>';
		}
		setTimeout(function(){ document.getElementById("message").innerHTML = '';}, 5000);
	}
};

/**
*This method cleans a form
*/
inscription.reset_form = function(src){
	var form = src.parentNode.getElementsByTagName("form")[0];
	for(input in form){
		if(form[ input ] != null && typeof(form[ input ]) == "object" && input <= form.length) {
			if(form[ input ].getAttribute("type") == "text" || form[ input ].getAttribute("type") =="email" || form[ input ].getAttribute("type") == "password"){
				form[ input ].value = ""; 
			}	
		}
	}
}

inscription.post = function (data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.onreadystatechange = callback;
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
};

window.onload = function () {
	setTimeout(inscription.start, 1);
};