
/**
 * Module dependencies.
 */

var express = require('express'),
	url = require("url"),
	fs = require("fs"),
  	routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/',function(req,res){
  res.render('example2.ejs',{layout :false});
})

app.use(function(req, res, next) {
    var data='';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { 
       data += chunk;
    });

    req.on('end', function() {
        req.body = data;
        next();
    });
});

app.post('/acceptfile',function(req,res){
	var query = url.parse(req.url,true).query;
	console.log(query);

	var data='';
	req.setEncoding('binary');

    req.on('data', function(chunk) { 
       data += chunk;
    });

    req.on('end', function() {
        req.body = data;
        console.log("Guardado");
        console.log(req.body.length/1024);

       	fs.writeFile("hola.mp3", req.body,"binary",function (err) {
		  if (err) throw err;
		  console.log('It\'s saved!');
		});
    });
})

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
