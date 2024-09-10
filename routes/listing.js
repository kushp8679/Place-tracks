const express =require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
// using  joi to detect the schema validation error;
const {listingSchema} = require("../schema.js");


const validateListing =(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
   
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
        
    }else{
        next();
    }
};
// Index route

router.get("/",wrapAsync( async(req,res)=>{
    const allListings = await  Listing.find({});
    console.log(allListings);
    res.render("listings/index.ejs",{allListings});
   
    }));


     //NEw route

     router.get("/new",(req,res)=>{
        res.render("listings/new.ejs");
    });
    

    // Show route
    router.get("/:id",wrapAsync( async (req,res)=>{
        let{id} = req.params;
        const listing = await Listing.findById(id).populate("reviews");
        
        res.render("listings/show",{listing});
    }))  ;   





    // create route
//using try catch block here  as middlewaresover here(These all are asyn error .) but wrapasync is much more effiecient way to handle the error
   //status code in ExpressError is 400 which means bad request  means the error is from the client side 
   router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
            
                
            const newListing = new Listing(req.body.listing);
            
            await newListing.save();
            res.redirect("/listings");
       
      
    }));





   //Edit route
   router.get("/:id/edit", wrapAsync(async(req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit",{listing});
   }));




   //update route
   router.put("/:id" ,validateListing, wrapAsync(async(req,res)=>{
   
    let{id} = req.params;
    // decounstructing the obj of listing ... <-Through this
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
   }));



   //Delete route

   router.delete("/:id",wrapAsync(async(req,res)=>{
    let{id} = req.params;
    const deleteListings = await Listing.findByIdAndDelete(id);
    console.log(deleteListings);
    res.redirect("/listings");

   }));

   module.exports=router;