var news = {}; 
var init = new Array("get_unval_news","my_account","get_users","get_unval_users", "get_news"); 
var i = 0;
var news_list = new Array, users_list = new Array;
var NOM= " ", PRENOM= " ", MAIL= " ", SADMIN = "", TMP_N ="", TMP_P ="", TMP_M="", TMP_R = "";

news.run=function(){
	news.next();
	document.addEventListener("click", news.onclick); 
	document.getElementById("delete_account").addEventListener("click", news.delete_account); 
	document.getElementById("recup_mail").addEventListener("click", news.recup_mail); 
	document.getElementById("send_m").addEventListener("click", news.send_m); 
	document.getElementById("send_a").addEventListener("click", news.send_a); 
	document.getElementById("send_news").addEventListener("click", news.send_news); 
	document.getElementById("valid_modif").addEventListener("click", news.valid_modif); 
	document.getElementById("valid_modif_news").addEventListener("click", news.valid_modif_news); 

	// document.getElementById("searchUser").onKeyup = news.searchUser; 
	 document.getElementById("searchNews").onkeydown = news.searchNews ; //J'arrive pas a recup ca, sinon ca devrait foncttioner
}; 

news.next = function(){
	if(i < init.length)	{
		news[ init[i] ]();
		i++;
	} 
};

/**
*This funciton is used to find an user recorded into the database
*It takes a full text 
*/
news.searchUser = function(ev){
	console.log(ev);
	var search = document.getElementById("searchUser").value;
	if(search.length > 2){
        var regex = new RegExp(search, "i");
        var elt = document.getElementsByClassName("tab-pane")[4];
        var output = "";
        for(user in users_list) {
	        if(users_list[user].nom.search(regex) != -1 || users_list[user].prenom.search(regex) != -1 || users_list[user].mail.search(regex) != -1){
    			output += '<div class="panel panel-default panel_box "> \
				  			<div class="panel-heading "> \
				   				 <h3 class="panel-title ">' + users_list[user].nom + users_list[user].prenom +'</h3> \
				 		    </div> \
				  			<button type="button" class="modif users btn btn-default" attr="' + users_list[user].mail +'">Modifier</button> \
				  			<button type="button" class="vdl users btn btn-default"' + users_list[user].mail + '"">Supprimer</button> \
							</div>';				
	        }
   		}
		elt.innerHTML = output;
	}
};

/**
*This funciton is used to find an article recorded into the database
*It takes a full text 
*/
news.searchNews = function(ev){
	var sch = ev.target.value;
	if(sch.length > 2) {
        var regex = new RegExp(sch, "i");
		var elt = document.getElementById("news_list");
        var output = "";
		for (a in news_list) {
			console.log(news_list);
		   if(news_list[0][a].titre.search(regex) != -1 || news_list[0][a].contenu.search(regex) != -1 || news_list[0][a].auteur.search(regex) != -1 || news_list[0][a].date.search(regex) != -1){
				output += 	'<a href="#" class="list-group-item"> \
					  	<div class="col-md-8"> \
						    <h4 class="list-group-item-heading">' + news_list[0][a].titre + '</h4>\
						    <p class="list-group-item-text">' + news_list[0][a].contenu + '</p>\
						</div> \
						<div class="col-md-4 option_list">\
					 		    <button type="button" class="modif news btn btn-default" attr="' + news_list[0][a].auteur + ' - ' + news_list[0][a].date + '">Modifier</button> \
					  			<button type="button" class="del news btn btn-default" attr="' + news_list[0][a].auteur + ' '+ news_list[0][a].titre+ '">Supprimer</button> \
					  			<br/><small>' + news_list[0][a].auteur + ' - ' + news_list[0][a].date+ '</small>\
 						</div>\
					  </a>';
			}
		}
		elt.innerHTML = output;
	}
};


news.timeConverter = function(UNIX_timestamp){
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
 }


