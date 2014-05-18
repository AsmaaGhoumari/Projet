
var news = {};
/**
*This method starts the process calling the function get_news
*/
news.start = function () {
	news.get_news();
};

/**
*This method calls get_news_cb and defines the data variable action 
*/
news.get_news = function ()  {
	var data = {action: "last_news"};
	news.post(data, news.get_news_cb);
};


news.timeConverter = function(UNIX_timestamp){
 var a = new Date(UNIX_timestamp*1000);
 var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
     var year = a.getFullYear();
     var month = months[a.getMonth()];
     var date = a.getDate();
     var hour = a.getHours();
     var min = a.getMinutes();
     var sec = a.getSeconds();
     var time = date+','+month+' '+year+' '+hour+':'+min+':'+sec ;
     return time;
 }

/**
*This method sends in HTML format the info about news 
*/
news.get_news_cb = function ()  {
	if (this.readyState == 4 && this.status == 200) {
		var r = JSON.parse(this.responseText);
		var elt = document.getElementsByClassName("row")[0];
		var app = " ";
		for (a in r) {
			var d = news.timeConverter(r[a].date);
			app += '<div class="panel panel-default panel_box "> \
			  			<div class="panel-heading "> \
			   				 <h3 class="panel-title ">' + r[a].titre + '</h3> \
			 		    </div> \
			  			<div class="panel-body panel_body">' + r[a].contenu + '</div> \
			  			<div class="panel-footer">' + r[a].auteur + " - " + d + '</div> \
					</div>';
		}
		elt.innerHTML += app;
	}
};

news.post = function (data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.onreadystatechange = callback;
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
};


window.onload = function () {
	setTimeout(news.start, 1);
};