var redac = {}; 
var init = new Array("get_unval_my_news","my_account","get_my_news"); //,"get_my_news"
var i = 0;
var NOM= " ", PRENOM= " ", MAIL= " ", SADMIN = "", TMP_N ="", TMP_P ="", TMP_M="", TMP_R = "";

redac.timeConverter = function(UNIX_timestamp){
 var a = new Date(UNIX_timestamp*1);
 var months = ['Jan','Fev','Mars','Avril','Mai','Juin','Jul','Aout','Sep','Oct','Nov','Dec'];
     var year = a.getFullYear();
     var month = months[a.getMonth()];
     var date = a.getDate();
     var hour = a.getHours();
     var min = a.getMinutes();
     var sec = a.getSeconds();
     var time = date+' '+month+' '+year;
     return time;
 };

/**
*This method launches the process
*/
redac.run=function(){
	redac.next();
	document.addEventListener("click", redac.onclick); 
	document.getElementById("send_m").addEventListener("click", redac.send_m); 
	document.getElementById("send_news").addEventListener("click", redac.send_news); 
	document.getElementById("delete_account").addEventListener("click", redac.delete_account); 

}; 


redac.next = function(){
	if(i < init.length)	{
		redac[ init[i] ]();
		i++;
	} 
};

/**
*This method allows to detect events and defines the attributs' data variable 
*/
redac.onclick = function (ev) {
	var src = ev.target;
	var data;
	if(src.has_class("news")) {
		attr = src.getAttribute("attr").split(" ");
		if (src.has_class("del")) {
			console.log(attr);
			data = {action: "delete_news", name: attr[0], firstname: attr[1], titre: attr[2] };
			redac.post(data, redac.retour_cb);
		}else if(src.has_class("modif")){
			var ligne = src.parentNode.parentNode.getElementsByTagName("div")[0];
			TMP_N = document.getElementById('titre_news').value = ligne.childNodes[1].innerHTML;
			TMP_P = document.getElementById('msg_news').value = ligne.childNodes[3].innerHTML;
			TMP_M = attr[0];
			TMP_R = attr[1];
			$("#modif_news").modal("show");	
		}
	} 
};

/**
*This methods returns unvalid news 
*/
redac.get_unval_my_news=function(){
	var data = {action: "get_unval_my_news"};
	redac.post(data, redac.get_unval_news_cb);
}; 

/**
*This method returns news of the user
*/
redac.get_my_news=function(){
	var data = {action: "my_news"};
	redac.post(data, redac.my_news_cb);
}; 

/**
*This method returns informations of the user
*/
redac.my_account=function(){
	var data = {action : "my_account"};
	redac.post(data, redac.my_account_cb);
}; 


redac.send_news=function(){	
	var data = { action : "add_news", message: document.getElementById("message_news").value, title: document.getElementById("title_news").value }; 
	redac.post(data, redac.retour_cb); 
};

redac.delete_account = function(){
	if (window.confirm("Etes vous sur ?")) {
		var data = {action : "delete_user"}; 
		redac.post(data, redac.retour_cb); 
		self.location.href="../index.html";
	}
};

