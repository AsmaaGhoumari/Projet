/*Files required*/
var util = require("util"); 
var url = require("url");
var fs = require("fs");
var nodemailer = require("nodemailer");
var db = require("./db.js");
var mail = require("./email.js");
var cookie=require("./cookie.js");
var get = require("./get.js");


/*Object user */
var user={n_name, f_name, email, passwd, cookie, date, role, valid};
/**
 * This is the parametred constructor of a srouter
 * @param req (Object) the request object 
 * @param resp (Object) the response object
 */
get_router = function (req, resp) { 
    
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

/**
 * This method is used to process the request
 * @param req (Object) the request object 
 */
 //Exports est utilisé pour rendre les méthodes du module disponibles pour les scripts extérieurs à ce module. 
exports.router = function (req, resp) {
    var inc_request = new srouter(req, resp);
    inc_request.run();//on lance 
    inc_request = null;//on sort 
};

srouter.prototype = {
/**
*This method used to launch the rest_method
*/
run : 
function () {
        this.rest_method(req, resp);
    },
/**
*This method is used to determine the kind of request received 
*/
rest_method :
 function(req, resp){

        util.log(this.req.method);

        if (this.req.method == "GET"){
            get.get(this.req,this.resp);} //this method is used to navigate on the web site
        else if (this.req.method == "POST") {
           post.post_method();}
         else {
            this.resp.writeHead(501, {"Content-Type": "application/json"}); 
            this.resp.write(JSON.stringify({message: "Not Implemented"})); 
            this.resp.end();//fin 
            return;
        }
},
};
