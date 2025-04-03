import mongoose from 'mongoose';
export async function connect() {
    try{
mongoose.connect(process.env.mongo_url!);
const connection=mongoose.connection;
connection.on('connected',()=>{
    console.log('we are successfully connected with the database');
})
connection.on('error',(error:"string")=>{
    console.log("error is this"+error);
    process.exit();
})
    }
    catch(error){
        console.log('something is not good');
        console.log("error",error);

    }
}