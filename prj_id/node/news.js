var sqlite3=require("sqlite3").verbose();
var fs= require("fs"); //files needed 
var db = require("./db_news.js");
var us = require("./db_users.js");
var util = require("util"); 
var url = require("url");
var fs = require("fs");
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
*@param path (String) path to find the content of the news 
*/
exports.get_content = function (path, text) {
    if(path){
        fs.readFile(path, function (err, data) {
            if (err) throw err;
            console.log(data + "");
            //console.log(data.toString()); //même chose que ligne précédente
        }); 
    }
};

/**
* This method add the content of a news 
*@param filename (string) Object 
*@param data (string) text to record
*/
exports.set_content = function(path, data){
       fs.writeFile(path, data, function (err) {
        if (err) throw err;
        });
       //s'il n'y a que le contenu que l'on modifie -> update la news 
       db.update_date(path); 
};


/**
*This method is used to deal with the requests' user about news 
*@param obj (data post Object)  
*/
exports.run = function(obj){
		            
    var role = us.get_role(obj.email);
    var  n=db.get_news(obj.path);

    if(us.login(obj.email)==true){

        switch(obj.action){

            case 'ask_news' :  
                db.get_last_news ();                 
                break;

            case 'delete_news' : 
                if (role==0||role==1){util.log("erreur : action non autorisée ");}
                else if (role==2||role==3){ db.delete_news(n); console.log("Suppression effectuée");}
                break;

/*
 {"action": redac_news, "data": { "titre" : "TITRE DE LA NEWS", 
 "content" : "fezlfjelfsefl filohe flsehslefh self hszelf hkselfh lsfheslfh selfh ", "images" : [ "Image1", "Image2"]    }}
 */


            case 'redac_news' : 
                if (role !=0 && !(obj.path)){

                        var tab = obj.date.images; //array of images sent
                        var s = tab.length; //size of the array of images 

                        db.add_news(obj); // add of informations about redactor in the database
                        fs.mkdir('/obj.email'); //creation of the directory 
                        var path = "/"+obj.email+new Date(yyyy,mm,dd); //creation of a new path 
                        var path1 = path+"/texte";  //path for the content 
                        set_content(path1, obj.data.content); //add the content in the hard disk 
                        for ( var i = 0; i<s;i++){ //loop in the case of several images 
                            var path2=path+"/img"+i;
                            set_content(path2, tab[i]);
                        }                                           
                        console.log('Message enregistré ! =) ');
                        if(role==1){ 
                         //email.sendMail(superadmain, admin , Arcticle à valider , TEXT, cb); 
                        } 
                        if (role==2||role==3){ 
                            valid_news(n);// validation directe
                        }                         
                }
                else util.log("erreur : action non autorisée "); 
                break;
                    
            case 'valid_news' : 
                if(role==2||role==3){ 
                    get_unval_news(obj.path); 
                    switch(obj.bouton){
                        case 'valider' :
                            us.valid_news(news); 
                            break;
                        case 'modifier' : 
                            set_content(obj.path, obj.data); //enregistrer le contenu avec de commentaires
                            db.update_title(obj.path,obj.title); // enregistrer le possible nouveau titre
                           //email.sendMail(superadmain, redacteur , Arcticle à modifier , TEXT, cb); //envoyer mail au redac pr modif  
                            break;
                        case 'supprimer' : 
                            delete_news(obj.path); 
                            console.log("Article supprimé");
                            break;
                    }
                }
                else util.log("erreur : action non autorisée "); 
                break;
        }
    }    
        res.writeHead(200, {'Content-Type' : 'text/plain'});
        res.end();                
};