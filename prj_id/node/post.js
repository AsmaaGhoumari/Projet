var util = require("util"); 
var url = require("url");
var fs = require("fs");
var news=require("./news.js");
var user=require("./user.js");
var db_users = require("./db_users.js");
var email = require("./email.js");

var post; //object 

//List of authorized actions
var whiteListUser = ["get_unval_users","get_users", "my_account", "delete_valid_user","recup_all_mail", "delete_user","inscription","valid_user","modif_supAd","add_user","delete_user", "modif_user", "add_other_user", "delete_other_user", "modif_other"];
var whiteListNews = ["my_news","get_unval_news","get_unval_my_news","delete_news", "unval_news", "unval_modif","get_unval_my_news","get_unval_news","add_news","get_news"];
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
        this.post_method(this.req,this.resp);
    }
};

exports.post_method = function(req, resp){

    var glob=''; 
    req.on('data', function(data) {
         glob+= data; 
    });
    var cookie = req.headers.cookie; 

    req.on('end',function() {
        var obj = JSON.parse(glob); //obj est composé de : action 
        if(obj.action=="last_news"){
            news.run(obj, resp); 
        } else if (obj.action == "first_log" || obj.action == "inscription") {
            user.run(obj, resp); 
        }else if(obj.action == "contact") {
            var cb;
            email.sendMail( "asmaa.ghoumari@gmail.com", "Message de contact : "+obj.name , obj.msg +" \n \n Envoyé par "+obj.mail, cb); //envoyer mail au redac pr modif  
            resp.writeHead(200, {'Content-Type' : 'application/json'});
            resp.end();
        }else{
            obj.cookie = cookie;
            db_users.get_login(obj.cookie, this, "cb"); 
            this.cb=function(mail){ 
                obj.email = mail;
                if( ~whiteListNews.indexOf(obj.action) ){  
                    news.run(obj, resp);  
                }else if( ~whiteListUser.indexOf(obj.action) ){
                    user.run(obj, resp);
                } else {
                    resp.writeHead(501, {"Content-Type": "application/json"}); 
                    resp.end(); 
                }
            };
        }
    });
};