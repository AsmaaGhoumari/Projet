var util = require("util");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("test.db");
var email = require("./email.js");
var timeout_time = 100; 
/*Object user*/
var user={};

/*Text of the email */
var TEXT = "";
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
*/
add_user = function(user){
	var stmt= db.prepare("INSERT INTO users (us_name, us_firstname, us_email, us_passwd, us_role, us_valid)VALUES (\'"+user.n_name+"\',\'"+user.f_name+"\',\'"+user.email+"\',\'"+user.passwd+"\',\'"+user.role+"\', \'false\')");
	stmt.run();

	user.valid=false;//compte reste bloqué  
	//util.log("coucouuuuuu");
	//email.sendMail("asmaa.ghoumari@gmail.com" , "pierre.aymeric.masse@gmail.com","add_user", "nouveau membre  : "+user.n_name +" "+ user.f_name+  " "+user.email + " "+user.passwd+ " "+user.role+"", cb);//envoie email  
	stmt.finalize();
	db.close();
};

valid_user=function(user){//test de valid 
	var stmt = db.prepare("UPDATE users SET us_role= \'"+ user.role + "\',  us_name = \'"+ user.n_name +"\', us_firstname= \'"+ user.f_name+ "', us_passwd= \'"+ user.passwd + "\', us_valid = \'true\' WHERE us_email = \'"+ user.email+"\'");
	stmt.run();
	stmt.finalize();
	db.close();
	//email.sendMail("asmaa.ghoumari@gmail.com" , "asmaa.ghoumari@gmail.com","add_user", "validation membre  : user.n_name  user.f_name  user.email  user.passwd user.role", cb);
};


/**
*
*
*/

check_psw = function(e,p){
	var compt=0;
	var a =" SELECT COUNT(*) as count FROM users WHERE us_email = \'"+e+"\'and psw = \'"+p+"\'";
	a.run();
    a.each(function(err, row) { // onextrait la date de la requête a 
                    compt = row.count;
                 });
	 a.finalize();  
	 db.close();
	 return compt;
}

/**
*
*/
delete_other_user=function(e){
	if(user.email!=e && (user.role==2||user.role==3)){
	var stmt = "DELETE * FROM users WHERE us_email=" + e+"\'";	
	db.run(stmt);
	//console.log("hihiiii ");
	stmt.finalize(); 
	db.close();
	}
	else util.log("erreur de suppression de membre");
	};
}
/**
*This method is used to delete an user in the database
*@param user (object) the user object
*/
delete_user = function (user){
	var stmt = "DELETE * FROM users WHERE us_email=" + user.email+"\'";	
	db.run(stmt);
	console.log("yooouh");
	//email.sendMail();//envoie email admin 
	stmt.finalize(); 
	db.close();
	};

/**This method is used to change informations about an user
*@param user (object) the user object
*/
modif_user = function(champ, valeur, email){
	if (champ == "n_name" || champ == "f_name" || champ== "passwd"){
	var stmt=db.prepare("UPDATE users SET\'"+ champ +" = \'"+valeur+"\' WHERE us_email =\'"+email+"\'");
	stmt.run(); 
	//email.sendMail(superadmain, user , Modifications , TEXT, cb);
	stmt.finalize();
	db.close();
	}
	else console.log(" Modification interdite");
};

/**
*This method is used to return the info about an user 
* @param email gives the id of an user to get the access of the database and display its informations.
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
}

/**
*This method is used to check the login of an user
*
*/
is_log = function(id_cookie, email){
	var date; 
    var a = ("SELECT date FROM users WHERE us_cookie=\'"+id_cookie+"\'"); 
    a.run();
    a.each(function(err, row) { // onextrait la date de la requête a 
                     date = row.us_date;
                 });
    a.finalize();
  	if(timeout(date)==true){
  		var stmt=db.prepare("UPDATE users SET us_date =\'"+ new Date().valueOf()+"\' WHERE cookie=\'"+id_cookie+"\'");
  		stmt.run();
  		stmt.finalize();  		
  	}
  	else {
  		console.log ("Connexion expirée");
  		//renvoyer le user sur la page de connexion
  	}
  	db.close();
};    

/**
*This method is used to set a cookie to an user
*@param
*@param
*/
set_cookie=function(){       
  var stmt ="INSERT INTO users (us_cookie) VALUES (this.user.us_email+\"_\"+Math.random())";//concaténation
  stmt.run();
  stmt.finalize();
  db.close();
};

get_cookie=function(id_cookie){
	var cookie;
	var a="SELECT us_cookie FROM users WHERE email=\'"+id_email+"\'";
	a.run();
 	a.each(function(err, row) { // on extrait la date de la requête a 
                    role = row.us_role;
                 });
	db.close;
	a.finalize();
	return role; 
}

/**
*This methode is used to get the role of an user
*@param : email of an user
*/
exports.get_role= function(id_email){
	var role;
	var a="SELECT us_role FROM users WHERE email=\'"+id_email+"\'";
	a.run();
 	a.each(function(err, row) { // on extrait la date de la requête a 
                    role = row.us_role;
                 });
	db.close;
	a.finalize();
	return role; 
	
}


//var user = { f_name:"asmaa", n_name: "toto"  };
//add_user(user);
