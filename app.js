//call express framework to action
var express = require ("express");
//invoke the express package into action
var app = express();
//call the sql middleware to the action
var mysql = require('mysql');
//call the body parser to action
var bodyParser = require('body-parser')
//call the passport to action
var passport = require('passport');
//call the passport local to action
var LocalStrategy = require('passport-local').Strategy;
//call the local storage to action
var localStorage = require('node-localstorage');
//call the express section to action
var session  = require('express-session');
//call the cookieParser to action
var cookieParser = require('cookie-parser');
//call the flash to action
var flash = require('connect-flash');
//call the bcrypt in action
var bcrypt = require('bcrypt-nodejs');

//read cookies
app.use(cookieParser());

//call the access to body parser
app.use(bodyParser.urlencoded({ extended:true }));
//data parsing
app.use(express.urlencoded({ extended:false }));
app.use(express.json());

//use path module
const path = require('path');
//use nodmailer
const nodemailer = require('nodemailer');

//set default view engine
app.set("view engine", "ejs");

//requirments for passport
app.use(session({
  secret: 'secretdatakeythatyoucanchange',
	resave: true,
	saveUninitialized: true
 }));

app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());
// use connect-flash for flash messages stored in session
app.use(flash());


//call the file upload middleware
const fileUpload = require('express-fileupload');
app.use(fileUpload());

//call the access to the views folder and allow content to be rendered
app.use(express.static("views"));
//call the access to the scripts folder and allow the content to be rendered
app.use(express.static("css"));
//call the access to the images folder and allow the content to be rendered
app.use(express.static("images"));
//call the access to the partials folder and allow the content to be rendered
app.use(express.static("partials"));
//call the access to the lib folder and allow the content to be rendered
app.use(express.static("lib"));
//call the access to the javaScript folder and allow the content to be rendered
app.use(express.static("js"));
//call the access to the public folder and allow the content to be rendered
app.use(express.static(path.join(__dirname, '/public')));

//=====================================================================================//
//                                                                                     //
//  create connctivty to sql database (ADD DATABASE CREDENTIALS HERE)!!!!!!!!!!!!!!!!  //
//                                                                                     //
//=====================================================================================//

const db = mysql.createConnection ({
});

//check if application is connected to the MySQL database
db.connect((err) => {
  if(err){
    console.log("Failed to connect to MySQL databse.");
  }
  else {
    console.log("Connected to the MySQL database.");
  }
 });

//create a route to show all games
app.get('/showallgames', function(req, res){
  let sql = 'SELECT * FROM games'
  let query = db.query(sql, (err,res1) => {
    if (err) throw err;
    res.render('showallgames', {res1})
  });
});

//create a route to show all games
app.get('/games', function(req, res){
  let sql = 'SELECT * FROM games'
  let query = db.query(sql, (err,res1) => {
    if (err) throw err;
    res.render('games', {res1})
  });
});

//create a route to show all eBooks
app.get('/showallebooks', function(req, res){
  let sql = 'SELECT * FROM ebooks'
  let query = db.query(sql, (err,res2) => {
    if (err) throw err;
    res.render('showallebooks', {res2})
  });
});

//create a route to show all eBooks
app.get('/ebooks', function(req, res){
  let sql = 'SELECT * FROM ebooks'
  let query = db.query(sql, (err,res2) => {
    if (err) throw err;
    res.render('ebooks', {res2})
  });
});

//create a route to show all users
app.get('/allusers', function(req, res){
  let sql = 'SELECT * FROM users'
  let query = db.query(sql, (err,res1) => {
    if (err) throw err;
    res.render('allusers', {res1})
  });
});

//create a route to show all users
app.get('/users', function(req, res){
  let sql = 'SELECT * FROM users'
  let query = db.query(sql, (err,res1) => {
    if (err) throw err;
    res.render('users', {res1})
  });
});

//create a route to show all blog posts
app.get('/allposts', function(req, res){
  let sql = 'SELECT * FROM posts'
  let query = db.query(sql, (err,res2) => {
    if (err) throw err;
    res.render('allposts', {res2})
  });
});

//create a route to show all blog posts
app.get('/posts', function(req, res){
  let sql = 'SELECT * FROM posts'
  let query = db.query(sql, (err,res2) => {
    if (err) throw err;
    res.render('posts', {res2})
  });
});

