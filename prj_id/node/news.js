var sqlite3=require("sqlite3").verbose();
var fs= require("fs"); //files needed 
var db = require("./db_news.js");
var us = require("./db_users.js");
var email = require("./email.js");
var util = require("util"); 
var url = require("url");
var fs = require("fs");
var n = {};//news object empty
var news={};
var def = "NC" //path par defaut
var crypto    = require('crypto');
/*
 * {"action": redac_news, "data": { "titre" : "TITRE DE LA NEWS", 
 * "content" : "fezlfjelfsefl filohe flsehslefh self hszelf hkselfh lsfheslfh selfh ", "images" : [ "Image1", "Image2"],}}
 *
 * Avec Image = {img: img_content, ext:".png"}
 */

//initalisation objet news
var n = function (a,t,d,s,p,c){
	this.auth = (a) ? a : def;
	this.title = (t) ? t : def ;
	this.date = (d) ? d : 0 ;
	this.statut= (s) ? s : 0 ;
	this.path = (p) ? p : def;
	this.content = (c) ? c : def;
};

/**
*This method is used to the the content of un article 
*@param path (String) path to find the content of the news 
*/
var get_content = function (path) {
    if(path){
        return fs.readFileSync(path+'/article.txt'); 
    }
};

var delete_content = function(path){
    if(path){
            fs.unlinkSync(path + "/article.txt");
            fs.rmdir(path, function (err) {
                if(err) console.log (err);
                else {
                    util.log("INFO - News deleted : " + path);
                }
            }); 
        }
};
/*
 * The image is in ./files/ you must add it
 * This function is used to 
 */
news_from_site = function (o_content, tab_img_name) {
    for(var i in tab_img_name){
        fs.rename("./files/"  + tab_img_name[i], "./img" + img_name.split(".")[1] + i, function (e) {
            if (err) util.log("ERROR - Files process :" + e);
        });
    }
    fs.writeFile("texte.txt", JSON.stringify(o_content), function(e) {
        if (err) util.log("ERROR - Files process :" + e);
    });
};