/**
*This method allows to detect events and defines the attributs' data variable 
*/
news.onclick = function (ev) {
	var src = ev.target;
	var data;
	if(src.has_class("news")) {
		attr = src.getAttribute("attr").split(" ");
		if (src.has_class("del")) {
			data = {action: "delete_news", name: attr[0], firstname: attr[1], titre: attr[2] };
			news.post(data, news.retour_cb);
		}else if(src.has_class("valid")){
			data = {action: "unval_news", name: attr[0], firstname: attr[1], titre: attr[2]  };
			news.post(data, news.retour_cb);
		}else if(src.has_class("modif")){
			var ligne = src.parentNode.parentNode.getElementsByTagName("div")[0];
			TMP_N = document.getElementById('titre_news').value = ligne.childNodes[1].innerHTML;
			TMP_P = document.getElementById('msg_news').value = ligne.childNodes[3].innerHTML;
			TMP_M = attr[0];
			TMP_R = attr[1];
			$("#modif_news").modal("show");	
 			//data = {action: "unval_modif", name: attr[0], firstname: attr[1], titre: attr[2]  };
			//news.post(data, news.retour_cb);
		}
	} 
	else if(src.has_class("users")) {
		var ligne = src.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("td");
		if (src.has_class("del")) {
			if (window.confirm("Etes-vous sur ?")) {
				data = {action: "delete_other_user", mail: ligne[2].innerHTML};
				news.post(data, news.retour_cb);
			}
		} else if (src.has_class("vdl")) {
			if (window.confirm("Etes-vous sur ?")) {
				data = {action: "delete_valid_user", mail: ligne[2].innerHTML};
				news.post(data, news.retour_cb);
			}
		}else if(src.has_class("valid")){
			data = {action: "valid_user", mail: ligne[2].innerHTML};
			news.post(data, news.retour_cb);
		}else if(src.has_class("modif")){
		 	TMP_N = document.getElementById('nom_user').value = ligne[0].innerHTML;
			TMP_P = document.getElementById('prenom_user').value = ligne[1].innerHTML;
			TMP_M = document.getElementById('mail_user').value = ligne[2].innerHTML;
			TMP_R = document.getElementById('select').value = ligne[3].getAttribute("attr");
			$("#modif_user").modal("show");		
		}
	}
	else if(src.has_class("reset")){
		news.reset_form(src);
	}
};

/**
*This function returns all articles with a statut equal to 0 that is to say unvalid by the admin yet
*/
news.get_unval_news=function(){	
	var data = {action: "get_unval_news"};
	news.post(data, news.get_unval_news_cb);
}; 

/**
*This method  gets all news recorder into the server memory  
*data : name of the action 
*/
news.get_news=function(){
	var data = {action: "get_news"};
	news.post(data, news.get_news_cb);
}; 

/*
news.get_my_news=function(){
	var data = {action: "my_news"};
	news.post(data, news.my_news_cb);
}; 
 */

/**
*This method  return all users with an unvalid status 
*data : name of the action 
*/
news.get_unval_users=function(){
	var data = {action : "get_unval_users"}; 
	news.post(data, news.get_unval_users_cb);
}; 

/**
*This method returns  all users recorded
*data : name of the action 
*/
news.get_users=function(){
	var data = {action : "get_users"}; 
	news.post(data, news.get_users_cb);
}; 

/**
*This method defines the data variable and calls "my_account_cb"
*data : name of the action 
*cb : callback
*/
news.my_account=function(){	
	var data = {action : "my_account"}; 
	news.post(data, news.my_account_cb);
}; 

news.delete_account = function(){
	if (window.confirm("Etes vous sur ?")) {
		var data = {action : "delete_user"}; 
		news.post(data, news.retour_cb); //retour un peu generique
	}
};

news.recup_mail=function(){	
	var data = {action : "recup_all_mail"}; 
	news.post(data, news.recup_mail_cb); 
};

news.send_m=function(ev){	
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
		news.post(data, news.retour_cb); 
	}	
}; 

news.send_a=function(){	
	var val = document.getElementById("supa_mail").value;
		var data = { action : "modif_supAd", mail: val, mdp: document.getElementById("supa_pwd").value }; 
		news.post(data, news.retour_cb); 
}; 

news.send_news=function(){	
	var data = { action : "add_news", message: document.getElementById("message_news").value, title: document.getElementById("title_news").value }; 
	news.post(data, news.retour_cb); 
}; 

news.valid_modif_news = function(ev){
	var src = ev.target;
	var val = '', data = "", chp = new Array(), valu = {};
	var form = src.parentNode.parentNode.getElementsByTagName("form")[0];
	for(input in form){
		if(form[ input ] != null && typeof(form[ input ]) == "object" && input <= form.length) { 				
			if(form[ input ].getAttribute("type") == "text" || form[ input ].getAttribute("type") =="email" || form[ input ].getAttribute("type") == "number"){
				switch(form[ input ].getAttribute("id")){
				case 'titre_news' :
						val = document.getElementById('titre_news').value;
						if(val != TMP_N) {
							chp.push("titre");  valu.titre = val;
						}
						break;
					case 'msg_news' :
						val = document.getElementById('msg_news').value;
						if(val != TMP_P) {
							chp.push("msg"); valu.msg = val; 
						}
						break;
				}	
			}	
		}
	}
	if(	chp.length > 0 ) {
		data = {action : "unval_modif",name:TMP_M, firstname:TMP_R, chps: chp, values: JSON.stringify(valu), titre: TMP_N};
		console.log(data);
		news.post(data, news.retour_cb);
		$("#modif_news").modal("hide");
 
	}
};

