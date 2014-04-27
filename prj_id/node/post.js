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
            var obj = JSON.parse(glob); //obj est composé de : action, email , password 

            if(obj.action=="ask_news"){  news.run(obj);  }                
            
            else if (obj.action == "first_log") {
                db_users.first_log(obj.email, obj.password, resp);
                console.log("Vous êtes connecté ");
            } 

            
        });
};