var sqlite3=require("sqlite3").verbose(); //files needed 
var db = require("./db_news.js");
var us = require("./db_users.js");
var n={};//news object empty
var def = "NC" //path par defaut

//initalisation objet news
var n= function (a,t,d,s,p,c){
	this.auth = (a) ? a : "NC";
	this.title = (t) ? t : "NC";
	this.date = (d) ? d : 0 ;
	this.statut= (s) ? s : 0 ;
	this.path = (p) ? p : def;
	this.content = (c) ? c : "NC";
};

/**
*This method is used to the the content of un article 
*
*/
exports.get_content = function(path){
       fs.readFile(path, function (err, data) {
                 return data;
       });
};

/**
*This method is used to deal with the requests' user about news 
*@param obj (data post Object)  
*/
exports.run = function(obj){
		            
    var role = us.get_role(obj.email);
    var  n=db.get_news(obj.path);
          
    switch(obj.action){
            	case 'add_news' : //ajout d'une news à la bdd
            		if (role==0||role==1){util.log("erreur : add_news "); }
            		else if (role==2||role==3){db.add_news(n);}
            		else util.log("erreur : add_news ");
            		break;
            	case 'delete_news' : //suppression d'une news à la bdd
            		if (role==0||role==1){util.log("erreur : delete_news ");}
            		else if (role==2||role==3){db.delete_news(n); }
            		else util.log("erreur : delete_news ");
            		break;
            	case 'redaction_news' : //redaction news
            		if (role==1){//redacteur 
                        db.valid_news(); //verification        
                        db.add_news(n); //ajout de la news à la bdd
                        //enregistrement info 
                        //enregistrement content
                    }
                    else if(role==2||role==3)  {db.valid_news(n);}
            		else util.log("erreur : valid_news "); 
            		break;
                
                case 'validation_news' : 
                if(role==2||role==3){ //test role 
                    us.login(); //test connexion 
                    get_unval_news(obj.path);//liste des news à valider
                    if (true){//si ok => validation
                        valid_news(n);
                    }
                    else if(true){//sinon modif + test conexion + mise à jour
                        if (us.login(obj.email)) db.valid_news(n);
                    }
                    else if(true){//sinon supp + test connexion                    
                     if (us.login(obj.email)==true) db.delete_news(n);
                    }
                break;
                }
                case 'publication_news' : 
                    if(us.login(obj.email)==true&&(role==2||role==3)){}//test connexion et si admin ou superadmin ok 
                    //publier sur le mur 
                    break;
                case 'display_last_news' : 
                    break;
                }
        };

/*
		res.writeHead(200, {'Content-Type' : 'text/plain'});
		res.end();     
    	});
   	}		
};*/