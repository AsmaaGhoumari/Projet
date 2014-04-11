var sqlite3=require("sqlite3").verbose(); //files needed 
var db_n = require("./db_news.js");

var n={};//news object empty
var def = "NC" //path par defaut
//initalisation objet news
var n= function (a,t,d,s,p,c){
	this.auth = (a) ? a : "NC";
	this.title = (t) ? t : "NC";
	this.date = (d) ? d : 0 ;
	this.statut= (s) ? s : "0";
	this.path = (p) ? p : def;
	this.content = (c) ? c : "NC";
};

/**
*This method is used to the the content of un article 
*
*/
exports.get_content = function(path){
       fs.readFile(path, function (err, data) {
                 return data;
       });
};

/**
*This method is used to deal with the requests' user about news 
*@param req (request Object) is the request the user send to the serveur 
*@param res (response Object) is the response of the request 
*@param path (String) it indicates the place where the content of the news is stored (ex : )
*/
exports.gestion_news = function(req,res, path){
	var role;
	var n; 
	if(req.method=='POST'){ 
		var glob=''; 
		req.on('data', function(data) {
             glob+= data;//get the data sent 
		});
		req.on('end',function() {
            var tmp = glob.split('&');
            action = tmp[0].split("=");
            email = tmp[2].split("=");            
            role = get_role(email);
            n=db_news.get_news(path);
            
            switch(action[1]){
            	case 'add_news' : 
            		if (role==0){util.log("erreur : add_news "); }
            		else if (role==1 ||role==2||role==3){db_news.add_news(n);}
            		else util.log("erreur : add_news ");
            		break;
            	case 'delete_news' : 
            		if (role==0||role==1){util.log("erreur : delete_news ");}
            		else if (role==2||role==3){db_news.delete_news(n); }
            		else util.log("erreur : delete_news ");
            		break;
            	case 'valid_news' : 
            		if (role==0||role==1){util.log("erreur : valid_news ");}
            		else if (role==2||role==3){db_news.valid_news(n); }
            		else util.log("erreur : valid_news "); 
            		break;
            	}
		res.writeHead(200, {'Content-Type' : 'text/plain'});
		res.end();     
    	});
   	}		
};
