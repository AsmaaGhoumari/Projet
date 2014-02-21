var idee = {}; //déclaration objt vide
idee.modal = {};//déclaration second objt vide dans premier objt vide

idee.on_ready = function () {  
	idee.ev_change_init();
};

idee.ev_change_init = function () {
	var pw = document.getElementsByClass("input-password")[0];
	var pwc = document.getElementsByClass("input-password")[0];
	pw.addEventListener("change", idee.modal.check_password);
	pwc.addEventListener("change", idee.modal.check_password);
}

//idee.modal.

idee.modal.check_password = function () { 
	var pw = document.getElementsByClass("input-password")[0];
	var pwc = document.getElementsByClass("input-password")[0];
	//je te conseille de mettre un breakpoint ici pour regarder les objets, pw et pwc
	if (pw.value == pwc.value) {
		//met en vert
	}else {
		//met en rouge
	}
};

window.onload = function () {  
	setTimeout(idee.on_ready, 1);
};

HTMLElement.prototype.has_class = function (c) {
	return (element.className.indexOf(c) >= 0);
};

//var elt = document.getElementById("zertyui");
//var elt_by_class = document.getElementsByClassName("class-bobby")[0];