exports.get_content = function (path) {
    if(path){
        fs.readFile(path, function (err) {
            if (err) throw err;
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
       db.update_date(path); 
};

/**
*This method is used to deal with the requests' user about news 
*@param obj (data post Object)  
*/
var set_content = function(path, data){
       fs.writeFile(path, data, function (err) {
        if (err) throw err;
        }); 
};

var create_path = function(path){
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
        return true;
    }   
}

get_from_email = function(p, email, mail){

    var tab = obj.date.images; 
    var s = tab.length; 

    fs.exists('p', function (e) { (!e) ? mkdir('./' + email) : null; }); //creation of the directory 
    var date = new Date(); 
    date = date.getFullYear+"_"+(date.getMonth+1)+"_"+date.getDay();
    var path = "/"+obj.email+date;  
    db.set_path(path); 
    var path1 = path+"/texte.txt";   
    set_content(path1, obj.data.content); 
    for (var i = 0; i<s;i++){
        var path2 = path + "/img" + i + tab[i].ext;
        set_content(path2, tab[i].img)
    }                                           
    if(role==1){ 
        email.sendMail("asmaa.ghoumari@gmail.com" , "Article à valider" , "Un nouvel article est disponible", "callback"); 
    } 
    if (role==2||role==3){ 
        db.valid_news(n, this, "cb");// validation directe
        this.cb = function(){};
    }            
};

var objR = function (resp,coookie) {
    this.resp = resp;
    this.cooki = coookie;
};

objR.prototype = {
news: 
    function (x, art) {
        // console.log("last_news news");
        for (var a in art) {
            art[a].contenu = get_content(art[a].contenu) + "";
        }
        this.resp.writeHead(x, {'Content-Type' : 'application/json'});
        this.resp.write(JSON.stringify(art));
        this.resp.end();
    },
news_cookie:
    function (x, art){
        // console.log("last_unval_news news");
        for (var a in art) {
            art[a].contenu = get_content(art[a].contenu) + "";
        }
        this.resp.writeHead(x, {'Content-Type' : 'application/json', "Set-Cookie" : this.cooki});
        this.resp.write(JSON.stringify(art));
        this.resp.end(); 
    },
retour_cookie: 
    function (x){
        // console.log("retour_cookie news");
        this.resp.writeHead(x, {'Content-Type' : 'application/json', "Set-Cookie" : this.cooki});
        this.resp.end();
    },
retour:
    function (x){
        // console.log("retour news");
        this.resp.writeHead(x, {'Content-Type' : 'application/json' });
        this.resp.end();
    }
};


exports.run=function(obj, resp){
    var role = null;
    var log = null;
    var statut = null;
    var sem = 0;
    var cookie = null; 

    if( obj.action=="last_news") {
                news.process(role, statut, log, obj, resp, cookie);
    } else {
        sem++;  us.get_role(obj.email, this,"callback_role");
        sem++;  us.login(obj.email, this, "callback_login");
        sem++;  us.get_status(obj.email, this, "callback_status");

        this.callback_role = function(res){
            role = res;
            if (!--sem){
                news.process(role, statut, log, obj, resp, cookie);
            }
        };

        this.callback_login = function (res,cook) {
            log = res;
            cookie = cook;
            if (!--sem)
                news.process(role, statut, log, obj, resp, cookie);
        };

        this.callback_status = function (res) {
            statut = res;
            if (!--sem)
                news.process(role, statut, log, obj, resp, cookie);
        };   
    } 
};  

 


/**
 * This method is used to deal with the requests' user about news 
 * @param obj (data post Object)  
 */
news.process = function (role, statut, log, obj, resp, cookie) {
    //console.log(obj.action + " => log : "+log+" role : "+role+" statut : "+statut);
    var reponse = new objR(resp, cookie); 
    switch(obj.action){

        case 'my_news' :
                if(statut&&log){ 
                    db.get_my_news(obj.email, reponse, "news_cookie");
                }
                break;
        case 'last_news' : 
                db.get_last_news(reponse, "news");
                break; 
        case 'add_news' : 
            var hash = crypto.createHash('sha1').update((new Date()).valueOf().toString() + Math.random().toString()).digest('hex');
            if(create_path('../news/'+hash)){
                set_content('../news/'+hash+'/article.txt', obj.message);
                db.add_news(obj, '../news/'+hash, reponse, "retour_cookie");
            } 
            break;
        case 'ask_news' :  //TROP CHELOU
                var path = db.get_path(obj.email, obj.title, this, "cb"); 
                this.cb = function(path){         
                    get_content(path); 
                };

                if (role !=0){ 
                    db.add_news(obj, this, "cb"); // add of informations about redactor in the database
                        //get_from_email(obj.content, obj.img);              
                }else util.log("erreur : action non autorisée  ask_news "); 
                //get la news au complet
                
                break;
    
        case 'delete_news' :
                if (log == true ){ 
                    var sale = {r:role,o:obj, rep:reponse };
                    var aut = us.get_email(obj.name, obj.firstname, sale ,this, "cb");
                    this.cb = function(aut, r){
                        if (r.r==0) {
                            util.log("erreur : action non autorisée delete_news ");
                            r.rep.retour_cookie(403);
                        }
                        else if (r.r==2||r.r==3||(r.r==1 && aut == r.o.email)){ 
                            db.get_path(aut, r.o.titre, r.rep, this, "cb2");
                            this.cb2 = function(path, b){
                                delete_content(path); 
                                db.delete_news(path, b, "retour_cookie");  
                            }
                        }                    
                    };

                }else{
                    console.log("erreur : connexion ");
                    reponse.retour_cookie(403);
                }
                break;

        case 'unval_news' : 
                var sale = {o:obj, rep:reponse};
                us.get_email(obj.name, obj.firstname, sale, this, "cb");
                this.cb = function(auteur,r){
                    db.valid_news(r.o.titre, auteur, r.rep, "retour_cookie");
                }
                break;

        case 'unval_modif' : 
                if(log == true){
                    var sale = {r:role, o:obj, rep:reponse };
                    var aut = us.get_email(obj.name, obj.firstname, sale ,this, "cb");
                    this.cb = function(aut, r){
                        if(r.r > 1 || (r.r == 1 && aut == r.o.email )){
                             db.get_path(aut, r.o.titre, r, this, "cb2");
                            this.cb2 = function(path, b){
                                var val = JSON.parse(b.o.values);
                                if(~b.o.chps.indexOf("titre")) { 
                                    db.update_title(path,val.titre); 
                                }
                                if(~b.o.chps.indexOf("msg")){
                                    fs.writeFile(path + "/article.txt",val.msg,function(err){if(err)console.log(err); })
                                } 
                                b.rep.retour_cookie(200);
                            };
                        }
                    };
                }
                break;
        case 'get_unval_my_news' :
            if(log==true && role==1){
                db.get_unval_my_news(obj.email, reponse, "news_cookie");
            } else {
                util.log("erreur : action non autorisée get_my_unval_news "); 
                reponse.retour_cookie(403);
            }
            break;
        case 'get_unval_news':
            //process.stdout.write("=====================================\n");
            //console.log("role : " + role +"\nlog : " + log + "\n");
            if(log==true && (role==2||role==3)){
                db.get_unval_news(reponse, "news_cookie");
            } else {
                //util.log("erreur : action non autorisée get_unval_news "); 
                reponse.retour_cookie(403);
            }

            break;
        case 'get_news':
           if(statut&&log){ 
                db.get_news(reponse, "news_cookie");
            }
            break;

        default : 
                console.log("ERROR default news");
                reponse.retour_cookie(501);
            break; 

    }                          
           
};