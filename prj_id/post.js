var util = require("util"); 
var url = require("url");
var fs = require("fs");

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
        this.bdd = sqlite.openDatabaseSync(bddFile);//création de la table 
        this.bdd.query("IF NOT EXIST CREATE TABLE users (us_name varchar(255),us_firstname varchar(255),us_sponsor varchar(255),us_login varchar(255),us_addmail varchar(255),us_right int ,us_id varchar(255),us_password varchar(255),us_time char("00-00-00 00:00:00".lenght)");
        
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

post_method : 
     function(){
        var glob=''; 
        this.req.on('data', function(data) {
             glob+= data; 
        });
        this.req.on('end',function() {
        var temp=glob.split("&");
        var action=temp[0].split("="); 
        var email=temp[1].split("="); 
        var module=temp[2].split("=");
        var path=temp[3].split("=");
        //temp[4] : email d'un user pour fonction delete_other_user
        var obj={action, email, module, path, temp};

        if (module[1] == 0){ // module user
            user.run(obj);}
        else if (module[1] == 1){ //module news
            news.run(obj);}
        else {console.log("Erreur : module inconnu"); }

       /*
       res.writeHead(200, {'Content-Type' : 'text/plain'});
        res.end();        */
        });
};