news.valid_modif = function(ev){
	var src = ev.target;
	var val = '', data = "", chp = new Array(), values = new Array();
	var form = src.parentNode.parentNode.getElementsByTagName("form")[0];
	console.log(form);
	for(input in form){
		if(form[ input ] != null && typeof(form[ input ]) == "object" && input <= form.length && input != 3) { 				
			if(form[ input ].getAttribute("type") == "text" || form[ input ].getAttribute("type") =="email" || form[ input ].getAttribute("type") == "number"){
				switch(form[ input ].getAttribute("id")){
					case 'nom_user' :
						val = document.getElementById('nom_user').value;
						if(val != TMP_N) {
							chp.push("us_name"); values.push(val);
						}
						break;
					case 'prenom_user' :
						val = document.getElementById('prenom_user').value;
						if(val != TMP_P) {
							chp.push("us_firstname"); values.push(val);
						}
						break;
				}	

			}	
		} else if(input == 3) {
					selectElmt = document.getElementById('select');
					val = selectElmt.options[selectElmt.selectedIndex].value;
					console.log(val);
					if(val != TMP_R) {
						chp.push("us_role"); values.push(val);
					}
				}
	}
	if(	chp.length > 0 && values.length > 0	&& chp.length == values.length) {
		data = {action : "modif_other", champs: chp, valu: values, mail: TMP_M};
		news.post(data, news.retour_cb);
		$("#modif_user").modal("hide");
 
	}
};

/**
*This method returns unvalid news and puts it into the HTML file in ordre to display it 
*/
news.get_unval_news_cb = function(){
	if (this.readyState == 4) {
		if(this.status == 200) {
			var r = JSON.parse(this.responseText);
			var elt = document.getElementById("new_news_list");
			var app ="";
			for (a in r) {
				r[a].date = news.timeConverter(r[a].date);
				app += '<a href="#" class="list-group-item"> \
					  	<div class="col-md-8"> \
						    <h4 class="list-group-item-heading">' + r[a].titre + '</h4>\
						    <p class="list-group-item-text">' + r[a].contenu + '</p>\
						</div> \
						<div class="col-md-4 option_list">\
 								<button type="button" class="valid news btn btn-default" attr="' + r[a].auteur + ' '+r[a].titre + '">Valider</button> \
					 		    <button type="button" class="modif news btn btn-default" attr="' + r[a].auteur + ' '+r[a].titre + '">Modifier</button> \
					  			<button type="button" class="del news btn btn-default" attr="' + r[a].auteur + ' '+ r[a].titre+ '">Supprimer</button> \
					  			<br/><small>' + r[a].auteur + ' - ' + r[a].date + '</small>\
 						</div>\
					  </a>';
			}
			elt.innerHTML = app;
		}
		news.next(); 
	}
}; 

/**
*This methods returns in the HTML format the 5 last news recorded
*/
news.get_news_cb = function ()  {
	if (this.readyState == 4) {
		if(this.status == 200) {
			var r = JSON.parse(this.responseText);
			var elt = document.getElementById("news_list");
			var app ="";
			for (a in r) {
				r[a].date = news.timeConverter(r[a].date);
				app += 	'<a href="#" class="list-group-item"> \
					  	<div class="col-md-8"> \
						    <h4 class="list-group-item-heading">' + r[a].titre + '</h4>\
						    <p class="list-group-item-text">' + r[a].contenu + '</p>\
						</div> \
						<div class="col-md-4 option_list">\
					 		    <button type="button" class="modif news btn btn-default" attr="' + r[a].auteur + ' '+r[a].titre + '">Modifier</button> \
					  			<button type="button" class="del news btn btn-default" attr="' + r[a].auteur + ' '+ r[a].titre+ '">Supprimer</button> \
					  			<br/><small>' + r[a].auteur + ' - ' + r[a].date + '</small>\
 						</div>\
					  </a>';
			}
			elt.innerHTML = app;
			news_list.push(r);
		}
		news.next();
	}
};
 

