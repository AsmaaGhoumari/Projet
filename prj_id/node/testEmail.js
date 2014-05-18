var mail = require("./email.js");
var smtplib = require("./receive_news.js"); 


var cb = function(){};
//mail.sendMail(" asmaa.ghoumari@gmail.com" , "pierre.aymeric.masse@gmail.com","coucou", "je t'aime", cb);
var smtpObj = smtplib.SMTP('localhost',2000);
smtpObj.set_debuglevel(1);
smtpObj.login('aaa', 'bbb');
var sender="asmaa.ghoumari@gmail.com";
var toemail = "asmaa.ghoumari@gmail.com";
var msg = MIMEMultipart('alternative');
msg.Subject= "my subj";
 msg.From = sender;
 msg.To = "asmaa.ghoumari@gmail.com";
msg.attach(MIMEText("Hello world!",'html'));
smtpObj.sendmail(sender, [toemail], msg.as_string());