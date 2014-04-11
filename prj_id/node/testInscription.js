var ind = {};

ind.init = function () {
    document.addEventListener("click", ind.on_click);//attends event 
};

ind.on_click = function (ev) { //quand on clique, ev event 
    var src = ev.target;
    if (src.has_class("validate-inscription")) {
        console.log("validate-inscription");
        ind.validate_inscriptionn();
    } else if (src.has_class("post2")) {
        console.log("Post2 clic");
        ind.send_post2();
    }
};


ind.validate_inscription = function() {
    var nom =document.getElementsByClassName("input-nom")[0].value;
    var prenom =document.getElementsByClassName("input-prenom")[0].value;    
    var mail = document.getElementsByClassName("input-mail")[0].value;
    var pw1 = document.getElementsByClassName("input-password")[0].value;
    var pw2 = document.getElementsByClassName("input-password")[0].value;
    var data = {action: "add_user", login : mail, password: pw};
    if (pw1==pw2){  ind.post(data, ind.resp_valid_inscription);}
    else console.log("Erreur d'inscription");

};



ind.resp_valid_inscription = function () {
    if (this.readyState == 4 && this.status == 200) {
        var r = this.responseText;
        r = JSON.parse(r);
		if (r.resp == "ok") {
			console.log("FELICITATION ! ");
		} else if (r.resp == "ko") {
        //fermeture du modal 
       $(id modal) .modal('hide');
		console.log("ko");
		}
    }
};


window.onload = function () {
    setTimeout(ind.init, 1);
};

HTMLElement.prototype.has_class = function (c) {
    return (this.className.indexOf(c) >= 0);
};