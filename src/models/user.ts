import mongoose from "mongoose";

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // immutable: true,
    
  },
  password: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
    max: 100,
  },
  bio: {
    type: String,
    // required: true,
    maxlength: 1000,
  },
},
{ timestamps: true });

const UserSchema = mongoose.models.user || mongoose.model("user", User);
//  const FruitsSchema = mongoose.models.fruit|| mongoose.model("fruit",Fruits)
export default UserSchema;
