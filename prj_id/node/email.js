
var nodemailer = require("nodemailer");


 /*Object smtpTransport  : create a reusable transport object */
 var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",
   auth: {
       user: "asmaaghoumari@gmail.com",
       pass: "ghoumariasmaa92" 
   }
});

/**
*This method is used to send an email
*@param f (string)  the person who send the email. Here it is the association Idees Madagascar, super admin email
*@param t (string) destination
*@param s (string) subject 
*@param txt (string) message
*@param cb (function) callback function 
*/
exports.sendMail = function (f, t , s, txt, cb) {
    var data = {from: f, to: t, subject: s, text: txt};
    //console.log(data);
   smtpTransport.sendMail(data, cb);
};

/**
*This method is used to check if the email has been properly sent 
*@param data (object) the data object 
*@param cb (function) the callback function 
*/
//smtpTransport.sendMail(data, cb); 

/**
*This method is used to create a callback function 
*@param e : error
*@param r (String) response 
*/
cb = function (e, r){
    if (e){
        util.log("ERROR - Mail system : " + e);
    } else {
        util.log("INFO - Message sent : " + r.message.substring(0,50));
}};

var bob = "azeazxeza@azeaze.rg";
//srouter.sendMail(bob, bobby, coucou, azert, srouter.ex_cb);