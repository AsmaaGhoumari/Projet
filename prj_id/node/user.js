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

    var role = db.get_role(obj.email);
    var us = db.get_user(obj.email);
    switch(obj.action){

        case 'add_user' : 
            		db.add_user(obj.email);
            		break;

        case 'delete_user' :
            		if (role==0||role==1||role==2){db.delete_user(obj.email);}
            		else if (role==3){util.log("erreur : suppression du compte impossible ") ;}
            		else util.log("erreur : action non autorisée ");
            		break;

        case 'modif_user' :           		
            		db.modif_user(obj.champs, obj.valu, obj.email);            		 
            		break;

         case 'add_other_user' : 
                    if(db.login(obj.email)==true){
                        if (role==2||role==3){db.add_other_user(obj.other,obj.email);}
                        else util.log("erreur : action non autorisée "); }
                    else console.log("erreur  non autorisée") ;
                    break;

        case 'delete_other_user': 
                    if(db.login(obj.email)==true){
                        if (role==2||role==3){   db.delete_other_user(obj.other,obj.email);   } 
                        else console.log("erreur : action non autorisée "); }
                    else console.log("action non autorisée");
                    break;

        case 'modif_other_user' : 
                    if(db.login(obj.email)==true){
                        if (role==2||role==3){   db.modif_other_user(obj.other,obj.email);   }
                        else util.log("erreur : action non autorisée "); }
                    else console.log("erreur  non autorisée") ;
                    break;
	}

	res.writeHead(200, {'Content-Type' : 'text/plain'});
	res.end();     
};		
