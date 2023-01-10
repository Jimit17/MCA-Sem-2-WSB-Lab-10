var express = require('express');
var router = express.Router();
var mysql = require('mysql');

//Database connection
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'deleazzy'
});
connection.connect(function(err){
  if(!err){
    console.log("Database is connected");
  }
  else{
    console.log("Error in connecting database");
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/add', function(req, res, next) {
  res.render('add-form');
});

/* POST Data. */
router.post('/add', function(req, res, next) {
  console.log(req.body);

  //Variables with data
  var u_name= req.body.u_name;
  var u_mail= req.body.u_mail;
  var u_phone= req.body.u_phone;
  var u_sex= req.body.u_sex;
  var u_age= req.body.u_age;

  connection.query("insert into users(UName,UMail,UPhone,USex,UAge) values (?,?,?,?,?)",[u_name,u_mail,u_phone,u_sex,u_age],function(err,result){
    if(err) throw err;
    console.log("Record Inserted");
    res.redirect('/display');
  });
});

//List Table Data
router.get('/display', function(req, res) {
  connection.query("Select * from users",function(err,result){
    if(err) throw err;
    console.log(result);
    res.render('display-table', {users:result});
  });
});

/* GET SINGLE User BY ID */
router.get('/edit/:UID', function(req, res) {
  var user_id = req.params.UID;
  console.log("ID being edited: "+user_id);
  connection.query("select * from users WHERE UID = ?",[user_id], function(err, result) {
      if (err) {
          console.log(err);
      } else {
          console.log(result);
          res.render('edit-form', { users: result });
      }
  });
});

/* UPDATE User Details */
router.post('/edit/:UID', function(req, res) {
  var user_id = req.params.UID;
  console.log("Edited ID is: "+user_id);
  var u_name= req.body.u_name;
  var u_mail= req.body.u_mail;
  var u_phone= req.body.u_phone;
  var u_sex= req.body.u_sex;
  var u_age= req.body.u_age;
  connection.query("update users set UName=?,UMail=?,UPhone=?,USex=?,UAge=? where UID=?",[u_name,u_mail,u_phone,u_sex,u_age,user_id], function(err) {
    if(err) throw err;
    console.log("Record Updated");
    res.redirect('/display');
  });
});

/* DELETE User BY ID */
router.get('/delete/:UID', function(req, res) {
  var user_id = req.params.UID;
  console.log("Deleted ID is: "+user_id);
  connection.query("delete from users where UID = ?",[user_id], function(err) {
    if(err) throw err;
    console.log("Record Deleted");
    res.redirect('/display');
  });
});

//GET Search User
router.get('/search', function(req, res, next) {
  res.render('search-data');
});

/* Search for User */
router.post('/search', function(req, res) {
  var u_id= req.body.u_id;
  console.log("Searched ID is: "+u_id);
  connection.query("select * from users WHERE UID = ?",[u_id], function(err,result) {
    if(err) throw err;
    console.log(result);
    res.render('display-table', {users:result});
  });
});

module.exports = router;
