const Sequelize = require('sequelize');
var sequelize = new Sequelize('d74t0fdvttsqka', 'nkimoiuimyzwjp', 'fa84c88ebaa398fcb3135ea3366b1e5fc48f7f007ec9871ac6b6724224eebaef', {
 host: 'ec2-34-231-63-30.compute-1.amazonaws.com',
 dialect: 'postgres',
 port: 5432,
 dialectOptions: {
 ssl: { rejectUnauthorized: false }
 },
 query:{ raw: true },
 logging: false // turn off sql output in console
});

var student = sequelize.define('student', {
    studentnum : { 
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email : Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity : Sequelize.STRING,
    addressProvince :  Sequelize.STRING,
    TA : Sequelize.BOOLEAN,
    Status : Sequelize.STRING,
    courseID :  Sequelize.STRING
},{
    createAT: false,
    updateAt: false
});

var course =  sequelize.define('course', {
    courseId : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode : Sequelize.STRING,
    courseDescription : Sequelize.STRING
},{

    createAT: false,
    updateAt : false
});




course.hasMany(student, {foreign: 'course'});

module.exports.initialize =  function (){ // sync the database with our models
        return new Promise((resolve,reject)=>{
            sequelize.sync().then(()=>{


                resolve();
            }).catch(err=>{
                reject(err);
            })
        });
    };





module.exports.getAllStudents = function(){

    return new Promise(function (resolve, reject) {

        student.findAll({
            attributes: [ "studentnum", "firstName","lastName","email", "addressStreet","addressCity","addressProvince" ,"TA","Status","courseID" ] // exclude createdAt & updatedAt
        }).then(students=>{ 
            resolve(students);
        }).catch(err=>{
            reject("No results returned");
        })

       });
        
    
}


module.exports.getCourses = function(){

    return new Promise(function (resolve, reject) {

        course.findAll({
            attributes: ["courseId","courseCode","courseDescription"],
            
        }).then(function(courses){
            

            resolve(courses);
        }).catch(err=>{
            
            reject("No results returned");
        })

       });
       
    
};

module.exports.getAs = function(){

    return new Promise(function (resolve, reject) {
        reject();
       });
       
                       
                     
                            };



module.exports.getStudentsByCourse = function(courseid){

    return new Promise(function (resolve, reject) {

        student.findAll({
            attributes: ["studentnum", "firstName","lastName","email", "addressStreet","addressCity","addressProvince" ,"TA","Status","CourseID"], // exclude createdAt & updatedAt
            where: { 
                courseID : courseid
            }
        }).then(function(resolvedvalue){

            
            resolve(resolvedvalue[0]);
        }).catch(err=>{
            reject("No results returned");
        })
        reject();
       });
       
       
       
            };

module.exports.getStudentByNum = function (num) {

    return new Promise(function (resolve, reject) {

        student.findAll({
            attributes: ["studentnum", "firstName","lastName","email", "addressStreet","addressCity","addressProvince" ,"TA","Status", "courseID"], // exclude createdAt & updatedAt
            where: {
                studentnum: num
            }
        }).then(
            function (students) {
           
                resolve(students[0]);
            }
            // 
        ).catch(err => {
            reject("No results returned");
        })
        //reject();
    });
};



              


module.exports.addStudent = function(studentData){

studentData.TA = (studentData.TA) ? true : false;

for(const prop in studentData){
    if(`${studentData[prop]}` == ("")){
      studentData[prop] = null;
     }
   
  }

return new Promise(function (resolve, reject) {
student.create(studentData).then(

    function(){
        
        resolve()
    }
    ).catch(err=>{
            reject("Unable to create student");
        });
   
    })};




        
module.exports.getCourseById = function(courseid){
   
    return new Promise(function (resolve, reject) {

        course.findAll({
            attributes: ["courseId", "courseCode","courseDescription"], // exclude createdAt & updatedAt
            where: { 
                courseId : courseid
            }
        }).then((resolvedvalue)=>{
            resolve(resolvedvalue[0]);
        }).catch(err=>{
            reject("No results returned");
        })
        //reject();
       });
       
            };



// module.exports.updateStudent = function(studentData) {
  
// studentData.TA = (studentData.TA) ? true : false;

// // for (const prop in studentData) {
// //   for(var i = 0; i< student.prop.length; i++)
// //     if(studentData.prop[i] == " "){
// //         student.prop[i] = NULL;

// //   }
// // }

// return new Promise((resolve,reject)=>{
//     student.update(studentData, {
//     where: {
//         studentnum: studentData.studentNum  
//     }

// }).then(resolve()).catch(err=>{
//             reject("Unable to update student");
//         });
   
       
// })};





module.exports.updateStudent = function(studentData){
    studentData.TA = (studentData.TA) ? true : false;
    
    for(const prop in studentData){
        if(`${studentData[prop]}` == ("")){
          studentData[prop] = null;
         }
       
      }
    return new Promise((resolve,reject)=> {student.update(studentData,{
        
        where: {
            studentnum : studentData.studentNum
        }
    }).then(resolve()).catch(err=>{
                  reject("Unable to update student");
              }); })


}






module.exports.addCourse = function(courseData){

    for(const prop in courseData){
        if(`${studentData[prop]}` == ("")){
            courseData[prop] = null;
         }
       
      }
      
    return new Promise((resolve,reject)=> {

     
        course.create(courseData).then(
                  resolve()
                  
                  ).catch(err=>{
                  reject("Unable to create course");
              })

            });
        }


      


module.exports.updateCourse = function(courseData){

    
    for(const prop in courseData){
        if(`${studentData[prop]}` == ("")){
            courseData[prop] = null;
         }
        
      }
  
    return new Promise((resolve,reject)=> {course.update(courseData,{
        
        where: {
            courseId: courseData.courseId
        }
    }).then(resolve()).catch(err=>{
                  reject("Unable to update course");
              }); })


}

module.exports.deleteCourseById = function(ID){

    return new Promise((resolve,reject)=>{
        course.destroy({
            where: {
                courseId: ID
            }
        }).then(()=>{
            resolve("Course detroyed");
        }).catch(err=>{
            reject(err);
        })
    });


}

module.exports.deleteStudentByNum  = function(studentNum){
    
        return new Promise((resolve,reject)=>{
            student.destroy({
                where: {
                    studentnum: studentNum
                }
            }).then(()=>{
                resolve("Course detroyed");
            }).catch(err=>{
                reject(err);
            })
        });
    
    
    }




