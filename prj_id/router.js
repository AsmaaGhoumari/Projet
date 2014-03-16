var util = require("util"); //imporation des bibliothèques dans des variables 
var url = require("url");
var fs = require("fs");

/**
 * This method is used to process the request
 * @param req (Object) the request object
 * @param resp (Object) the response object
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
srouter = function (req, resp) { //déclaration de la méthode
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

srouter.prototype = {
run::// on lance les méthodes appelées dans ces accolades (on peut ainsi choisir quelles fonctions appeler)
    function () {
        this.rest_method();
    },

	
rest_method:
    function () {
		util.log(this.req.method);//sortie avec horodatage sur la sortie standard
        if (this.req.method == "GET") {//si c'est une requête de type GET
            this.get_method();//appel de la methode 
        } else {//sinon 
            this.resp.writeHead(501, {"Content-Type": "application/json"});//affichage du msg 
            this.resp.write(JSON.stringify({message: "Not Implemented"}));//affichage du msg 
            this.resp.end();//fin 
			return;
        }
    },

get_method:
    function () {
        var u = url.parse(this.req.url, true, true);//variable u = un objet. la fonct parse prend en entrée un url et génère un objet 
        var regexp = new RegExp("[/]+", "g");//regexp=regular expression, objet créé avec appel du constructeur. motif = /, drapeau =g= recherche globale sur la chaîne de caractère
        this.pathname = u.pathname.split(regexp);//séparation de egexp en 2
        this.pathname = this.pathname.splice(1, this.pathname.length - 1);//on récupère regexp -1 caractère au début, et -1 caractère à la fin. 
        this.filetype = this.pathname[this.pathname.length - 1].split(".");//le filetype est le regexp -1 dont on enlève le . 
		this.filetype = this.filetype[this.filetype.length - 1];//le filetype final est le filetype précédent -1caract. 
        this.path = ".." + u.path; //the website is one directory upper than the node server
		console.log("tac tac " + this.path);
        this.read_file();//appel de la méthode read_file
    },

read_file:
    function () {
        if (!this.pathname[0]) {//si le pathname est non nul
            //util.log("ALERT - Hack attempt, resquest on : " + util.inspect(this.pathname));
            this.pathname = "../index.html";//le pathname est celui de la page web index
            this.path = "../index.html";//le path pour chercher le fichier
            this.filetype = "html";//type du fichier index 
        }
		
        this.load_file();//appel de la méthode load_file 
    },

load_file:
    function () {
        var _this = this; //on fixe l'objet this dans une variable 
		console.log("=========> " + this.filetype + " " + this.path);//affichage du format et du path
        fs.exists(this.path, function (ex) {://si le path existe 
            if (ex) { 
                fs.readFile(_this.path, function (e, d) { //lecture du fichier 
                    if (e) { //message d'erreur 
                        util.log("ERROR - Problem reading file : " + e);
                    } else {
                        _this.file = d;//le fichier récupéré par  this est d 
						
                        _this.file_processing(); //appel de la méthode processing 
						
                    }
                });
            } else {
                util.log("INFO - File requested not found : " + _this.path);//message d'erreur fichier non trouvé 
                _this.resp.writeHead(404, {"Content-Type": "text/html"});
                _this.resp.end();//sortie 
            }
        });
    },

file_processing:
    function () {
		console.log("=> " + this.filetype + " " + this.path);//affichage 
        if (this.filetype == "htm") {//si le format est l'html 
            this.resp.writeHead(200, { "Content-Type" : "text/html"});//affichage de text en html 
        } else if (this.image_file.indexOf(this.filetype) >= 0) {//si c'est une image 
            this.resp.writeHead(200, { "Content-Type" : "image/" + this.filetype });
        } else { //autre format 
            this.resp.writeHead(200, { "Content-Type" : "text/" + this.filetype });
        }
        this.file_send();//appel methode file_send 
    },

file_send:
    function () {
        this.resp.write(this.file);//on écrit le fichier dans le flux de sortie 
        this.resp.end();//sortie 
    }
};
