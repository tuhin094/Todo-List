const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
// const { home } = require("nodemon/lib/utils");
// const { redirect } = require("express/lib/response");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
mongoose.connect('mongodb+srv://Tuhin:tuhindata-123@cluster0.qfewo.mongodb.net/todoDB');

const lists = mongoose.Schema({
    name: String
});

const userInputSchema = mongoose.Schema({
    list_name: String,
    lists: [lists]
});

const UserInputs = new mongoose.model("userinput",userInputSchema);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
    console.log("Server is running at port 3000");
});

app.get("/", function (req, res) {
    // res.render("login");
    let today = date.getDay();
    UserInputs.findOne({list_name:"Home"},function(err,iuser){
        if(!err){
            if(iuser){
                res.render("list", { currday: iuser.list_name, listItem: iuser.lists});
            }
            else{
                const userinput = new UserInputs({
                    list_name: "Home"
                });
                
                userinput.save();
                res.redirect("/");
            }
        }
        else{
            console.log(err);
        }
    });
});

app.get("/:urlName",function(req,res){
    let coustomLIstName = _.capitalize(req.params.urlName);
    if(coustomLIstName === "About" ){
        res.render("about");
    }
    else{
        UserInputs.findOne({list_name: coustomLIstName},function(err,element){
            if(!err){
                if (element){
                    res.render("list", { currday: element.list_name, listItem: element.lists});
                }
                else{
                    const userInputs = new UserInputs({
                        list_name: coustomLIstName
                    }).save();

                    res.redirect("/"+coustomLIstName);
                }
            }
        });
    }
});

// app.post("/login",function(req,res){
//     let userName = req.body.loginUsername;
//     let password = req.body.loginPassword;
//     res.redirect("/"+userName+password);
// });

app.post("/",function(req,res){
    let itemName = req.body.newItem;
    let listname = req.body.Addbutton;

    if(listname === "Home"){
        UserInputs.findOne({list_name: "Home"},function(err,element){
            if(!err){
                element.lists.push({name: itemName});
                element.save();
                res.redirect("/");
            }
            else{
                console.log(err);
            }
        });
    }
    else{
        UserInputs.findOne({list_name: listname},function(err,element){
            if(!err){
                element.lists.push({name: itemName});
                element.save();
                res.redirect("/"+listname);
            }
            else{
                console.log(err);
            }
        });
    }
});

app.post("/delete",function(req,res){
    let listname = req.body.Listname;
    let listid = req.body.checkBox;

    UserInputs.findOneAndUpdate({list_name: listname}, {$pull: {lists: {_id: listid}}}, function(err,foundList){
        if(!err){
            console.log("Successfully deleted "+ listid + " from "+listname);
            if(listname == "Home"){
                res.redirect("/");
            }
            else{
                res.redirect("/"+listname);
            }
        }
        else{
            console.log(err);
        }
    });
});