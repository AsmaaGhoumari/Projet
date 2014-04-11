var sqlite3=require("sqlite3").verbose();
var db = new sqlite3.Database("test.db");
var fs=require("fs");

/**
* The status of the news are 
* 0 : en attente (waiting)
* 1 : validée (activ)
*/

/**
*This method is used to add a new news at the database =) 
*@param n (Object news) this object is discribed in gestionNews
* n = { author = "jean@gmail.com", title = "collecte vetements ", date = 5489625, statut = 1, content=" Bonjour , nous organisons .... merci à vous !!"}
*/
exports.add_news=function (n){
	var stmt= db.prepare("INSERT INTO news (ne_author, ne_title, ne_date, ne_statut, ne_path)VALUES (\'"+n.auth+"\',\'"+n.title+"\',\'"+new Date()+"\', 0 ,\'"+ "???" +"\')");
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

/**
*This method is used to change the status of a news. It becomes activ and so it can be published
*@param n (news Object)
*/
exports.valid_news=function(n){
	if (n.statut==1){
	var stmt = db.prepare("UPDATE news SET ne_statut=1"); 
	stmt.run();
	stmt.finalize();
	//util.log("news validee");
	db.close();
	}
	else {} //il faut renvoyer la news }
};

/**
*This method is used to collect all the attributs of the last 5 articles published in order to display it 
*/
exports.get_last_news=function(){
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
	db.close();
	return article;
};

/**
*This method returns one news (title, author, content, everything) 
*@param path (String) indicates the place of storage
*/
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
	db.close();
	return article;
};

/**
*This method is used to get the unvalided news in order to present them to the admin so that he can 
*
*/
exports.get_unval_news=function(path){
	var stmt = db.prepare("SELECT us_name, us_firstname, ne_title, ne_date, ne_statut FROM news join users on ne_author = us_email WHERE ne_path ='"+path+"' and ne_statut=0"); //news validée
	stmt.run();
    stmt.each(function(err, row) { 
        article.auteur = row.us_name + " " + row.us_firstname;
        article.titre = row.ne_title;
        article.contenu = gestionNews.get_contents(row.ne_path);
        article.date = row.ne_date;
    });
	stmt.finalize();
	db.close();
	return article; 
};
