var sqlite3=require("sqlite3").verbose();
var db = new sqlite3.Database("test.db");
var fs=require("fs");
var util = require("util");
var email = require("./email.js");

/**
* The status of the news are 
* 0 : en attente (waiting)
* 1 : validée (activ)
*/

/**
*This method is used to add a new news at the database =) 
*@param n (Object news) this object is discribed in gestionNews
* n = { author = "jean@gmail.com", title = "collecte vetements ", date = 5489625, statut = 1, "}
*/
exports.add_news=function (n, path, obj, cb){
	var stmt= db.prepare("INSERT INTO news (ne_author, ne_title, ne_date, ne_statut, ne_path) VALUES (\'"+n.email+"\',\'"+n.title+"\',\'"+new Date().getTime()+"\', 0 ,\'"+path+"\')");
	stmt.run(function(err, row) { 
        if (err) { obj[cb](500); console.log(err) }
        else obj[cb](201);
    });
	email.sendMail("asmaa.ghoumari@gmail.com","Nouvel Article proposé", "Vous pouvez aller consulté votre site : l'article "+n.title, cb);
};
/**
*It stores the path of the content&images in the hard disk into the database
* path 
* e : email of the author 
*/
exports.set_path=function(path, e){
	var stmt= db.prepare("INSERT INTO news (ne_path) VALUES (\'"+path+"\') WHERE ne_author = ?", e);
	stmt.run();
};

/**
*This method get the path of an article 
* author (name of the writer)
*title of the news
* obj 
*cb : callback method 
*/
exports.get_path = function(author, title, autre, obj, cb){
	var p; 
	var stmt = "SELECT ne_path FROM news WHERE ne_author = \'"+author+"\' AND ne_title= \'"+title+"\'";
	db.each(stmt, function(err, row) {  
        p = row.ne_path;
    },
    function(){ obj[cb](p, autre);  });
}; 

/**
*This method is used to delete a news in the database
*@param user (object) the user object
*/
exports.delete_news = function (path, obj, cb){
	db.run("DELETE FROM news WHERE ne_path=?", path, function(err, row) { 
        if (err) { obj[cb](500); console.log(err); }
        else obj[cb](200);
    });	// A revoir 
};

/**
*This method is used to change the status of a news. It becomes activ and so it can be published
*@param n (news Object)
*/
exports.valid_news=function(title, auteur, obj, cb){
	var stmt = db.prepare("UPDATE news SET ne_statut=1 WHERE ne_title= \'"+ title +"\' AND ne_author = \'"+auteur+"\'"); 
	stmt.run(function(err, row) { 
        if (err){ obj[cb](500); console.log(err); }
        else {
            obj[cb](200);
            util.log("news validee");
        }
    });
};



exports.get_my_news = function(e, o, cb){
    var my = new Array();
    var a = "SELECT * FROM news WHERE ne_author = \'"+e+"\' AND ne_statut=1"; 
    db.each(a, function(err, row) { 
        if (err) obj[cb](500);
        my.push(row);
    }, function(){
        o[cb](200,my);
    });
};

/**
*This method is used to collect all the attributs of the last 5 articles published in order to display it 
*/
exports.get_last_news=function(obj, cb){
    var stmt = "SELECT * FROM news join users on ne_author = us_email WHERE ne_statut=1 LIMIT 5";
    var article = new Array();
   	db.each(stmt, function(err, row) {
        if (err)
            obj[cb](500);
        else {
       		var bob = {};
            bob.auteur =  row.us_name + " " +row.us_firstname;
            bob.titre = row.ne_title;
            bob.contenu = row.ne_path;
            bob.date = row.ne_date;
            article.push(bob);
        }
	}, function (){
    	obj[cb](200,article);
    });
};

/**
*This method returns all news (title, author, content, everything) 
*@param path (String) indicates the place of storage
*/
exports.get_news=function(obj, cb){
    var stmt = "SELECT * FROM news join users on ne_author = us_email WHERE ne_statut=1";
    var article = new Array();
    db.each(stmt,function(err, row) {
        if (err)
            obj[cb](500);
        else {
      		var art = {} ;
            art.auteur = row.us_name + " " + row.us_firstname;
            art.titre = row.ne_title;
            art.contenu = row.ne_path;
            art.date = row.ne_date;
            article.push(art);
        }
    },function (){
    	obj[cb](200,article);
    });

};

/**
*This method is used to get the unvalided news in order to present them to the admin so that he can 
*obj 
*cb : callback method 
*/
exports.get_unval_news=function(obj, cb){
    var article = new Array();
	var stmt = "SELECT * FROM news join users on ne_author = us_email WHERE ne_statut=0";
    db.each(stmt, function(err, row) { 
        if (err)
            obj[cb](500);
        else {
            var art = {} ;
            art.auteur = row.us_name + " " + row.us_firstname;
            art.titre = row.ne_title;
            art.contenu = row.ne_path;
            art.date = row.ne_date;
            article.push(art);
        }
    },function (){
    	obj[cb](200,article);
    });
};

/**
*This method is used to get the unvalided news in order to present them to the redac so that he can 
*obj 
*cb : callback method 
*/
exports.get_unval_my_news=function(mail, obj, cb){
    var article = new Array();
    var stmt = "SELECT * FROM news join users on ne_author = us_email WHERE ne_statut=0 AND ne_author = \'"+mail+"\'";
    db.each(stmt, function(err, row) { 
        if (err)
            obj[cb](500);
        else {
            var art = {} ;
            art.auteur = row.us_name + " " + row.us_firstname;
            art.titre = row.ne_title;
            art.contenu = row.ne_path;
            art.date = row.ne_date;
            article.push(art);
        }
    },function (){
        obj[cb](200,article);
    });
};

/**
*This method updates the title of an article 
*path of the content
*title : new title 
*/
exports.update_title=function(path, title){
	var stmt = db.prepare("UPDATE news SET ne_title = \'"+title+"\', ne_date =\'"+new Date().getTime()+"\' WHERE ne_path = \'"+ path +"\'");
	stmt.run(function(err, row) { 

    });
}; 

/**
*This method updates the date 
*
*/
//fonction qui update la date pour le nouveau contenu de la  news 
exports.update_date=function(path){
	var stmt = db.prepare("UPDATE news SET  ne_date = \'"+new Date().getTime()+"\' WHERE ne_path = \'"+ path +"\'");
	stmt.run(function(err, row) { 
        if (err) obj[cb](500);
        else obj[cb](200);
    });
};