//create a route to delete a game with specific id
app.get('/deletegame/:id',  isLoggedIn, function(req, res){
  let sql = 'DELETE FROM games WHERE Id= '+req.params.id+'';
  let query = db.query(sql, (err,res) => {
    if (err) throw err;
  });
  res.redirect('/showallgames')
});

//create a route to delete a eBook with specific id
app.get('/deleteebook/:id',  isLoggedIn, function(req, res){
  let sql = 'DELETE FROM ebooks WHERE Id= '+req.params.id+'';
  let query = db.query(sql, (err,res) => {
    if (err) throw err;
  });
  res.redirect('/showallebooks')
});

//create a route to delete a user with specific id
app.get('/deleteuser/:id', function(req, res){
  let sql = 'DELETE FROM users WHERE Id= '+req.params.id+'';
  let query = db.query(sql, (err,res) => {
    if (err) throw err;
  });
  res.redirect('/allusers')
});

//create a route to delete a blog post with specific id
app.get('/deletepost/:id',  isLoggedIn, function(req, res){
  let sql = 'DELETE FROM posts WHERE Id= '+req.params.id+'';
  let query = db.query(sql, (err,res) => {
    if (err) throw err;
  });
  res.redirect('/allposts')
});

//create a route to create a game
app.get('/creategames',  isLoggedIn, isAdmin, function(req, res){
  res.render('creategames')
});

//create a route to create a eBook
app.get('/createebooks',  isLoggedIn, isAdmin, function(req, res){
  res.render('createebooks')
});

//create a route to create a post
app.get('/createposts',  isLoggedIn, isAdmin, function(req, res){
  res.render('createposts')
});

//route to post new game
app.post('/creategames',  isLoggedIn, isAdmin, function(req, res){
  let sampleFile = req.files.sampleFile
  filename = sampleFile.name
  //use file upload middleware to transfer the data from the form to desired location
  sampleFile.mv("./images/" + filename, function(err){
    if(err)
    return res.status(500).send(err);
    console.log("Image is " + req.files.sampleFile)
//    res.redirect('/');
  });

   let sql = 'INSERT INTO games (Name, Image, Genre, Type, ControllerSupport, SteamAchivments, MetacriticScore, Description, Price) VALUES ("'+req.body.name+'", "'+filename+'", "'+req.body.genre+'", "'+req.body.type+'", "'+req.body.controllerSupport+'", "'+req.body.SteamAchivments+'", "'+req.body.MetacriticScore+'", "'+req.body.description+'", '+req.body.price+');'
   let query = db.query(sql, (err,res) => {
     if (err) throw err;
   });
   res.redirect("/showallgames")
});

//route to post new eBook
app.post('/createebooks',  isLoggedIn, isAdmin, function(req, res){
  let sampleFile = req.files.sampleFile
  filename = sampleFile.name
  //use file upload middleware to transfer the data from the form to desired location
  sampleFile.mv("./images/" + filename, function(err){
    if(err)
    return res.status(500).send(err);
    console.log("Image is " + req.files.sampleFile)
//    res.redirect('/');
  });

  let sql = 'INSERT INTO ebooks (Name, Image, Genre, PrintLength, Language, Description, Price) VALUES ("'+req.body.name+'", "'+filename+'", "'+req.body.genre+'", "'+req.body.printLength+'", "'+req.body.language+'", "'+req.body.description+'", '+req.body.price+');'
  let query = db.query(sql, (err,res) => {
     if (err) throw err;
   });
   res.redirect("/showallebooks")
});

//route to post new post on blog
app.post('/createposts',  isLoggedIn, isAdmin, function(req, res){
   let sql = 'INSERT INTO posts (Title, Text) VALUES ("'+req.body.title+'", "'+req.body.text+'");'
   let query = db.query(sql, (err,res) => {
     if (err) throw err;
   });
   res.redirect("/allposts")
});

//call get request on the /about url of application
app.get("/about", function(req, res){
  res.render("about.ejs");
});

//call get request on the / url of application
app.get("/", function(req, res){
  res.render("index.ejs");
});

//route to edit games
app.get("/editgames/:id",  isLoggedIn, isAdmin, function(req, res){
  let sql = 'SELECT * FROM games WHERE Id = "'+req.params.id+'"';
  let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    res.render('editgames', {res1});
  });
});

