var express = require('express');
var bodyParser = require('body-parser');
var envoi = require('../api-tutorama/app/models/todo');

var connection = require('./app/config/connection');
var routes = require('./app/controllers/routes');
const todo = require('../api-tutorama/app/models/todo');
const cookieParser=require("cookie-parser");
const cors=require('cors');

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.get('/cookie', function(req, resp) {
  console.log(req.cookies['bataillenavale']);
  resp.send({ status: 0, message: "ok" + req.cookies['bataillenavale'] });
})
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

// Set Views
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('', (req, res) => {
    res.render('index', { text: 'This is EJS'})
})

app.get('/about', (req, res) => {
    res.render('about', { text: 'About Page'})
})
app.get('/connexion', (req, res) => {
  res.render('connexion')
})

app.get('/loginpage', (req, res) => {
  res.render('login')
})

app.get('/panier', (req, res) => {
  res.send('aaa')
})

app.post('/upload', async (req, res) => {
  try {
    console.log(req);
    
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
          let data = []; 
  
          //loop all files
          _.forEach(_.keysIn(req.files.photos), (key) => {
              let photo = req.files.photos[key];
              
              //move photo to uploads directory
              photo.mv('./public/img' + photo.name);
              
              //push file details
              data.push({
                  name: photo.name,
                  mimetype: photo.mimetype,
                  size: photo.size
              });
          });
  
          //return response
          res.send({
              status: true,
              message: 'Files are uploaded',
              data: data
          });
      }
  } catch (err) {
      res.status(500).send(err);

  }
});

connection.init();
routes.configure(app);

var server = app.listen(8000, function(){
  console.log('Server listening on port ' + server.address().port);
});
