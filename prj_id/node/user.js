var db = require("./db_users.js");//files which contains methods called in this file
var util = require("util"); 

/**
*This method is used to control and generate the timeout connexion 
*@param u (date ) is a date which is compare to the actual date. 
*if the result is 0 then the function returns false, in an other case it returns true.
*/
exports.is_timeout = function(u){
    var d= new Date(); 
    var u = new Date(u);
  return (d-u<timeout_time); //booléen
};

/**
*This method is used to manage the access of the functions depending on the users' rights
*@param req(object) request object
*@param res (object) result object
*@param e (String) email of a member to delete his account. Used in the fonction delete_other_user
*/
run=function(obj){

    role = db.get_role(obj.email);

    switch(obj.action){
        case 'add_user' : 
            		db.add_user(db.get_user(obj.email)); //tout le monde peut s'ajouter
            		break;
        case 'delete_user' : // supprimer son propre compte
            		if (role==0||role==1||role==2){db.delete_user(db.get_user(obj.email));}
            		else if (role==3){util.log("erreur : suppression du compte impossible ") ;}
            		else util.log("erreur : delete_user ");
            		break;
        case 'modif_user' : //modification de ses propres coordonnées 
            		if (role==0||role==1){util.log("erreur : valid_news ");}
            		else if (role==2||role==3){db.modif_user(db.get_user(obj.email)); }
            		else util.log("erreur : valid_news "); 
            		break;
         case 'add_other_user' : 
                    if (role==2||role==3){db.add_other_user("??????",obj.email);}
                    else util.log("erreur : action non authorisée "); 
                    break;
        case 'delete_other_  user': 
                    if (role==2||role==3){db.delete_other_user("??????",obj.email);}
                    else util.log("erreur : action non authorisée "); 
                    break;
        case 'modif_other_user' : 
                    if (role==2||role==3){db.modif_other_user("??????",obj.email);}
                    else util.log("erreur : action non authorisée "); 
                    break;
        case 'delete_other_user' : 
            		if (role==0||role==1){util.log("erreur : delete_other_user ");}
            		else if (role==2||role==3){db.delete_other_user(obj.temp[4].split("=")); }
            		else util.log("erreur : valid_news "); 
            		break;	

	}

	res.writeHead(200, {'Content-Type' : 'text/plain'});
	res.end();     
};		
