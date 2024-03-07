const mysql = require("mysql2");
const express = require('express')
const app = express()
const path = require('path');
const { error } = require("console");
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use(express.urlencoded({extended:true}))

app.set("view engine","ejs")
app.set("views", path.join(__dirname,"/views"))

//app.use(express.static(path.join(__dirname,"public")))

const connection = mysql.createConnection({
    host: "localhost",
    user:"root",
    database:"timetable",
    password:"74269"
});

connection.connect(function(err){
    if(err){
        console.error('error in connection'+err.stack);
        return;
    }
    console.log('connected as id'+connection.threadId)
});

app.listen(3000,()=>{
    console.log("connection is done")
  })
  
  app.get("/login",(req,res)=>
  {
    res.render("login.ejs");
  })
  app.get("/login/editpasswd",(req,res)=>
  {
    res.render("edit.ejs");
  })

  app.post('/login', (req, res) => {
    let { username, password } = req.body;
    let q = `SELECT * FROM login WHERE name='${username}' AND password='${password}'`;
    try {
        connection.query(q, function (err, result) {
            if (err) throw err;
            let user = result[0];
            if (!user || (password !== user.password || username !== user.name)) {
                res.send("Invalid username/password");
            } else {
                let q1 = `SELECT * FROM timetable WHERE faculty='${username}'`;
                try {
                    connection.query(q1, function (err, result) {
                        if (err) throw err;
                        res.render("timetable.ejs", { result });
                    });
                } catch (err) {
                    res.send("Error in database");
                }
            }
        });
    } catch (err) {
        res.send("Error in database");
    }
});

app.patch('/login/editpasswd', (req, res) => {
    let { username,password,password1} = req.body;
    let q = `SELECT * FROM login WHERE name='${username}' `;
    try {
        connection.query(q, function (err, result) {
            if (err) throw err;
            let user = result[0];
            if(password!==user.password)
            {
                res.send("wrong password");
            }
            else
            {
                let q2=`update login set password='${password1}'`
                connection.query(q2,function(error,result)
                {
                  if(error)throw error;
                  res.send("password changed successfully");
                })  
            }
        });
    } catch (err) {
        res.send("Error in database");
    }
    app.get("/login/labs",(req,res)=>
    {
         console.log("s")
        let q = `select distinct class_no from timetable where type="lab"`;
        try {
            connection.query(q, function (err, result) {
                if (err) throw err;
                let user = result;
               console.log(user)
              res.render("labs.ejs",{user});
            });
        } catch (err) {
            res.send("Error in database");
        }   
    })
});
