var nodemailer = require("nodemailer");


 /*Object smtpTransport  : create a reusable transport object */
 var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",
   auth: {
       user: "asmaa.ghoumari@gmail.com",//"contact@idees.asso.fr",
       pass: "suricate<3"//"spirougs" 
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
exports.sendMail = function ( t , s, txt, cb) {
    var f = "asmaa.ghoumari@gmail.com"; 
    var data = {from: f, to: t, subject: s, text: txt};
    smtpTransport.sendMail(data, cb);
};

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

