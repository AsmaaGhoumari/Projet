//création d'une bdd, ne fait pas partie du serveur, donc pas possible de la relancer donc pour la sécurité on fait un fichier à part

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("test.db");
var util = require("util");
var fs = require("fs");
var init_db = {}, test_db = {};
var user = require("./db_users.js"); 
var NOMBRE_FAKE_USER = 10;
var NOMBRE_FAKE_NEWS = 10;
// Liste des commandes en fin de fichier


//liste de membres
var user3 = {fname : "Barak", name : "Obama", mail : "barak@gmail.com", pwd : "toto", role : 1, valid : "true"};
var user2 = {fname : "Chuck", name:  "Norris", mail : "chuck@gmail.com", pwd :"toto", role : 2, valid : "true"};
var user1 = {fname : "Neo", name: "the one", mail : "neo@gmail.com", pwd : "toto", role : 1, valid : "true"};

//Liste d'articles
var news1 = {mail : user1.mail , statu : 0, date : new Date().getTime() , titre : user1.name + " news1" }; 
var news2 = {mail : user2.mail, statu : 0, date : new Date().getTime() , titre : user2.name + " news2"}; 
var news3 = {mail : user3.mail , statu : 1 , date : new Date().getTime() , titre : user3.name + " news3" }; 

init_db.run = function () {
 	console.log("Commandes => create / read_user / read_news / test / clean_all / clean_user / clean_news");
};


init_db.create = function () {
	db.run("CREATE TABLE users (us_valid varchar(10),us_date timestamp,us_role int, us_cookie char(22), us_email varchar(255) NOT NULL PRIMARY KEY, us_passwd varchar(50), us_name varchar(100), us_firstname varchar(100), us_visible varchar(10) DEFAULT 'true')", function(){
		
		init_db.insert_super_admin();
		init_db.insert_first_admin();
		test_db.insert_fake_news(news1); 
		test_db.insert_fake_news(news2);
		test_db.insert_fake_news(news3);
		test_db.generateUser();
		console.log('CREATE TABLE users ok');

	});
	db.run("CREATE TABLE news (ne_author char(100), ne_date char(19), ne_statut int , ne_title char (50), ne_path char(100))", function(){
		console.log('CREATE TABLE news ok');
	});
};

//insertion du super admin dans la table 
init_db.insert_super_admin = function(){
	db.run("INSERT INTO users (\"us_email\", \"us_passwd\",\"us_valid\", \"us_role\") VALUES (\"id@idees.fr\", \"admin\", \"true\", 3)", function(){
		console.log('Super Admin ok');
	});
};

init_db.insert_first_admin = function(){
	db.run("INSERT INTO users (\"us_email\", \"us_passwd\",\"us_valid\", \"us_role\") VALUES (\"admin@idees.fr\", \"admin\", \"true\", 2)");
};

init_db.read_news = function () {
    var stmt = "SELECT * FROM news";
    db.each(stmt, function (e, r) {
        console.log(util.inspect(r));
    });
};

init_db.read_users=function(){
	var stmt = "SELECT * FROM users";
    db.each(stmt, function (e, r) {
        console.log(util.inspect(r));
    });
};
init_db.clean = function(type){
	switch(type){
		case 'all' :
			db.run("DELETE FROM news", function(){
				console.log('DELETE ALL LINE news ok');
			});
			db.run("DELETE FROM users", function(){
				console.log('DELETE ALL LINE users ok');
				init_db.insert_super_admin();
			});				
			break;
		case 'user' :
			db.run("DELETE FROM users", function(){
				console.log('DELETE ALL LINE users ok');
				init_db.insert_super_admin();
			});	
			break;

		case 'news' :
			db.run("DELETE FROM news", function(){
				console.log('DELETE ALL LINE news ok');
			});
			break;
	}
};


//----------------------------- TEST zone

test_db.insert_fake_news = function(news){
	db.run("INSERT INTO news VALUES (\""+news.mail+"\", \""+news.date+"\", "+news.statu+", \""+news.titre+"\", \"../news/fsefeS/article.txt\" )", function(err){
		if(err){ console.log('Error insert news - ' + err); }
		console.log('Fake news insert');
	});
};
test_db.insert_fake_user = function(user){
	db.run("INSERT INTO users (\"us_name\",\"us_firstname\" ,\"us_email\", \"us_passwd\",\"us_valid\", \"us_role\") VALUES (\""+user.name+"\",\""+user.fname+"\",\""+user.mail+"\", \""+user.pwd+"\", \""+user.valid+"\", "+user.role+")", function(err){
		if(err){ console.log('Error insert users - ' + err); }
		console.log('Fake user insert');
	});
};

test_db.generatePassword = function(taille) {
    var length = taille,
        charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

/*
test_db.generateUser = function(x){
	var u = {};
	var mails = new Array();
	for(var i = 0; i < x; i++)
	{
		u.mail = "asmaa.ghoumari+"+test_db.generatePassword(Math.floor((Math.random() * 10) + 1))+"@gmail.com";
		u.pwd = ""+test_db.generatePassword(8);
		u.valid = (Math.round(Math.random()) == 1 ? "true" : "false");
		u.role = Math.round((Math.random() * 2) + 0);
		test_db.insert_fake_user(u);
		mails.push(u.mail);
	}
	test_db.generateNews(NOMBRE_FAKE_NEWS, mails)
};
*/


test_db.generateUser = function(){
	test_db.insert_fake_user(user1);
	test_db.insert_fake_user(user2); 
	test_db.insert_fake_user(user3);
};

test_db.generateNews = function(user){
	var n = {};
	n.mail = user.mail;
	n.date = new Date();
	n.statu = user.statut;
	n.titre = "Titre" +" - " + user.name+" "+user.fname;
	test_db.insert_fake_news(n);
};

test_db.save = function(){
	var str = "", str_n = "";
	db.each("SELECT * FROM users",function(err,row){
		str += row.us_email +" - "+ row.us_passwd+"\n";
	},function(){
		fs.writeFile('../user.txt', str, function (err) {
		  if (err) throw err;
		  console.log('It\'s saved!');
		});
	});

	db.each("SELECT * FROM news",function(err,row){
		str_n += row.ne_author +" - "+ row.ne_title+" - "+ row.ne_statut +" - " +row.ne_path+"\n";
	},function(){
		fs.writeFile('../news.txt', str_n, function (err) {
		  if (err) throw err;
		  console.log('It\'s saved!');
		});
	});



};

process.argv.slice(2).forEach(function (arg) {
        switch(arg){
        	case 'create' :
        		init_db.create();
        		break;
        	case 'read_user' :
        		init_db.read_users();
        		break;
        	case 'read_news' :
        		init_db.read_news();
        		break;
        	case 'test' :
        		//test_db.generateUser(); 
        		test_db.generateNews(user1);  
        		test_db.generateNews(user2); 
        		test_db.generateNews(user3);
        		break;
        	case 'clean_all' :
        		init_db.clean("all");
        		break;
        	case 'clean_user' :
        		init_db.clean("user");
        		break;
        	case 'clean_news' :
        		init_db.clean("news");
        		break;
        	case 'save' :
        		test_db.save();
        		break;
        	default :
        		init_db.run();
        		break;
        }
});
if(process.argv[2] == null)
	init_db.run();
