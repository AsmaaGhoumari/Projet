 /*Files required*/
var util = require("util"); 
var url = require("url");
var fs = require("fs");
var nodemailer = require("nodemailer");
var formidable = require("formidable"); 
var mail = require("./email.js");
var get = require("./get.js");
var post = require("./post.js");



/*Object user */
//var user={n_name, f_name, email, passwd, cookie, date, role, valid};

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

/**
 * This is the parametred constructor of a srouter
 * @param req (Object) the request object 
 * @param resp (Object) the response object
 */
srouter = function (req, resp) {
    if (req && resp) { //s'il y a les 2 variables qui existent 
        this.req = req;//la variable req de mon objet est égale à la variable globale req
        this.resp = resp;//même raisonnement avec resp
        this.pathname = "";//initialisation de pathname (null)
        this.filetype = "";//initialisation du filetype (null)
        this.path = "";//initialisation du path(null)
        this.image_file = "jpg png jpeg bmp";//listing des formats que peut prendre la variable image_file  
    } else {  
        util.log("ERROR - A srouter object need a request and a response object");
        return;
    }
};

srouter.prototype = {
/**
*This method used to launch the rest_method
*/
run : 
function () {
        this.rest_method();
    },
/**
*This method is used to determine the kind of request received 
*/
rest_method :
    function(){

        //util.log(this.req.method);

        if (this.req.method == "GET"){
            get.get(this.req, this.resp); //this method is used to navigate on the web site
        } else if (this.req.method == "POST") {
            var reg = new RegExp("multipart/form-data", "g");
            if(!reg.test(this.req.headers["content-type"])){
                post.post_method(this.req, this.resp);
            } else {
                if (req.url == '/' && req.method.toLowerCase() == 'post') {
                    // parse a file upload
                    var form = new formidable.IncomingForm();
                    form.parse(req, function(err, fields, files) {
                        fs.rename(files.upload.path, "./files/"+ files.upload.name , "utf8", function (e) {
                            if (e) console.log(e);
                        });
                        news.news_from_site(fields, files.upload.name);
                        res.writeHead(200, {'content-type': 'text/plain'});
                        res.end();
                    });
                    return;
                }
            }
        } else {
            this.resp.writeHead(501, {"Content-Type": "application/json"}); 
            this.resp.write(JSON.stringify({message: "Not Implemented"})); 
            this.resp.end(); 
            return;
        }
    },
}; 