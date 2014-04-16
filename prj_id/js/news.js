
var news = {};

news.start = function () {
	news.get_news();
};

news.get_news = function ()  {
	var data = {action: "ask_news"};
	news.post(data, news.get_news_cb);
};

news.get_news_cb = function ()  {
	if (this.readyState == 4 && this.status == 200) {
		var r = JSON.parse(this.responseText);
		var elt = document.getElementsByClassName("panel")[0];
		for (a in r) {
			//console.log(r[a].author);
			var d = new Date(r[a].date);
			var app = "<tr><td>" + r[a].author + "</td><td>" + r[a].title + "</td><td>" + d + "</td><td>" + r[a].content + "</td></tr>";
			elt.innerHTML += app;
		}
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