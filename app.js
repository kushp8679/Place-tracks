const express = require("express");
const app = express();
const mongoose = require('mongoose');


const path = require("path");
const methodOverride =require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");
   

const listings =require("./routes/listing.js");
const reviews = require("./routes/review.js");



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

//the below is writen to pars the id from the route
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main().then(()=>{
    console.log("connected to Db");
})
.catch((err) => {
    console.log(err);

})

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wnaderlust');

  
}



app.get("/",(req,res)=>{
   res.render("/listings");
})











// all code is shifted to listing.js  folder in  routes file

app.use("/listings",listings);

//all code is shifted to review file in routes folder
app.use("/listings/:id/reviews",reviews);










//This will came in existense when if the user send any route which is not matching with the above given route the this will be applied then the next page will be directed to th ExpressError funtion of another file .
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

// midle ware define handel the server side error if the userhave send some price in string and mongodb is giving some error then who to hadle

app.use((err,req,res,next)=>{
    let{statusCode=500, message="Some thing went wrong" }= err;
    res.status(statusCode).render("error.ejs",{ message });

  //  res.status(statusCode).send(message);
});




const port = 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});