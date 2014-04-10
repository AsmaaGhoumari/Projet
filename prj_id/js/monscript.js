var mission= {};

mission.start = function ()  {
	document.addEventListener("click", mission.on_click);
};

mission.on_click = function (ev){
	var src = ev.target;
	if (src.has_class("butt1")){
		var elt = document.getElementsByClassName("modal-body")[0];
	}
	else if (src.has_class("butt2")){
		var elt = document.getElementsByClassName("modal-body")[0];
	}
	else if (src.has_class("butt3")){
		var elt = document.getElementsByClassName("modal-body")[0];
	}
	else if (src.has_class("butt4")){
		var elt = document.getElementsByClassName("modal-body")[0];
	}
	else if (src.has_class("butt5")){
		var elt = document.getElementsByClassName("modal-body")[0];
	}
	else if (src.has_class("butt6")){
		var elt = document.getElementsByClassName("modal-body")[0];
	}
	else if (src.has_class("butt7")){
		var elt = document.getElementsByClassName("modal-body")[0];
	}
	else if (src.has_class("butt8")){
		var elt = document.getElementsByClassName("modal-body")[0];
	}
	else if (src.has_class("butt9")){
		var elt = document.getElementsByClassName("modal-body")[0];
	}
	else if (src.has_class("butt10")){
		var elt = document.getElementsByClassName("modal-body")[0];
	}
	else if (src.has_class("butt11")){
		var elt = document.getElementsByClassName("modal-body")[0];
	}
	else if (src.has_class("butt12")){
		var elt = document.getElementsByClassName("modal-body")[0];
	}
	else if (src.has_class("butt13")){
		var elt = document.getElementsByClassName("modal-body")[0];
	}
	else if (src.has_class("butt14")){
		var elt = document.getElementsByClassName("modal-body")[0];
	}
	else if (src.has_class("butt15")){
		var elt = document.getElementsByClassName("modal-body")[0];
	}
	else if (src.has_class("butt16")){
		var elt = document.getElementsByClassName("modal-body")[0];
	}
	else if (src.has_class("butt17")){
		var elt = document.getElementsByClassName("modal-body")[0];
	}
};


window.onload = function () {
	mission.start();
};

HTMLElement.prototype.has_class = function (c){
	return (this.className.indexOf(c) >= 0);
};


  