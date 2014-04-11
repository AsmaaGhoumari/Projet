var util = require("util");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("test.db");
var email = require("./email.js");
var timeout_time = 100; 
var us = require("./user.js");
var user={};/*Object user*/

/**
*The existing roles a user can have are :
* 0 : simple user
* 1 : writer (he can write articles, in order to publish its)
* 2 : admin (he controles and manages the all users excepted the superadmin, and all news )
* 3 : superadmin (he has th same rights of the admin but he also can delete or add admin)
*/

/**
*This method is the constructor of the object user
*@param n (String) n_name
*@param p (String) f_name
*@param e (String ) email
*@param pw (String ) password
*@param co () cookie
*@param date(date) date of the connexion
*@param role (int) level of access 
*@param valid (boolean) account activ or not
*/
var user = function (n, p, e, pw, co, date, role, valid){
	this.n_name = (n) ? n : "NC";
	this.f_name = (p) ? p : "NC";
	this.email = (e) ? e : "NC";
	this.passwd= (pw) ? pw : "NC";
	this.cookie = (co) ? co : 0;
	this.role = (role) ? role : 0;
	this.valid = (valid) ? valid : false; 
};

/**
*This method is used to add a new user in the database
*@param user (object) the user object {n_name = "DUPONT", f_name = "JACK", email = "jack@gmail.com", password = "jackpassword", cookie = "jack@gmail.com_149858585, role =1, valid = true }
*the user is added to the database nevertheless he has not got an activ account. The admin (or the superadmin) have to check it first.
*they check it thanks to the valid_user method.
*/
exports.add_user = function(user){
	var stmt= db.prepare("INSERT INTO users (us_name, us_firstname, us_email, us_passwd, us_role, us_valid)VALUES (\'"+user.n_name+"\',\'"+user.f_name+"\',\'"+user.email+"\',\'"+user.passwd+"\',\'"+user.role+"\', \'false\')");
	stmt.run();
	user.valid=false;//compte reste bloqué  
	//util.log("coucouuuuuu");
	//email.sendMail("asmaa.ghoumari@gmail.com" , "pierre.aymeric.masse@gmail.com","add_user", "nouveau membre  : "+user.n_name +" "+ user.f_name+  " "+user.email + " "+user.passwd+ " "+user.role+"", cb);//envoie email  
	stmt.finalize();
	db.close();
};


/**
*This method is used by the admin or the super admin.
*they can change the informations about a new user and then valid his account 
*/
exports.valid_user=function(user){//test de valid 
	var stmt = db.prepare("UPDATE users SET us_role= \'"+ user.role + "\',  us_name = \'"+ user.n_name +"\', us_firstname= \'"+ user.f_name+ "', us_passwd= \'"+ user.passwd + "\', us_valid = \'true\' WHERE us_email = \'"+ user.email+"\'");
	stmt.run();
	stmt.finalize();
	db.close();
	//email.sendMail("asmaa.ghoumari@gmail.com" , "asmaa.ghoumari@gmail.com","add_user", "validation membre  : user.n_name  user.f_name  user.email  user.passwd user.role", cb);
};

/**
*This method controls the correspondance between the password recorded for an unique email, and what is typed 
*it returns compt = 0 or 1 (the email is unique so 2 or more passwords cannot exist for a given user)
*/
exports.check_psw = function(e,p){
	var compt=0;
	var a =" SELECT COUNT(*) as count FROM users WHERE us_email = \'"+e+"\'and psw = \'"+p+"\'";
	a.run();
    a.each(function(err, row) { // onextrait la date de la requête a 
                    compt = row.count;
                 });
	 a.finalize();  
	 db.close();
	 return compt;
};

//ajouter un utilisateur à partir du compte admin ou superadmin A REFAIRE
exports.add_other_user=function(user, e){
	if(user.email!=e && (user.role==2||user.role==3)){
	var stmt= db.prepare("INSERT INTO users (us_name, us_firstname, us_email, us_passwd, us_role, us_valid)VALUES (\'"+user.n_name+"\',\'"+user.f_name+"\',\'"+user.email+"\',\'"+user.passwd+"\',\'"+user.role+"\', \'false\')");
	stmt.run();
	user.valid=true;
	//console.log("add_other_user ok ");
	stmt.finalize(); 
	db.close();
	}
	else util.log("erreur de suppression de membre");
}
/**
*This method allowed admin and superadmin to delete other users' accounts
*/
exports.delete_other_user=function(e){
	if(user.email!=e && (user.role==2||user.role==3)){
	var stmt = "DELETE * FROM users WHERE us_email=" + e+"\'";	
	db.run(stmt);
	//console.log("delete_other_user ok ");
	stmt.finalize(); 
	db.close();
	}
	else util.log("erreur de suppression de membre");
};

