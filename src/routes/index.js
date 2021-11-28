const express = require('express');
const router = express.Router();
const fs = require('fs');
const uuidv4 = require('uuid/v4');

const  credential = {
  email : "daniel@gmail.com",
  password : "daniel"
}

const  credential2 = {
  email : "Usuario@gmail.com",
  password : "User1"
}

const json_Comics = fs.readFileSync('src/Comics.json', 'utf-8');
let Comics = JSON.parse(json_Comics);

router.get('/', (req, res) =>{
  res.render('Login', { title : "Inicie Sesion"});
})

router.post('/login', (req, res)=>{
  if(req.body.email == credential.email && req.body.password == credential.password){
      req.session.user = req.body.email;
      res.redirect('/index');
  }
  else if(req.body.email == credential2.email && req.body.password == credential2.password){
    req.session.user = req.body.email;
    res.redirect('/indexUser');
    
  }else{
      res.end("Invalid Username")
  }
});
router.get('/index', (req, res) => {
  res.render('index', { Comics});
});

router.get('/indexUser', (req, res) => {
  res.render('indexUser', { Comics});
});

router.get('/newComic', (req, res) => {
  res.render('newComic');
});

router.post('/newComic', (req, res) => {

  const { title, gender, image, autor, description } = req.body;

  if (!title || !gender ||  !image  || !autor || !description) {
    res.status(400).send("Entries must have a title and body");
    return;
  }

  var newComic = {
    id: uuidv4(),
    title,
    gender,
    autor,
    image,
    description
  };

  // añadir una nuevo comic
  Comics.push(newComic);

  // guardando en un archivo el comic
  const json_Comics = JSON.stringify(Comics);
  fs.writeFileSync('src/Comics.json', json_Comics, 'utf-8');

  res.redirect('/index');
});

router.get('/Buy/:id', (req, res) => {
  Comics = Comics.filter(Comics => Comics.id != req.params.id);
  // guardando
  const json_Comics = JSON.stringify(Comics);
  fs.writeFileSync('src/Comics.json', json_Comics, 'utf-8');

  res.redirect('/indexUser')
});

router.get('/delete/:id', (req, res) => {
  Comics = Comics.filter(Comics => Comics.id != req.params.id);
  // guardando
  const json_Comics = JSON.stringify(Comics);
  fs.writeFileSync('src/Comics.json', json_Comics, 'utf-8');

  res.redirect('/index')
});

module.exports = router;