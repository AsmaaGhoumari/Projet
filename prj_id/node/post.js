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
            var a = "[{\"date\":1397570381129,\"title\":\"qsdfgh\",\"content\":\"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ultricies elit nec tortor rutrum vehicula. Donec tempor blandit viverra. Aenean semper ipsum tellus, vel aliquam eros lacinia ac. Cras porta quam nec sapien interdum, et pulvinar justo imperdiet. Sed enim metus, interdum eu eros sit amet, pellentesque facilisis leo. Pellentesque adipiscing, eros non varius vehicula, ligula nulla sodales purus, ut fermentum lacus ligula sit amet tortor. Ut mi lorem, condimentum ut diam eu, mattis scelerisque eros. Sed suscipit nisi ut odio hendrerit, ac ultrices augue sagittis. Phasellus vestibulum ullamcorper lorem, ut imperdiet nibh tincidunt viverra. In quis augue odio. Integer eu enim ut turpis venenatis fermentum. Cras quis dolor sit amet risus bibendum posuere non eu nulla. Aenean viverra, enim sit amet consectetur vestibulum, metus velit tincidunt orci, a pulvinar arcu libero sed diam. Aliquam dictum, nunc et malesuada consequat, metus nunc consequat dui, facilisis lacinia massa tortor sed tortor. Duis arcu ipsum, pharetra vel luctus nec, auctor nec purus. In luctus gravida mi, quis gravida risus imperdiet sed. Aliquam sapien erat, euismod in elementum quis, lacinia a nulla. Integer viverra sagittis erat, id mattis libero scelerisque eu. Mauris nulla urna, interdum a dapibus eu, dignissim vel odio. Quisque leo ipsum, imperdiet eu justo sed, vestibulum tristique urna. Nam gravida tellus risus. In iaculis vel velit eget placerat. Donec in leo pretium, gravida nibh ut, consectetur libero.\",\"author\":\"bobby\"},{\"date\":1397570381129,\"title\":\"qsdfgh\",\"content\":\"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ultricies elit nec tortor rutrum vehicula. Donec tempor blandit viverra. Aenean semper ipsum tellus, vel aliquam eros lacinia ac. Cras porta quam nec sapien interdum, et pulvinar justo imperdiet. Sed enim metus, interdum eu eros sit amet, pellentesque facilisis leo. Pellentesque adipiscing, eros non varius vehicula, ligula nulla sodales purus, ut fermentum lacus ligula sit amet tortor. Ut mi lorem, condimentum ut diam eu, mattis scelerisque eros. Sed suscipit nisi ut odio hendrerit, ac ultrices augue sagittis. Phasellus vestibulum ullamcorper lorem, ut imperdiet nibh tincidunt viverra. In quis augue odio. Integer eu enim ut turpis venenatis fermentum. Cras quis dolor sit amet risus bibendum posuere non eu nulla. Aenean viverra, enim sit amet consectetur vestibulum, metus velit tincidunt orci, a pulvinar arcu libero sed diam. Aliquam dictum, nunc et malesuada consequat, metus nunc consequat dui, facilisis lacinia massa tortor sed tortor. Duis arcu ipsum, pharetra vel luctus nec, auctor nec purus. In luctus gravida mi, quis gravida risus imperdiet sed. Aliquam sapien erat, euismod in elementum quis, lacinia a nulla. Integer viverra sagittis erat, id mattis libero scelerisque eu. Mauris nulla urna, interdum a dapibus eu, dignissim vel odio. Quisque leo ipsum, imperdiet eu justo sed, vestibulum tristique urna. Nam gravida tellus risus. In iaculis vel velit eget placerat. Donec in leo pretium, gravida nibh ut, consectetur libero.\",\"author\":\"bob\"}]";
            resp.writeHead(200, "OK", {"Content-Type": "text/json"});
            resp.write(a);
            resp.end();
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
