/**
*This method is used to analyze a post request and collect each piece of data 
*/
exports.post_method =    function(req, resp){
        var glob=''; 
        this.req.on('data', function(data) {
             glob+= data; 
        });
        this.req.on('end',function() {
        var temp=glob.split("&");   
        res.writeHead(200, {'Content-Type' : 'text/plain'});
        res.end();        
        });
};


