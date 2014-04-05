var sqlite3=require("sqlite3").verbose();
var db = new sqlite3.Database("test.db");
var fs=require("fs");

/**
* The status of the news are 
* 0 : en attente
* 1 : validée 
*/

/**
*This method is used to add a new news at the database =) 
*@param n (Object news) this object is discribed in gestionNews
* n = { author = "jean@gmail.com", title = "collecte vetements ", date = 5489625, statut = 1, content=" Bonjour , nous organisons .... merci à vous !!"}
*/
exports.add_news=function (n){
	var stmt= db.prepare("INSERT INTO news (ne_author, ne_title, ne_date, ne_statut, ne_path)VALUES (\'"+n.auth+"\',\'"+n.title+"\',\'"+new Date()+"\', 0 ,\'"+ ?? +"\')");
	stmt.run();
	n.statut=0;//la news est enregistrée mais pas publiée
	//util.log(" add news works !!!! ");
	//email.sendMail("asmaa.ghoumari@gmail.com" , "asmaa.ghoumari@gmail.com","add_user", "nouveau membre  : "+user.n_name +" "+ user.f_name+  " "+user.email + " "+user.passwd+ " "+user.role+"", cb);//envoie email  
	stmt.finalize();
	db.close();

	//ajouter le contenu au dd du serveur 
};

/**
*This method is used to delete a news in the database
*@param user (object) the user object
*/
exports.delete_news = function (n){
	var stmt = "DELETE * FROM news WHERE ne_path=" + n.path;	
	db.run(stmt);
	//console.log("delete news rocks !! "); 
	stmt.finalize(); 
	db.close();
	};

exports.valid_news=function(n){
	var stmt = db.prepare("UPDATE news SET n.statut=1"); //news validée
	stmt.run();
	stmt.finalize();
	//util.log("news validee");
	db.close();
};

/**
*This method is used to collect all the attributs of an article in order to display it 
*
*/
exports.get_last_news=function(){
//recup les 5dernieres news publiees dans la db 
var stmt = db.prepare("SELECT us_name, us_firstname, ne_title, ne_date, ne_statut, ne_path FROM news join users on ne_author = us_email WHERE ne_valid=1 LIMIT 5 "); //news validée
stmt.run();
var i = 0;
       var article = new Array();
       stmt.each(function(err, row) { 
                    article[i].auteur = row.us_name + " " + row.us_firstname;
                    article[i].titre = row.ne_title;
                    article[i].contenu = gestionNews.get_contents(row.ne_path);
                    article[i].date = row.ne_date;
                    i++;
    });
	stmt.finalize();
	stmt.finalize();
	db.close();
	return article;
};

exports.get_news=function(path){
	var stmt = db.prepare("SELECT us_name, us_firstname, ne_title, ne_date, ne_statut FROM news join users on ne_author = us_email WHERE ne_path ='"+path+"'"); //news validée
	stmt.run();
    stmt.each(function(err, row) { 
        article.auteur = row.us_name + " " + row.us_firstname;
        article.titre = row.ne_title;
        article.contenu = gestionNews.get_contents(row.ne_path);
        article.date = row.ne_date;
    });
	stmt.finalize();
	stmt.finalize();
	db.close();
	return article;
};
