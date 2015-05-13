/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var url = require('url');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var fs = require('fs');

// the ExpressJS App
var app = express();

// configuration of port, templates (/views), static files (/public)
// and other expressjs settings for the web server.

// server port number
app.set('port', process.env.PORT || 5000);

//  templates directory to 'views'
app.set('views', __dirname + '/views');

// setup template engine - we're using Hogan-Express
app.set('view engine', 'html');
app.set('layout','layout');
app.engine('html', require('hogan-express')); // https://github.com/vol4ok/hogan-express

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// connecting to database
//app.db = mongoose.connect(process.env.MONGOLAB_URI);
//console.log("connected to database");

// SET UP EMAIL //
var smtpTransport = nodemailer.createTransport('SMTP',{
	service: 'Gmail',
	auth: {
		user: process.env.EMAIL_CLIENT,
		pass: process.env.EMAIL_PASS
	}
})

var templatesDir = __dirname + '/email-templates';

// APP ROUTES //

// home page
app.get('/', function(req,res){
	res.render('index.html');
});

// app.get('/email', function(req,res){
// 	var url_parts = url.parse(req.url, true);
// 	var query = url_parts.query; // library for getting URL
// 	console.log(query);
// 	var userEmail = query.userEmail;

// });

app.post('/create/collection',function(req,res){
	

	console.log('new collection yay!')

	// what's their selection
	console.log(req.body);
	console.log('the images are ' + req.body['imagesToSend[]']);

	var imagesToSend = req.body['imagesToSend[]'];
	var email = req.body['email'];
	var username = req.body['Username'];
	var emailData = {};

	console.log('new username yay!',username)

	var obj;
	fs.readFile('./public/momadata.json', 'utf8', function (err, data) {
	  if (err) throw err;
	  obj = JSON.parse(data);

	  imagesToSend.forEach(function(e,i){
	  	obj.forEach(function(el){
	  		if(el.MoMA_Number==e){
	  			emailData['selection'+i] = {
	  				url: el.Img,
	  				name: el.Name,
	  				artist: el.Artist
	  			}
	  		}
	  	})
	  })

	  console.log(emailData);


	  // console.log(obj.email);
	 //  console.log(emailData);
	  sendEmail(emailData, email, username);

	});

	function sendEmail(data, email, name){

		console.log("Sending email");

		var today = new Date();
		today = (today.getMonth() + 1) + "-" + today.getDate() + "-" + today.getFullYear().toString().substr(2,2);


		// SEND EMAIL
		emailTemplates(templatesDir,function(err,template){
			if(err) console.log(err);
			else{
				var locals = {
					emailData: data, //variable name : data
					today: today,
					name: 'Leslie'
				};
				template('main-email', locals, function(err,html,text){
					if(err) console.log(err);
					var mailOptions = {
						to: email,
						// to: 'leslie.s.lin@gmail.com',
						from: 'A Day At The Museum <adayatthemuseum@gmail.com>',
						subject: 'Hi '+ name +' :Your Day at The Museum',
						html: html
					}
					// console.log('UserEmail');
					console.log('the data is ' + mailOptions.data);

					smtpTransport.sendMail(mailOptions, function(err,response){
						if(err) console.log(err);
						else{
							res.json({status:'SUCCESS'});
						}
					})
				})
			}
		})
		
	}

})


// create NodeJS HTTP server using 'app'
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});