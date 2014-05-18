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
*This method gets the email from the name and the firstname of an user
*@param name : name (String)
*@param fname : fistname (String)
*@param obj : this 
*@param cb : callback function
*/
exports.get_email=function(name, fname, obj, cb){
	var res;
	var a ="SELECT us_email FROM users WHERE us_name =\'" + name + "\'AND us_firstname = \'" + fname + "\'";
	db.each(a, function(e, row){
		res = row.a;
	}, function(){
		obj[cb](res);
	});
};

/**
* This method is used to change the mail address and the psw of the super admin 
* email : new address
* mdp : new password
*/
exports.modif_superAdmin=function(email, mdp){
	var stmt = db.prepare("UPDATE users SET  us_email = \'" + email + "\' , us_passwd = \'" + mdp + "\' WHERE us_role = \'"+ 3 +"\'");
	stmt.run();
}; 


/**
*This method is used to add a new user in the database
*@param user (object) the user object {n_name = "DUPONT", f_name = "JACK", email = "jack@gmail.com", password = "jackpassword", cookie = "jack@gmail.com_149858585, role =1, valid = true }
*the user is added to the database nevertheless he has not got an activ account. The admin (or the superadmin) have to check it first.
*they check it thanks to the valid_user method.
*/
exports.add_user = function(user){
	var stmt= db.prepare("INSERT INTO users (us_name, us_firstname, us_email, us_passwd, us_role, us_valid)VALUES (\'"+user.n_name+"\',\'"+user.f_name+"\',\'"+user.email+"\',\'"+user.passwd+"\', "+ user.role +",\'false\')");
	stmt.run();
	stmt.on("error", function(e){  console.log("ERROR - Database" + e); });
	user.role=1;
	user.valid=false;//le compte reste bloqué
};


/**
*This method is used by the admin or the super admin.
*they can valid the account of a new user 
*/
exports.valid_user=function(e){   //test de valid 
	var stmt = db.prepare("UPDATE users SET  us_valid = \'true\' WHERE us_email = \'"+ e+"\'");
	stmt.run();
	email.sendMail("asmaa.ghoumari@gmail.com","Nouveau Membre", "validation membre  : user.n_name  user.f_name  user.email  user.passwd user.role", cb);
};

exports.get_status=function(e, obj, cb){
	var a ="SELECT us_valid FROM users WHERE us_email = \'" +e +"\'";
	var valid=false;
	db.each(a, function(err, row) {  
        valid = row.a;
    }, function(){
    	obj[cb](valid);
    });
};

/**
*This method controls the correspondance between the password recorded for an unique email, and what is typed 
*it returns compt = 0 or 1 (the email is unique so 2 or more passwords cannot exist for a given user)
*/
exports.check_psw = function(e,p, obj, cb){
	var compt=0;
	var a ="SELECT COUNT(*) AS count FROM users WHERE us_email = \'"+e+"\'and psw = \'"+p+"\'";
    db.each(a, function(err, row) { 
        compt = row.count;
    }, function(){ obj[cb](compt);  });
	 
};

/**
*This method allows the admin or the superadmin to add a new user 
*@param user (Object) the user added
*@param e (String) the email of the admin of the superadmin 
*/
exports.add_other_user=function(user, e){
	if(user.email!=e){
		var stmt= db.prepare("INSERT INTO users (us_name, us_firstname, us_email, us_passwd, us_role, us_valid)VALUES (\'"+user.n_name+"\',\'"+user.f_name+"\',\'"+user.email+"\',\'"+user.passwd+"\',\'"+user.role+"\', \'false\')");
		stmt.run();
		stmt.on("error", function(e){  console.log("ERROR - Database" + e); });
		user.valid=true; 
	}
};
/**
*This method allowed admin and superadmin to delete other users' accounts
*@param e : email address
*@param admin : email of the admin
*/
exports.delete_other_user=function(e, admin){
	if(admin!=e){
	db.run( "DELETE FROM users WHERE us_email=?",e);
	}	
	else {console.log("erreur de suppression de membre"); }//return false;
};

/**
*This method is used to delete an user in the database
*@param user (object) the user object
*example : {n_name = "DUPONT", f_name = "JACK", email = "jack@gmail.com", password = "jackpassword", cookie = "jack@gmail.com_149858585, role =1, valid = true }
*/
exports.delete_user = function (e){
	db.run("DELETE  FROM users WHERE us_email= ? ", e);
	db.on("error", function(e){  console.log("ERROR - Database" + e); });	
};

/**
*This method is used to change informations about an user
*@param user (object) the user object
*example : {n_name = "DUPONT", f_name = "JACK", email = "jack@gmail.com", password = "jackpassword", cookie = "jack@gmail.com_149858585, role =1, valid = true }
*/
exports.modif_user = function(champs, value, email){
	var auto_chps = "us_name, us_firstname, us_passwd ";
	for( var z in champs){
		if (auto_chps.indexOf(champs[z])>=0){
			var stmt=db.prepare("UPDATE users SET \'"+ champs[z] +"\' = \'"+value[z]+"\' WHERE us_email =\'"+email+"\'");
			stmt.run(); 
			email.sendMail(email , "Modifications ", champs[z], cb); //envoi des modif effectuées par le user
		}
		else console.log(" Modification interdite");
	}
};

exports.modif_user = function(champs, value, email){
	var auto_chps = "us_name, us_firstname, us_passwd ";
	for( var z in champs){
		if (auto_chps.indexOf(champs[z])>=0){
			var stmt=db.prepare("UPDATE users SET \'"+ champs[z] +"\' = \'"+value[z]+"\' WHERE us_email =\'"+email+"\'");
			stmt.run(); 
			email.sendMail(email , "Modifications ", champs[z], cb); //envoi des modif effectuées par le user
		}
		else console.log(" Modification interdite");
	}
};
 
