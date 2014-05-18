var util = require("util"); 
var url = require("url");
var fs = require("fs");
var news=require("./news.js");
var user=require("./user.js");
var db_users = require("./db_users.js");
var email = require("./email.js");

var post; //object 

/**
 * This is the parametred constructor of a srouter
 * @param req (Object) the request object 
 * @param resp (Object) the response object
 */
post_router = function (req, resp) { 
    if (req && resp) { 
        this.req = req;
        this.resp = resp;
        this.pathname = "";
        this.filetype = "";
        this.path = "";
        this.image_file = "jpg png jpeg bmp";
    } else { 
        util.log("ERROR - A srouter object need a request and a response object");
        return;
    }
};


exports.post = function (req, resp) {
    var inc_request = new post_router(req, resp);
    inc_request.run();
    inc_request = null; 
};

post_router.prototype = {
    run : 
    function (){
        this.post_method();
    },
};

//TO DO : commenter
exports.post_method = function(req, resp){
        var glob=''; 
        req.on('data', function(data) {
             glob+= data; 
        });
        var cookie = req.headers.cookie; 
        req.on('end',function() {
            var obj = JSON.parse(glob); //obj est composé de : action 
            obj.cookie = cookie;
            if(obj.action=="ask_news"){  
                news.run(obj, resp);  
            }else if (obj.action =="get_unval_news"){
                news.run(obj, resp);
            }else if(obj.action =="get_unval_users"){
                user.run(obj, resp);
            }else if(obj.action =="get_users"){
                user.run(obj, resp);
            }else if (obj.action == "first_log") {
                db_users.first_log(obj.email, obj.password, resp);
            }else if(obj.action =="my_account"){
                user.run(obj, resp);
            }else if(obj.action =="my_news"){
                user.run(obj, resp);
            }else if(obj.action =="contact"){
                //obj.nom => nom mis dans le champ, obj.msg => contenu du message du gars, obj.mail => contneu du mail
                //email.sendMail(redacteur , Arcticle à modifier , TEXT, cb); //envoyer mail au redac pr modif  
                resp.writeHead(200, "OK", {"Content-Type": "text/json"});
                res.end();
            }
        });
};