const express =require("express");
// to  add the id no. which is child in oarent ({mergeParams: true});
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js"); 
const Listing =require("../models/listing.js");


const validateReview =(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
   
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);

    }else{
        next();
    }
};


// Reviews post route 

router.post("/", validateReview , wrapAsync(async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

     await newReview.save();
     await listing.save();

    //  console.log("New Reviews saved");
    //  res.send("The review is saved");


     res.redirect(`/listings/${listing._id}`);
   }));
    
// Delete Review route

router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
    


}))

module.exports = router;