/**
*This method is used to delete an user in the database
*@param user (object) the user object
*example : {n_name = "DUPONT", f_name = "JACK", email = "jack@gmail.com", password = "jackpassword", cookie = "jack@gmail.com_149858585, role =1, valid = true }
*/
exports.delete_user = function (user){
	var stmt = "DELETE * FROM users WHERE us_email=" + user.email+"\'";	
	db.run(stmt);
	//console.log("yooouh");
	//email.sendMail();//envoie email admin  ?? 
	stmt.finalize(); 
	db.close();
};

/**This method is used to change informations about an user
*@param user (object) the user object
*example : {n_name = "DUPONT", f_name = "JACK", email = "jack@gmail.com", password = "jackpassword", cookie = "jack@gmail.com_149858585, role =1, valid = true }
*/
exports.modif_user = function(champs,email){
	var auto_chps = "n_name, f_name, passwd ";
	for( var z in champs){
	if (auto_chps.indexOf(z)>=0){
	var stmt=db.prepare("UPDATE users SET\'"+ z +" = \'"+champs[z]+"\' WHERE us_email =\'"+email+"\'");
	stmt.run(); 
	//email.sendMail(superadmain, user , Modifications , TEXT, cb); //confirmation des modif effectués par le user
	stmt.finalize();
	db.close();
	}
	else console.log(" Modification interdite");
}
};
 
/**
*
*/ 
exports.modif_other_user=function(champ, email){
	if(user.email!=email && (user.role==2||user.role==3)){
		modif_user(champ, email);
		}
	else console.log(" Modification interdite");
};

/**
*This method is used to return all informations about an user 
* @param email gives the id of an user to get the access of the database and display its informations.
*it returns an user Object
*/
exports.get_user = function(email){
	var user;
 	var a = ("SELECT * FROM users WHERE us_email=\'"+email+"\'"); 
 	a.run();
    a.each(function(err, row) { // onextrait la date de la requête a 
                    auth = row;
                 });
	 a.finalize();  
	 db.close();
 	return user;
};



exports.first_log = function(e, p){
	var c;
	var a = "SELECT us_email FROM users WHERE us_email=\'"+e+"\'AND us_passwd=\'"+p+"\'";
	//a.run();
    db.each(a, function(err, row) { // onextrait la date de la requête a 
        c= row.us_email;
    });	
    //db.finalize();
    db.close();
    if(c) {return set_cookie(e);}
    return false;
    
}
/**
*This method is used to check the timeout connexion of users
*it uses the function timeout. It makes the difference between the last connexion date and the new one. (learn more to gestionUser.js)
*if the connexion' user does not reach the timeout limit then it refreshes the last date connexion for the next time
*else the user has to reconnect himself,  
*/
//test si le cookie existe ou pas et lui en donne un sinon 
exports.login = function (email){
	var a = "SELECT us_cookie FROM users WHERE us_email=\'"+email+"\'";
	a.run();
    a.each(function(err, row) { // onextrait la date de la requête a 
        c= row.us_cookie;
    });
    a.finalize();
    if (c!=NULL){
    	is_log(c); }
    else {
    	set_cookie(email); }
    db.close();
};
//test la validité du cookie 
is_log = function(id_cookie){
	var date; 
    var a = "SELECT us_date FROM users WHERE us_cookie=\'"+id_cookie+"\'"; 
    a.run();
    a.each(function(err, row) { // onextrait la date de la requête a 
        date = row.us_date;
    });
    a.finalize();
  	if(us.is_timeout(date)){
	  		var stmt=db.prepare("UPDATE users SET us_date =\'"+ new Date().valueOf()+"\' WHERE cookie=\'"+id_cookie+"\'");
	  		stmt.run();
	  		stmt.finalize();
	  		db.close();

	  		  return true;		
  	}
  	return false;
};    


/**
*This method is used to set a cookie to an user
*example : cookie = "toto@gmail.com_38565695"
*/
exports.set_cookie=function(email){       
	var cookie = this.user.us_email+"_"+Math.random();
 	var stmt = "INSERT INTO users (us_cookie, us_date) VALUES (\'"+ cookie +"\', \'" + new Date().valueOf()+"\'";
 	 stmt.run();
 	 stmt.finalize();
 	 db.close();
 	 return cookie; 
};

/**
* This method is used to get a cookie's user
*@param id_cookie   this is what the function set_cookie generate
*it retunrs the role (that is to say the level of actions' access) of the user 
*/
exports.get_cookie=function(id_cookie){
	var cookie;
	var a="SELECT us_cookie FROM users WHERE email=\'"+id_email+"\'";
	a.run();
 	a.each(function(err, row) { 
        cookie = row.us_cookie;
    });
	db.close;
	a.finalize();
	return cookie; 
};

/**
*This methode is used to get the role of an user
*@param : email of an user
*It reutrns the role of the user (his level of rights)
*/
exports.get_role= function(id_email){
	var role;
	var a="SELECT us_role FROM users WHERE email=\'"+id_email+"\'";
	a.run();
 	a.each(function(err, row) { 
       role = row.us_role;
    });
	db.close;
	a.finalize();
	return role; 
};

//var user = { f_name:"asmaa", n_name: "toto"  };
//add_user(user);