redac.send_m=function(ev){	
	var src = ev.target;
	var val = '', data = "", chp = new Array(), values = new Array();
	var form = src.parentNode.getElementsByTagName("form")[0];
	for(input in form){
		if(form[ input ] != null && typeof(form[ input ]) == "object" && input <= form.length) {
			if(form[ input ].getAttribute("type") == "text" || form[ input ].getAttribute("type") =="email" || form[ input ].getAttribute("type") == "password"){
				switch(form[ input ].getAttribute("id")){
					case 'n_name' :
						val = document.getElementById('n_name').value;
						if(val != NOM) {
							chp.push("us_name"); values.push(val);
						}
						break;
					case 'f_name' :
						val = document.getElementById('f_name').value;
						if(val != PRENOM) {
							chp.push("us_firstname"); values.push(val);
						}
						break;
					case 'mail' :							
						val = document.getElementById('mail').value;
						if(val != MAIL) {
							chp.push("us_email"); values.push(val);
						}
						break;
					case 'pwd' :
							val = document.getElementById('pwd').value;
							if(val.length > 3) {
								chp.push("us_passwd"); values.push(val);
							}
						break;
				}
			}	
		}
	}
	if(	chp.length > 0 && values.length > 0	&& chp.length == values.length) {
		data = {action : "modif_user", champs: chp, valu: values};
		redac.post(data, redac.retour_cb); 
	}	
}; 
/**
*This method returns informations about the user 
*/
redac.my_account_cb = function(){
	if (this.readyState == 4) {
		if(this.status == 200) {
 			var r = JSON.parse(this.responseText);
 			NOM = document.getElementById("n_name").value = r.resp.name;
 			PRENOM = document.getElementById("f_name").value = r.resp.fname;
 			MAIL = document.getElementById("mail").value = r.resp.mail;
		}
		redac.next();
	}
}; 

/**
*This method returns in HTML format all news written by the user
*/
redac.my_news_cb = function(){
	if (this.readyState == 4) {
		if(this.status == 200) {	
 			var r = JSON.parse(this.responseText);
			var elt = document.getElementById("my_news_list");
			for (a in r) {
				r[a].date = redac.timeConverter(r[a].date);
				var app = '<div class="panel panel-danger"> \
							    <div class="panel-heading"> \
							      <h4 class="panel-title"> \
							        <a data-toggle="collapse" data-parent="#accordion" href="#collapseE"'+ a +'> \
							         ' + r[a].titre +" - " + r[a].date + ' - Date \
							        </a> \
							      </h4> \
							    </div> \
								<div id="collapseE"'+ a +' class="panel-collapse collapse in "> \
		     						<div class="panel-body"> '+ r[a].contenu +'<br> \
		      						</div> \
		    					</div> \
		    				</div>'	;
				elt.innerHTML += app;
			}
		}
		redac.next();
	}
};

/**
*This method returns in HTML format all unvalid news (for a user only)
*/
redac.get_unval_news_cb = function(){
	if (this.readyState == 4) {
		if(this.status == 200) {
			var r = JSON.parse(this.responseText);
			var elt = document.getElementById("my_news_list");
			for (a in r) {
				r[a].date = redac.timeConverter(r[a].date);
				var app = ' <div class="panel panel-warning">\
					    <div class="panel-heading">\
					      <h4 class="panel-title">\
					        <a data-toggle="collapse" data-parent="#accordion" href="#collapseU"'+ a +'>\
					          ' + r[a].titre + ' - ' + r[a].date + '</a> \
					        </h4>\
					    </div>\
						<div id="collapseU"'+ a +' class="panel-collapse collapse in">\
     						<div class="panel-body">' + r[a].contenu + '\
							<br><button class="news del btn btn-default" attr="' + r[a].auteur +' '+ r[a].titre+ '" >Supprimer</button><br>\
      						</div>\
    					</div>';
				elt.innerHTML += app;
			}
		}
		redac.next();	
	}	
}; 

/**
*This method returns in the HTML format, messages due to a delete news action
*/
redac.retour_cb = function(){
	if (this.readyState == 4 ){
		if(this.status == 200 || this.status == 201 ) {
			document.getElementById("message").innerHTML = '<div class="alert alert-success"><strong>Success, Modification réussie</strong></div>';
	 	}else{
			document.getElementById("message").innerHTML = '<div class="alert alert-danger"><strong>Error, Modification échouée</strong></div>';
		}
		setTimeout(function(){ document.getElementById("message").innerHTML = '';}, 3000);
	}
};
redac.post = function (data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.onreadystatechange = callback;
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
};

HTMLElement.prototype.has_class = function (c) {
	return (this.className.indexOf(c) >= 0);
};

window.onload = function () {
	setTimeout(redac.run, 1);
};
