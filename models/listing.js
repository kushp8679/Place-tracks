const mongoose = require('mongoose');
// const reviews = require('./reviews');
const Schema = mongoose.Schema;
const Review =require("./reviews");


const imageSchema = new Schema({
    
    url: {
        type: String,
        required: true
    },
   
});

// This  is listing Schema after This we will create a model 
const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image: {
        type: imageSchema,
        required: true
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
]
})

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
});


// Now Creating model

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;