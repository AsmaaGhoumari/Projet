var user = {} ; 

/**
*This method launches the process
*/
user.run=function(){
	user.forum(); 
}; 

/**
*The method defines the action (here "forum") and calls the post method
*/
user.forum=function(){
	 var data = {action = "forum"}; 
	 user.post(data, user.forum());
}; 

/**
*This method defines the action (here "my_account") and calls the post method
*/
user.my_account=function(){
	var data = {action = "my_account"}; 
	user.post(data, user.get_my_account());
}; 

/**
*This method sends in the HTML format the informations to display
*/
user.get_my_account=function(){
	if (this.readyState == 4 && this.status == 200) {
			var r = JSON.parse(this.responseText);
			var elt = document.getElementsByClassName("row")[2];
			for (a in r) {
				var app = '<div class="panel panel-default panel_box "> \
				  			<div class="panel-heading "> \
				   				 <h3 class="panel-title ">' + r[a].nom + r[a].prenom +'</h3> \
				   				  <h3 class="panel-content ">' + r[a].email +'</h3> \
				   				  <h3 class="panel-title ">' + r[a].mdp +'</h3> \
				   				  <h3 class="panel">' +r[a].statut+'</h3> \
				 		    </div> \
				  			<button type="button" class="btn btn-warning" attr="' + r[a].mail + '">Modifier</button>\
				  			<button type="button" class="btn btn-default"' + r[a].mail + '"">Supprimer</button>\
							</div>';
				elt.innerHTML += app;
			}
	}

};

user.post = function (data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.onreadystatechange = callback;
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
};

/*
window.onload = function () {
	setTimeout(news.start, 1);
};*/
