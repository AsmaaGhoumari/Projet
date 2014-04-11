var db = require("/db_users.js");//files which contains methods called in this file
var util = require("util"); 

/**
*This method is used to control and generate the timeout connexion 
*@param u (date ) is a date which is compare to the actual date. 
*if the result is 0 then the function returns false, in an other case it returns true.
*/
exports.is_timeout = function(u){
    var d= new Date(); 
    var n =d.valueOf();
  return (n-u<timeout_time);
};

/**
*This method is used to manage the access of the functions depending on the users' rights
*@param req(object) request object
*@param res (object) result object
*@param e (String) email of a member to delete his account. Used in the fonction delete_other_user
*/
gestion_users=function(req, res,e){
	if(req.method=='POST'){ 
		var role;
		var glob=''; 
		req.on('data', function(data) {
             glob+= data;//get the data sent 
		});
		req.on('end',function() {
            var tmp = glob.split('&');
            action = tmp[0].split("=");
             role = get_role(email);

           switch(action[1]){
            	case 'add_user' : 
            		if (role==0){util.log("erreur : add_news "); }
            		else if (role==1 ||role==2||role==3){db_news.add_news(n);}
            		else util.log("erreur : add_news ");
            		break;
            	case 'delete_user' : 
            		if (role==0||role==1||role==2){db_news.delete_news(n);}
            		else if (role==3){util.log("erreur : delete_news ") ;}
            		else util.log("erreur : delete_news ");
            		break;
            	case 'modif_user' : 
            		if (role==0||role==1){util.log("erreur : valid_news ");}
            		else if (role==2||role==3){db_news.valid_news(n); }
            		else util.log("erreur : valid_news "); 
            		break;
            	}
            	case 'delete_other_user' : 
            		if (role==0||role==1){util.log("erreur : delete_other_user ");}
            		else if (role==2||role==3){db_news.delete_other_user(e); }
            		else util.log("erreur : valid_news "); 
            		break;	
		}
		res.writeHead(200, {'Content-Type' : 'text/plain'});
		res.end();     
    	});
   	}		
};
