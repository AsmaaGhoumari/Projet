var db = require("./db_users.js");//files which contains methods called in this file
var util = require("util");
var users = {};
var timeout_time  = 14400000;
/**
*This method is used to control and generate the timeout connexion 
*@param u (date ) is a date which is compare to the actual date. 
*if the result is 0 then the function returns false, in an other case it returns true.
*/
exports.is_timeout = function(u){
    var d = new Date(); 
    return (d-u<timeout_time); //booléen
};

var objR = function (resp,coookie) {
    this.resp = resp;
    this.cooki = coookie;
};

objR.prototype = {
retour_cookie: 
    function (x, rep){
        //console.log("retour_cookie user");
        this.resp.writeHead(x, {'Content-Type' : 'application/json', "Set-Cookie" : this.cooki});
        this.resp.write(JSON.stringify({resp: rep}));
        this.resp.end();
    },
retour:
    function (x, rep){
        // console.log("retour news");
        this.resp.writeHead(x, {'Content-Type' : 'application/json' });
        this.resp.write(JSON.stringify({resp: rep}));
        this.resp.end();
    }
};

/**
*This method is used to manage the access of the functions depending on the users' rights
*@param req(object) request object
*@param res (object) result object
*@param e (String) email of a member to delete his account. Used in the fonction delete_other_user
*/
exports.run=function(obj, resp){
    var role = null;
    var log = null;
    var statut = null;
    var sem = 0;
    var cookie = null;

    if(obj.action == "first_log") {
        users.process(role, statut, log, obj, resp, cookie);
    } else {
        sem++;  db.get_role(obj.email, this,"callback_role");
        sem++;  db.login(obj.email, this, "callback_login");
        sem++;  db.get_status(obj.email, this, "callback_status");

        this.callback_role = function(res){
            role = res;
            if (!--sem)
                users.process(role, statut, log, obj, resp, cookie);
        };

        this.callback_login = function (res,cook) {
            log = res;
            cookie = cook;
            if (!--sem)
                users.process(role, statut, log, obj, resp, cookie);
        };

        this.callback_status = function (res) {
            statut = res;
            if (!--sem)
                users.process(role, statut, log, obj, resp, cookie);
        };  
    }  
};	

users.process = function (role, statut, log, obj, resp, cookie) {
    //    console.log(obj);
        var reponse = new objR(resp, cookie); 
        switch(obj.action){

            case 'first_log' :         
                db.first_log(obj.email, obj.password, this, "cb");
                this.cb = function(bool,c,r){
                    if(bool){
                        new objR(resp, c).retour_cookie(200,{log:"true",role:r});
                    }else{  
                        new objR(resp, c).retour(403,{log:"false",role:0});
                    }
                    resp.end(); 
                }; 
                break;
            case 'recup_all_mail' :
                db.recup_all_mail(reponse, "retour_cookie");
                break;
            case 'inscription' :
                db.add_user(obj, reponse, "retour");
                break;
            case 'get_users' :
                if(statut && log){ 
                    db.get_all_users(reponse, "retour_cookie");
                } else reponse.retour_cookie(403);
                break;

            case 'get_unval_users' : 
                if(statut && log){
                    db.get_unval_users(reponse, "retour_cookie");
                } else reponse.retour_cookie(403);
                break;

            case 'my_account' : 
                if(statut && log){
                    db.get_user(obj.email, reponse, "retour_cookie", "true");
                } else reponse.retour_cookie(403);
                break;
            
            case 'valid_user' : 
                if(statut && log){
                   db.valid_user(obj.mail, reponse, "retour_cookie");
                } else reponse.retour_cookie(403);
                break;

            case 'modif_supAd' : 
                if(statut && log && role==2){
                    db.modif_superAdmin(obj.mail, obj.mdp, reponse, "retour_cookie");
                } else reponse.retour_cookie(403);
                break;
            
            case 'add_user' : 
                db.add_user(obj.email, reponse, "retour_cookie");
                //validation(obj);
                break;

            case 'delete_user' :
                if ((role==0||role==1||role==2) && log && statut){
                    db.delete_valid_user(obj.email, reponse, "retour_cookie");
                    console.log
                }else if (role==3){
                    console.log("erreur : suppression du compte impossible delete_user");
                    reponse.retour_cookie(403);
                }else{
                    console.log("erreur : action non autorisée delete_user ");
                    reponse.retour_cookie(403);
                }
                break;

            case 'modif_user' :                 
                if ((role==0||role==1||role==2) && log && statut) {  
                    db.modif_user(obj.champs, obj.valu, obj.email, reponse, "retour_cookie");
                    //validation(obj);
                }else if (role==3){  
                    console.log("erreur : action non autorisée modif_user "); 
                    reponse.retour_cookie(403);
                }else { 
                    console.log("erreur : action non autorisée modif_user "); 
                    reponse.retour_cookie(403);
                }             
                break;

             case 'add_other_user' : 
                if(log && statut){
                    if (role==2||role==3 && (obj.mail != obj.email)) {
                        db.add_other_user(obj.other,obj.mail, reponse, "retour_cookie");
                    }else {
                        console.log("erreur : action non autorisée add_other_user ");
                        reponse.retour_cookie(403);
                    }
                }else {
                    console.log("erreur : action non autorisee  add_other_user");
                    reponse.retour_cookie(403);
                }
                break;
            case 'delete_valid_user': 
                if(log&&statut){
                    if (role==2||role==3 && (obj.mail != obj.email) ){ 
                        db.delete_valid_user(obj.mail, reponse, "retour_cookie");
                    }else {
                        console.log("erreur : action non autorisée ");
                        reponse.retour_cookie(403);
                    }
                }else {
                    console.log("erreur : action non autorisee");
                    reponse.retour_cookie(403);
                }
                break;
            case 'delete_other_user': 
                if(log&&statut){
                    if (role==2||role==3 && (obj.mail != obj.email)){ 
                        db.delete_user(obj.mail, reponse, "retour_cookie");
                    }else {
                        console.log("erreur : action non autorisée delete_other_user ");
                        reponse.retour_cookie(403);
                    }
                }else {
                    console.log("erreur : action non autorisee  delete_other_user log");
                    reponse.retour_cookie(403);
                }
                break;

            case 'modif_other' : 
                if (log&&statut){
                    if (role==2||role==3 && (obj.mail != obj.email)) { 
                        db.modif_user(obj.champs, obj.valu, obj.mail, reponse, "retour_cookie");
                    }else {
                        console.log("erreur : action non autorisée modif_other ");
                        reponse.retour_cookie(403);
                    }
                }else {
                    console.log("erreur : action non autorisee  modif_other log");
                    reponse.retour_cookie(403);
                }
                break;

            default : 
                console.log("ERROR default user");
                break ; 
        }
};