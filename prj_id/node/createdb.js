//création d'une bdd, ne fait pas parti du serveur, donc pas possible de la relancerd donc pour la sécurité on fait un fichier à part

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("test.db");
var util = require("util");
var init_db = {};

init_db.run = function () {
	init_db.create();
	init_db.insert_super_admin();
};

init_db.create = function () {
	db.run("CREATE TABLE users (us_valid varchar(10),us_date char(19),us_role int, us_cookie char(22), us_email varchar(255) NOT NULL PRIMARY KEY, us_passwd varchar(50), us_name varchar(100), us_firstname varchar(100)");
	db.run("CREATE TABLE news (ne_author char(100), ne_date char(19), ne_statut int , ne_title char (50), ne_path char(100)"); 
	db.close();
};

//insertion du super admin dans la table 
init_db.insert_super_admin = function(){
	//db.run("INSERT INTO users VALUES (\" \", 3, \" \", \"admin@admin.com\", \"admin\", \" \", \" \")");
	db.run("INSERT INTO users (\"us_email\", \"us_passwd\") VALUES (\"admin@admin.com\", \"admin\")");
	db.close();
};

init_db.read = function () {
    var stmt = "SELECT * FROM users";
    db.each(stmt, function (e, r) {
        console.log(util.inspect(r));
    });
    db.close();
};

init_db.run();
