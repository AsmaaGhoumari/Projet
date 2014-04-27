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
};

/**
*This method is used to delete a news in the database
*@param user (object) the user object
*/
exports.delete_news = function (n){
	db.run("DELETE * FROM news WHERE ne_path=?", n.path);	// A revoir 
};

/**
*This method is used to change the status of a news. It becomes activ and so it can be published
*@param n (news Object)
*/
exports.valid_news=function(n){
	if (n.statut==1){
	var stmt = db.prepare("UPDATE news SET ne_statut=1"); 
	stmt.run();
	util.log("news validee");
	}
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
	return article;
};

/**
*This method is used to get the unvalided news in order to present them to the admin so that he can 
*
*/
exports.get_unval_news=function(path){
	var a ={}; 
	var stmt = db.prepare("SELECT us_name, us_firstname, ne_title, ne_date, ne_statut FROM news join users on ne_author = us_email WHERE ne_path ='"+path+"' and ne_statut=0"); //news validée
	stmt.run();
    db.each(stmt, function(err, row) { 
        a.auteur = row.us_name + " " + row.us_firstname;
        a.titre = row.ne_title;
        a.contenu = gestionNews.get_contents(row.ne_path);
        a.date = row.ne_date;
    });
	return article; //pas possible 
};
//fonction qui update le titre si modif à faire avant publication 
exports.update_title=function(path, title){
	var stmt = db.prepare("UPDATE news SET  ne_title = \'"+title+"\' AND ne_date =\'"+new Date()+"\' WHERE ne_path = \'"+ path +"\'");
	stmt.run();
}; 

//fonction qui update la date pour le nouveau contenu de la  news 
exports.update_date=function(path){
	var stmt = db.prepare("UPDATE news SET  ne_date = \'"+new Date()+"\' WHERE ne_path = \'"+ path +"\'");
	stmt.run();
};