/**
*This method is used by the admin (or the super admin) to modify the informations about an user 
*@param champ 
*@param email 
*/ 
exports.modif_other_user=function(champ,value, email , user){  
	if(user.email!=email) {  
		modif_user(champ, value, email);  
	}else console.log(" Modification interdite");
};

/**
* This function is used to get all unvalid users statuts
* obj 
* cb callback method
*/
exports.get_unval_users = function(obj, cb ){
	var a = "SELECT * FROM users WHERE us_valid =\'"+false+"\'";
	var unval = false;
	db.each(a, function(e, row){
		unval = row.a;
	},function(){
		obj[cb](unval);
	});
};

/**
*This method is used to return all informations about an user 
*@param email gives the id of an user to get the access of the database and display its informations.
*it returns an user Object
*/
exports.get_user = function(email, obj, callback ){
	var auth={};
 	var a = "SELECT * FROM users WHERE us_email=\'"+email+"\'"; 
    db.each(a, function(err, row) {  
        auth = row;   
    }, function(){ 
    	obj[callback](auth);    
    });	
};

/**
*This method returns all users from the table
*obj 
*cb  : callback function
*/
exports.get_all_users=function(obj, cb){
	var a ="SELECT * FROM users"; 
	var res = null;
	db.each(a, function(e, r){
		res=row;
	},function(){obj[cb](res);
	});
};


/**
*This method is used to return the name of a redactor 
*@param email : id of the user 
*/
exports.get_name = function (email, obj, finish){
	var n="";
	var a="SELECT us_name FROM users WHERE us_email = \'"+email+"\'";
	db.each(a, function(err, row){
		n = row;
	}, function (){ obj [finish](n) ; });
};

/**
* This method is testing the first login time 
* If the user exists in the database, it set a cookie (call of set_cookie function)
*If not it displays an error message 
*@param e : the user's login (his/her email address)
*@param p : the user's password
*@param resp : the response send
*/
exports.first_log = function(e, p, resp){
	var a = "SELECT us_email FROM users WHERE us_email=\'"+e+"\' AND us_passwd=\'"+p+"\'";
    db.each(a, function(err, row) { // on extrait la date de la requête a 
        var coo = set_cookie(e);
    	resp.writeHead(200, "OK", {"Content-Type": "text/json", "Set-Cookie" : coo});
        resp.write(JSON.stringify({resp: "true"}));	
        resp.end();

    },function(){
    	resp.writeHead(200, "OK", {"Content-Type": "text/json"});
    	resp.write(JSON.stringify({resp: "false"}));
    	resp.end();
    });	
};


/**
*This method is used to check the timeout connexion of users
*it uses the function timeout. It makes the difference between the last connexion date and the new one. (learn more to gestionUser.js)
*if the connexion' user does not reach the timeout limit then it refreshes the last date connexion for the next time
*else the user has to reconnect himself,  
*/
exports.login = function (email, o, cb){
	var a = "SELECT us_cookie FROM users WHERE us_email=\'"+email+"\'";
	var c = null;
    db.each(a, function(err, row) {
        c = row.us_cookie;
    }, function () {
    	if (!c){
    		var c = set_cookie(email);
    		o[cb](c);
    		is_log(c, o, cb);
    	} else
    		is_log(c, o, cb);
    });
    
};

/**
*This method tests the validity of the cookie, calling is_timeout function and refresh if false; 
*@param id_cookie (cookie send by the user )
* example : toto_0.2456788999999
*/ 
is_log = function(id_cookie, o, cb){
	var date; 
    var stm = "SELECT us_date FROM users WHERE us_cookie=\'"+ id_cookie + "\'"; 
    db.each(stm, function(err, row) { 
        date = row.us_date;
    },function () {
    	  	if(us.is_timeout(date)){
	  			var stmt=db.prepare("UPDATE users SET us_date =\'"+ new Date().valueOf() +"\' WHERE cookie=\'"+id_cookie+"\'");
	  			db.run(stmt);
  				o[cb](true);	
  			} else {
  				o[cb](false);
  			}
    });
};    

/**
*This method is used to set a cookie to an user
*example : cookie = "toto@gmail.com_38565695"
*/
var set_cookie=function(email, obj, cb){      
	var cookie = email+"_"+Math.random();
 	var stmt = "UPDATE users SET us_cookie=\'"+ cookie +"\', us_date=\'" + new Date().valueOf()+"\' WHERE us_email=\'" + email + "\'";
	db.run(stmt);
	return cookie;
};

/**
* This method is used to get a cookie's user
*@param id_cookie   this is what the function set_cookie generate
*it returns the role (that is to say the level of actions' access) of the user 
*/
exports.get_cookie=function(email, obj, cb){
	var c;
	var a="SELECT us_cookie FROM users WHERE us_email=\'"+email+"\'";
 	db.each(a, function(err, row) { 
        c = row.us_cookie;
    },  function (){obj [cb](c) ; }); 
};

/**
*This methode is used to get the role of an user
*@param : email of an user
*It returns the role of the user (his level of rights)
*/
exports.get_role= function(email, obj, cb){
	var role;
	var a="SELECT us_role FROM users WHERE us_email=\'"+email+"\'";
 	db.each(a, function(err,row){ 
       role = row.us_role;
    },  function (){
    	obj[cb](role);
    });
};