//route to edit eBooks
app.get("/editebooks/:id",  isLoggedIn, isAdmin, function(req, res){
  let sql = 'SELECT * FROM ebooks WHERE Id = "'+req.params.id+'"';
  let query = db.query(sql, (err, res2) => {
    if(err) throw err;
    res.render('editebooks', {res2});
  });
});

//route to edit users
app.get('/editusers/:id',  isLoggedIn, isAdmin, function(req, res){
  let sql = 'SELECT * FROM users WHERE Id = "'+req.params.id+'"';
  let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    res.render('editusers', {res1});
  });
});

//route to edit posts
app.get('/editposts/:id',  isLoggedIn, isAdmin, function(req, res){
  let sql = 'SELECT * FROM posts WHERE Id = "'+req.params.id+'"';
  let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    res.render('editposts', {res1});
  });
});

//Post request URL to edit game with specific id
app.post('/editgames/:id',  isLoggedIn, isAdmin, function(req, res){
  let sampleFile = req.files.sampleFile
  filename = sampleFile.name;
  sampleFile.mv('./images' + filename, function(err){
    if(err)
    return res.status(500).send(err);
    console.log("Image is " + req.files.sampleFile)
  });

  let sql = 'UPDATE games SET Name = "'+req.body.name+'", Image = "'+filename+'", Genre = "'+req.body.genre+'", Type = "'+req.body.type+'", ControllerSupport = "'+req.body.controllerSupport+'", SteamAchivments =  "'+req.body.SteamAchivments+'", MetacriticScore = "'+req.body.MetacriticScore+'", Description = "'+req.body.description+'", Price = "'+req.body.price+'" WHERE id = "'+req.params.id+'";'
  let query = db.query(sql, (err,res) => {
    if (err) throw err;
  });
  res.redirect("/showallgames")
});

//Post request URL to edit ebook with specific id
app.post('/editebooks/:id',  isLoggedIn, isAdmin, function(req, res){
  let sampleFile = req.files.sampleFile
  filename = sampleFile.name;
  sampleFile.mv('./images' + filename, function(err){
    if(err)
    return res.status(500).send(err);
    console.log("Image is " + req.files.sampleFile)
  });

  let sql = 'UPDATE ebooks SET Name = "'+req.body.name+'", Image = "'+filename+'", Genre = "'+req.body.genre+'", PrintLength = "'+req.body.printLength+'", Language = "'+req.body.language+'", Description = "'+req.body.description+'", Price = "'+req.body.price+'" WHERE id = "'+req.params.id+'";'
  let query = db.query(sql, (err,res) => {
    if (err) throw err;
   });
   res.redirect("/showallebooks")
});

app.post('/editusers/:id',  isLoggedIn, isAdmin, function(req, res){
  let sql = 'UPDATE users SET username = "'+req.body.username+'", email = "'+req.body.email+'", password = "'+req.body.password+'", admin = "'+req.body.admin+'" WHERE id = "'+req.params.id+'";'
  let query = db.query(sql, (err, res) => {
    if(err) throw err;
    console.log(res);
  });
  res.redirect("/allusers");
  });

//Post request URL to edit posts with specific id
app.post('/editposts/:id',  isLoggedIn, isAdmin, function(req, res){
   let sql = 'UPDATE posts SET title = "'+req.body.title+'", text = "'+req.body.text+'" WHERE id = "'+req.params.id+'";'
   let query = db.query(sql, (err,res) => {
      if (err) throw err;
    });
    res.redirect("/allposts")
});

//route to individual game
app.get('/showgame/:id', function(req, res){
  let sql = 'SELECT * FROM games WHERE Id = '+req.params.id+' '
  let query = db.query(sql, (err,res1) => {
    if(err) throw err;
    res.render('showgame', {res1})
  });
});

//route to individual eBook
app.get('/showebook/:id', function(req, res){
  let sql = 'SELECT * FROM ebooks WHERE Id = '+req.params.id+' '
  let query = db.query(sql, (err,res1) => {
    if(err) throw err;
    res.render('showebook', {res1})
  });
});

//app to render image upload page
app.get('/upload', function(req,res){
  res.render('upload')
});

// post request to upload an image
app.post('/upload',function(req, res){
  let sampleFile = req.files.sampleFile
  filename = sampleFile.name
  //use file upload middleware to transfer the data from the form to desired location
  sampleFile.mv("./images/" + filename, function(err){
    if(err)
    return res.status(500).send(err);
    console.log("Image is " + req.files.sampleFile)
    res.redirect('/');
  });
});

