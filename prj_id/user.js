*This method is used to manage the access of the functions depending on the users' rights
*@param req(object) request object
*@param res (object) result object
*@param e (String) email of a member to delete his account. Used in the fonction delete_other_user
*/
run=function(obj){

    role = get_role(obj.email);

    switch(obj.action){
        case 'add_user' : 
            		if (role==0){util.log("erreur : add_news "); }
            		else if (role==1 ||role==2||role==3){db_news.add_user(db_users.get_user(obj.email));}
            		else util.log("erreur : add_news ");
            		break;
        case 'delete_user' : 
            		if (role==0||role==1||role==2){db_news.delete_user(db_users.get_user(obj.email));}
            		else if (role==3){util.log("erreur : delete_news ") ;}
            		else util.log("erreur : delete_news ");
            		break;
        case 'modif_user' : 
            		if (role==0||role==1){util.log("erreur : valid_news ");}
            		else if (role==2||role==3){db_news.modif_user(db_users.get_user(obj.email)); }
            		else util.log("erreur : valid_news "); 
            		break;
        case 'delete_other_user' : 
            		if (role==0||role==1){util.log("erreur : delete_other_user ");}
            		else if (role==2||role==3){db_news.delete_other_user(obj.temp[4].split("=")); }
            		else util.log("erreur : valid_news "); 
            		break;	
	}

	res.writeHead(200, {'Content-Type' : 'text/plain'});
	res.end();     
    });
   	}		
};
