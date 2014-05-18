var MailListener = require("mail-listener2");
var news = require ("./news.js");
var db = require("./db_news.js"); 
var db_users = require("./db_users.js");


var mailListener = new MailListener({
  username: "addressmail",
  password: "mdp",
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX",
  searchFilter: "UNSEEN", 
  markSeen: true,
  fetchUnreadOnStart: true, 
  mailParserOptions: {streamAttachments: true} 
});

mailListener.start(); 


mailListener.on("server:connected", function(){
  console.log("imapConnected");
});  

mailListener.on("mail", function(mail){
              //TO DO ne reçoit pas les images
              //TO DO  : il faut que seulement le début de mail.subject commencer par news 
    if (mail.subject=="NEWS")
      {
          this.cb_get_user = function(user){
                resp.write(JSON.stringify({resp: user}));
                resp.end();
          };
          var name = db_users.get_user(mail.from, this,  "cb_get_user");
          var subject = mail.subject ; //TODO  : supprimer NEWS du subject pour publication
          var auth = {}; 
          auth.n = name ; 
          auth.s = subject ; 
          db.add_news(auth); 
          var path = db.get_path(mail.from, subject);
          news.set_content = (path, mail.text); 
      }
   
    console.log("From:", mail.from); 
    console.log("Subject:", mail.subject);
    console.log("Date : ", mail.date);
    console.log("Text body:", mail.text);
    console.log ("==========================================");

});


  mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
  });
 
  mailListener.on("error", function(err){
  console.log(err);
  });

//mailListener.stop(); 