//call get request on the /about url of application
app.get("/about", function(req, res){
  res.render("about.ejs");
  consol.log("You are on the way to the about page.")
});

//call get request on the /free-game url of application
app.get("/free-game", isLoggedIn, function(req, res){
  res.render("free-game.ejs");
});

//search games by name and genre, show results on same page
app.post("/searchgames", function(req, res){
  let sql = 'SELECT * FROM games WHERE name LIKE "%'+req.body.search+'%";'
  let query = db.query(sql, (err, res1) => {
    if (err) throw err;
    res.render('games', {res1})
  });
});

//search eBooks by name and genre, show results on same page
app.post("/searchebooks", function(req, res){
  let sql = 'SELECT * FROM ebooks WHERE name LIKE "%'+req.body.search+'%";'
  let query = db.query(sql, (err, res2) => {
    if (err) throw err;
    res.render('ebooks', {res2})
  });
});

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//contact us page
app.get('/contact', (req,res) => {
  res.render('contact');
});

//create route register
app.get('/register', function(req, res) {
  // render the page and pass in any flash data if it exists
  res.render('register.ejs');
});

//create route register
app.get('/admin', isLoggedIn, isAdmin, function(req, res) {
  // render the page and pass in any flash data if it exists
  res.render('admin.ejs');
});

//process the signup form
  app.post('/register', passport.authenticate('local-signup', {
  //redirect to the secure profile section
  successRedirect : '/profile',
  //redirect back to the signup page if there is an error
  failureRedirect : '/register',
  //allow flash messages
  failureFlash : true
}));


// ==========================================================================|
 // passport session setup ==================================================|
 // =========================================================================|
 // required for persistent login sessions
 // passport needs ability to serialize and unserialize users out of session

 // used to serialize the user for the session
 passport.serializeUser(function(user, done) {
     done(null, user.Id);
 });

 // used to deserialize the
 passport.deserializeUser(function(Id, done) {
    db.query("SELECT * FROM users WHERE Id = ? ",[Id], function(err, rows){
         done(err, rows[0]);
     });
 });


passport.use(
     'local-signup',
     new LocalStrategy({
         // by default, local strategy uses username and password, we will override with email
         usernameField : 'username',
         passwordField : 'password',
         passReqToCallback : true // allows us to pass back the entire request to the callback
     },
     function(req, username, password, done) {
         db.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
             if (err)
                 return done(err);
             if (rows.length) {
                 return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
             } else {
                 var newUserMysql = {
                     username: username,
                     email: req.body.email,
                     password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                 };

                 var insertQuery = "INSERT INTO users ( username, email, password ) values (?,?,?)";

                 db.query(insertQuery,[newUserMysql.username, newUserMysql.email, newUserMysql.password],function(err, rows) {
                     newUserMysql.Id = rows.insertId;

                     return done(null, newUserMysql);
                 });
             }
         });
     })
 );

//get route to user profile after login
 app.get('/profile', isLoggedIn, function(req, res) {
   res.render('profile', {
     user : req.user // get the user out of session and pass to template
   });
 });

//get route to log out
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

//route to get login
app.get('/login', function(req, res) {
  // render the page and pass in any flash data if it exists
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

//route to post login
app.post('/login', passport.authenticate('local-login', {
  // redirect to the secure profile section
  successRedirect : '/profile',
  // redirect back to the signup page if there is an error
  failureRedirect : '/login',
  // allow flash messages
  failureFlash : true
}),

function(req, res) {
  console.log("hello");
  if (req.body.remember) {
    req.session.cookie.maxAge = 1000 * 60 * 3;
  } else {
    req.session.cookie.expires = false;
  }
  res.redirect('/');
});

// =========================================================================
 // LOCAL LOGIN =============================================================
 // =========================================================================

passport.use(
  'local-login',
  new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
  },

  function(req, username, password, done) {
    db.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){

      if (err)
        return done(err);

      if (!rows.length) {
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      }

      if (!bcrypt.compareSync(password, rows[0].password))
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
        return done(null, rows[0]);
    });
}));

//check if user is logged in -> if logged in carry on, if not logged in reddirect to login page
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}

function isAdmin(req, res, next) {
	// if user is authenticated as admin in the session, carry on
	if (req.user.admin)
	  return next();
	// if they aren't redirect them to the login
	res.redirect('/');
}

//listen on port defined in .env or default 3000
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("Application is live!");
});