/**
*This method returns in the HTML format all users with an unvalid account
*/
news.get_unval_users_cb=function(){
	if (this.readyState == 4) {
		if(this.status == 200) {
			var r = JSON.parse(this.responseText);
			var elt = document.getElementById("table_new_users");
			var app ="", role="";
			for (a in r) {
				for(index in r[a]){ 
					switch(r[a][index].role) {
						case 0 : 
						role = "Autre"; break; 
						case 1 : 
						role = "Rédacteur"; break; 
						case 2 : 
						role = "Administrateur"; break ; 
						default : 
						role ="erreur"; break; 
					}
					app += '<tr><td>'+ r[a][index].name+'</td>\
		            <td>'+ r[a][index].firstname+'</td> \
		            <td>'+ r[a][index].mail +'</td> \
		            <td attr="'+ r[a][index].role +'">'+ role +'</td><td> \
		            	<div class="row">\
		            		<div class="col-sm-12"><button class="btn btn-default users valid" id="send">Valider</button> \
		            		 	<button class="btn btn-default modif users" >Modifier</button>\
		            		 	<button class="btn btn-default users del" >Supprimer</button>\
		            		 </div>\
		            	</div>\
		            </td></tr>';
				}
			}
			elt.innerHTML = app;
		}
		news.next();
	}
}; 

/**
*This method returns in the HTML format all users recorded
*/
news.get_users_cb = function(){
	if (this.readyState == 4) {
		if(this.status == 200) {
			var r = JSON.parse(this.responseText);
			var elt = document.getElementById("table_all_user");
			var app ="", role;
			for (a in r) {
				for(index in r[a]){ 
					switch(r[a][index].role) {
						case 0 : 
						role = "Autre"; break; 
						case 1 : 
						role = "Rédacteur"; break; 
						case 2 : 
						role = "Administrateur"; break ; 
						default : 
						role ="erreur"; break; 
					}					
					if(r[a][index].role < 3 && r[a][index].mail != MAIL ){
						app += '<tr><td>' + r[a][index].name +'</td>\
			            <td>'+ r[a][index].firstname +'</td>\
			            <td>' + r[a][index].mail + '</td><td attr="'+ r[a][index].role +'">'+ role +'</td> \
			            <td> \
			            	<div class="row">\
			            		 <div class="col-sm-4 col-sm-offset-1">\
			            		 	<button class="btn btn-default modif users" >Modifier</button>\
			            		 </div>\
			            		 <div class="col-sm-3">\
			            		 	<button class="btn btn-default users vdl" >Supprimer</button>\
			            		 </div>\
			            	</div>\
			            </td></tr>';
			        }else {
			        	if(r[a][index].role == 3) {
			        		SADMIN = document.getElementById("supa_mail").value = r[a][index].mail;
			        		var lol = r[a].splice(index,1);
			        	}
			        }
				}
			}
			elt.innerHTML = app;
			users_list.push(r);
		}
		news.next();
	}
};

/**
*This method returns in the HTML format all informations about the owner of the account
*/

news.my_account_cb = function(){
	if (this.readyState == 4) {
		if(this.status == 200) {
 			var r = JSON.parse(this.responseText);
 			NOM = document.getElementById("n_name").value = r.resp.name;
 			PRENOM = document.getElementById("f_name").value = r.resp.fname;
 			MAIL = document.getElementById("mail").value = r.resp.mail;
		}
		news.next();
	}
}; 



/**
*This method returns in the HTML format, messages due to a delete news action
*/
news.retour_cb = function(){
	if (this.readyState == 4 ){
		if(this.status == 200 || this.status == 201 ) {
			document.getElementById("message").innerHTML = '<div class="alert alert-success"><strong>Success, Modification réussie</strong></div>';
	 	}else{
			document.getElementById("message").innerHTML = '<div class="alert alert-danger"><strong>Error, Modification échouée</strong></div>';
		}
		setTimeout(function(){ document.getElementById("message").innerHTML = '';}, 3000);
	}
};

/**
*This method cleans a form
*/
news.reset_form = function(src){
	var form = src.parentNode.getElementsByTagName("form")[0];
	for(input in form){
		if(form[ input ] != null && typeof(form[ input ]) == "object" && input <= form.length) {
			if(form[ input ].getAttribute("type") == "text" || form[ input ].getAttribute("type") =="email" || form[ input ].getAttribute("type") == "password"){
				form[ input ].value = ""; 
			}	
		}
	}
}

news.recup_mail_cb = function(){
	if (this.readyState == 4 ){
		if(this.status == 200) {
			var r = JSON.parse(this.responseText);
			window.prompt("Liste des mails :",r.resp);
	 	}else{
	 		alert("Error");
		}
	}
}


news.post = function (data, callback) {
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
	setTimeout(news.run, 1);
};