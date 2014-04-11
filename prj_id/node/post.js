var util = require("util"); 
var url = require("url");
var fs = require("fs");
var news=require("./news.js");
var user=require("./user.js");
var db_users = require("./db_users.js");

var post; //object 

/**
 * This is the parametred constructor of a srouter
 * @param req (Object) the request object 
 * @param resp (Object) the response object
 */
post_router = function (req, resp) { 
    
    if (req && resp) { //s'il y a les 2 variables qui existent 
        this.req = req;//la variable req de mon objet est égale à la variable globale req
        this.resp = resp;//même raisonnement avec resp
        this.pathname = "";//initialisation de pathname (null)
        this.filetype = "";//initialisation du filetype (null)
        this.path = "";//initialisation du path(null)
        this.image_file = "jpg png jpeg bmp";//listing des formats que peut prendre la variable image_file
    } else { //sinon message d'erreur affiché à l'écran 
        util.log("ERROR - A srouter object need a request and a response object");
        return;
    }
};


exports.post = function (req, resp) {
    var inc_request = new post_router(req, resp);
    inc_request.run();//on lance 
    inc_request = null;//on sort 
};

post_router.prototype = {
    run : 
    function (){
        this.post_method();
    },


};

exports.post_method = function(req, resp){
        var glob=''; 
        req.on('data', function(data) {
             glob+= data; 
        });
        req.on('end',function() {
        /*var temp=glob.split("&");
        var action=temp[0].split("="); 
        var email=temp[1].split("="); 
        var module=temp[2].split("=");
        var path=temp[3].split("=");
        var psw = temp[4].split("=");*/
       var obj = JSON.parse(glob);
       console.log(util.inspect(obj));
      //  var obj={action , email, module, path, psw, temp}; //TODO modif objet -> parse
        
        if(obj.action=="ask_news"){
        }
        else if (obj.action == "first_login") {
            console.log("first_log");
            var c = db_users.first_log(this.email, this.password);
            if (c) {
                resp.writeHead(200, "OK", {"Content-Type": "text/json", "Set-Cookie" : c});
                resp.write(JSON.stringify({resp: "ok"}));
            } else {
                resp.write(JSON.stringify({resp: "ko"}));
            }
            resp.end();
        }
        /*else if ((user.login(obj.email))&&(check_psw (obj.email, obj.psw))==1){ //s'il est connecté et si  le passeword est ok 

            if (module[1] == 0){ // module user on teste le module demandé 
                user.run(obj);}

            else if (module[1] == 1){ //module news
                news.run(obj);}

            else {console.log("Erreur : demande inconnue "); }
        }*/
        else console.log ("Veuillez vous vérifier votre mot de passe");
    });
       /*
       res.writeHead(200, {'Content-Type' : 'text/plain'});
        res.end();        */
};
