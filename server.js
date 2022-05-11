/*********************************************************************************
* WEB700 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Gokul Radhakrishnan Student ID: 142787217 Date:  08 April 2022
*Online (Heroku) Link: https://webappgokul.herokuapp.com/about

********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const exphbs = require("express-handlebars");
var app = express();
const path = require("path");
var userData = require("./modules/collegeData.js");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.use(function(req,res,next){
 let route = req.path.substring(1);
 app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
 next();
});

app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    helpers: {navLink : function(url, options){
        return '<li' +
        ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
        '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
        return options.inverse(this);
        } else {
        return options.fn(this);
        }
        }
}
}));


app.get("/students", (req, res) => {


 if(req.query.course !=null){
    userData.getStudentsByCourse(req.query.course).then(function(resolvedvalue){
        
        res.render("students",{students:resolvedvalue});
        
        }).catch(function(err){
            res.render("students", {message: err});
        })
    
    
    }else{

userData.getAllStudents().then(function(resolvedvalue){
    
    if(resolvedvalue.length> 0){
        
    res.render("students",{students:resolvedvalue});
   } else{

    res.render("students", {message: "no results"})

   }
   
   }).catch(function(err){
    res.render("students", {message: "no results"});
   });}
   

});





app.set("view engine", ".hbs");

app.get("/tas", (req, res) => {
    
    userData.getAs().then(function(resolvedvalue){

            
            res.json(resolvedvalue);
         
          }).catch(function(err){
              res.json({messag:err}) 
            })});
        
app.get("/courses", (req, res) => {
           
                userData.getCourses().then(function(resolvedvalue){
                 
                    if(resolvedvalue.length > 0){
                    res.render("courses",{courses:resolvedvalue});

                    } else{
                        res.render("courses", {message: "no results"})
                    }
                    
                    }).catch(function(err){
                        res.render("courses", {message: "no results"})
                    })
                });

 
//  app.get("/student/:num", (req, res) => {
                
//                     userData.getStudentByNum(req.params.num).then(function(resolvedvalue){
//                         res.render("student", { student: resolvedvalue });;
                        
//                         }).catch(function(err){
//                             res.json({message:err})
//                         })
//                     });
                    
                
     
app.get("/", (req, res) => {

    res.render("home")

});



app.get("/about", (req, res) => {

    res.render( "about");

});


app.get("/htmlDemo", (req, res) => {

    res.render("htmlDemo")

});

app.get("/students/add", (req, res) => {

    userData.getCourses().then(
        function(data){
            res.render("addStudent", {courses: data})}).catch(function(err){res.render("addStudent", {courses: []})}
            );
             

});

app.post("/students/add", (req, res) => {


    req.body.TA = (req.body.TA) ? true : false;
    userData.addStudent(req.body).then(function(){
       res.redirect('/students')
        
        })

});


app.get("/courses/add", (req, res) => {

    res.render("addCourse");

});


app.post("/courses/add", (req, res) => {
    req.body.TA = (req.body.TA) ? true : false;
    userData.addCourse(req.body).then(function(){
       res.redirect('/courses')
        
        })

});




 
app.get("/courses/course/", (req, res) => {
                
    userData.getCourseById(req.query.courseId).then(function(resolvedvalue){

       
if(resolvedvalue.length = 0){

    res.status(404).send("Course Not Found");
} else {
    res.render("course", { course: resolvedvalue });

}
        
        }).catch(function(err){
            res.render("course", {message: "no results"})
        })
    });
    
app.post("/student/update", (req, res) => {
   
    req.body.TA = (req.body.TA) ? true : false;
    userData.updateStudent(req.body).then(res.redirect("/students"));
        
       });


 app.post("/course/update" , (req, res) => {
   
        req.body.TA = (req.body.TA) ? true : false;
        userData.updateCourse(req.body).then(res.redirect("/courses"))
            
           });
       


app.get("/course/delete", (req,res) => {
    userData.deleteCourseById(req.query.id).then(res.redirect("/courses")).catch(function(err){
        res.render("courses", {message: "Unable to Remove Course / Course not found"});
    });

});


app.get("/student/", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    userData.getStudentByNum(req.query.studentNum).then(function (data) {
     
        if (data) {
            viewData.student = data;
            viewData.student.studentNum = req.query.studentNum; //store student data in the "viewData" object as "student"
            
        } else {
            viewData.student = null; // set student to null if none were returned
        }
    }).catch((err) => {
        
        viewData.student = null; // set student to null if there was an error
    }).then(userData.getCourses()).then(function(data){
            
            viewData.courses = data; // store course data in the "viewData" object as "courses"
            // loop through viewData.courses and once we have found the courseId that matches
            // the student's "course" value, add a "selected" property to the matching
            // viewData.courses object
      
           
            for ( let i =0  ; i < viewData.courses.length; i++) {
                
                if (viewData.courses[i].courseId == viewData.student.courseID) {
                    viewData.courses[i].selected = true;
                    
                }
            }
        
        }).catch((err) => {
            
            viewData.courses = []; // set courses to empty if there was an error
        }).then(() => {
            if (viewData.student == null) { // if no student - return an error
                res.status(404).send("Student Not Found");
            } else {
                res.render("student", { viewData: viewData }); // render the "student" view
            }
        });
});


app.get("/student/delete", (req,res) => {
    userData.deleteStudentByNum(req.query.num).then(res.redirect("/students")).catch(function(err){
        res.render("courses", {message: "Unable to Remove student / student not found"});
    });

});


app.use((req,res,next)=>{
    res.status(404).send("404: Route not found"); 
});





userData.initialize().then(function(){

app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)})

}).catch(function(err){
    console.log(err)});


