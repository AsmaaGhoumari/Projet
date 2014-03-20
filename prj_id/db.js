var util = require("util");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("test.db");
var email = require("./email.js");
var cookie = require("./cookie.js");
var timeout_time = 100; 
/*Object user*/
var user={n_name, f_name, email, passwd, cookie, date, role, valid};

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
	this.cookie =
};

/**
*This method is used to add a new user in the database
*@param user (object) the user object
*/
exports.add_user = function(user){
	var stmt= this.db.prepare("INSERT INTO users VALUES (?,?,?,?,?)");
	stmt.bind(1,user.n_name);
	stmt.bind(2,user.f_name);
	stmt.bind(3,user.email);  //il faut tester si l'email n'est pas déjà présent 
	stmt.bind(4,user.passwd);
	stmt.bind(5,user.role);
	stmt.run();
	user.valid=false;//compte reste bloqué 
	user.role=0;//pas de droit pour l'instant 	 
	srouter.smtpTransport.sendMail(error, "Membre ajouté");//envoie email 
	stmt.finalize(); //je mets cette ligne ? il me semble que c'est optionnel mais miex apparemment même si j'ai pas trop compris pk ^^'
	db.close();
};

/**
*This method is used to delete an user in the database
*@param user (object) the user object
*/
exports.delete_user = function (user){
	var stmt = "DELETE * FROM users WHERE email=" + user.email;	
	db.run(stmt);
	srouter.smtpTransport.sendMail(error, "Membre supprimé");//envoie email admin 
	stmt.finalize(); 
	db.close();
	};

/**This method is used to change informations about an user
*@param user (object) the user object
*/
exports.modif_user = function(user){
	var stmt=this.bdd.prepare("UPDATE users SET (?,?,?,?)" );

	stmt.run(); 
	email.sendMail(admin@gmail.com, email , Modifications , TEXT, cb);
	stmt.finalize();
	db.close();
};

/**
*This method is used to check the login of an user
*
*/
is_log = function(id_cookie){
    var a = "SELECT date FROM users WHEN cookie=id_cookie"; 
  	set_cookie();
	db.close();
  	return (a) ? cookie.is_timeout(date) : false;
};    

/**
*This method is used to send a new login 
*@param
*/
init_login=function(req,res,user){
    if(req=='POST'){ //revoir la condition 
        var new_log= user.us_email.substring(0, 3) + "_" + Math.random(); //on concatène le login (3premiers caractères?) et un nombre au hasard
        var stmt = this.bdd.prepare("INSERT INTO users VALUES \"new_log\""); //changement de la db
        stmt.bind(1,user.us_passwd);
        srouter.smtpTransport.sendMail();//envoi du mdp par email 
    }
};

/**
*This method is used to a cookie 
*@param
*@param
*/
set_cookie=function(){       
  var stmt ="INSERT INTO users (cookie) VALUES (this.user.us_email+\"_\"+Math.random())";//concaténation
  stmt.run();
  stmt.finalize();
  db.close();
};

/**
*This method is used to control and generate the timeout connexion 
*@param
*/
is_timeout = function(u){
  return (new date()-u<timeout_time);
  }
}
};

/**
*This method is used to manage the access of the functions depending on the users' rights
*@param req(object) request object
*@param res (object) result object
*/
gestion_db=function(req, res){
	if(req.method=='POST'){ 
		var glob=''; 
		req.on('data', function(data) {
             glob+= data;//get the data sent 
		});
		req.on('end',function(user) {
		if( user.role==0 ){ //functions allowed to students
			switch(req) {
			case "add_user" : 
			util.log("error : add_user");
			break;
			case "delete_user" :
			delete_user(user);
			break;
			case "modif_user" : 
			modif_user();
			break;
			}
		} 
		if(user.role==1 ){//functions allowed to writers
		switch(req) {
			case "add_user" : 
			util.log("error : add_user");
			break;
			case "delete_user" :
			delete_user(user);
			break;
			case "modif_user" : 
			modif_user(user);
			break;
			}
		} 
		if( user.role==2) {//functions allowed to admin 
			switch(req) {
			case "add_user" : 
			add_user(user);
			break;
			case "delete_user" :
			delete_user(user);			
			break;
			case "modif_user" : 
			modif_user(user);
			break;
			}
		}
		if(user.role==3){//functions allowed to superadmin
			switch(req) {
			case "add_user" : 
			add_user(user);
			break;
			case "delete_user" :
			delete_user(user);
			break;
			case "modif_user" : 
			modif_user(user);			
			break;
			}
		}
		res.writeHead(200, {'Content-Type' : 'text/plain'});
		res.end();     
    	});
   	}		
};
