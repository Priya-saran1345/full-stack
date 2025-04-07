import mongoose from "mongoose";

const Fruits=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    weight:{
        type:Number,
    },
    color:{
        type:String,
        // required:true,
    }
    ,
    price:{
        type:Number,
        required:true,
        default:0,
    },
    weather:{
        type:String,
        
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true 
    }
})
const FruitsSchema = mongoose.models.fruit|| mongoose.model("fruit",Fruits)
export default FruitsSchema
