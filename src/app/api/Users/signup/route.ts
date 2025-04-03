import {connect} from '@/dbconfig/dbconfig'
import UserSchema from '@/models/user'
import bcrypt from "bcryptjs";
connect()
export async function POST(req: Request){
    try{
    const user= await req.json();
    const { email, password } = user;

       // Check if a user with the given email already exists
    const alreadyExists = await UserSchema.exists({ email });
    if (alreadyExists) {
        return new Response(JSON.stringify({ error: "User with this email already exists" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        });
    }

    const newuserschema=  new UserSchema(user)
    //    const password=newuserschema.password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    newuserschema.password = hash;
    console.log('new user after getting password encryption', newuserschema)
       //    console.log('got user data is ', newuserschema)
    const nsavedUSer = await newuserschema.save()
    return new Response(JSON.stringify(nsavedUSer), {
        headers:{
            'Content-Type': 'application/json',
        },status: 200,
    })
    } catch (error) {
        return new Response(JSON.stringify(error), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 500,
        })
    }
}


export async function GET ()
{
    try{
const user = await UserSchema.find()
return new Response(JSON.stringify(user),{
    headers: {
        'Content-Type': 'application/json',
    },status:200
})
    }
    catch(error){
        return new Response(`Unable to fetch the data ${error}`,{
            headers: { "Content-Type": "application/json" },
            status: 500,
        })
    }  
}
export async function DELETE (req: Request){
    try{
    const data = await req.json()
    const deleteduser = await UserSchema.findByIdAndDelete(data._id)
    return new Response(JSON.stringify(deleteduser),{
        headers: { "Content-Type": "application/json" },
        status: 200,
    })
    }
    catch(error){
        return new Response(`Unable to delete the data ${error}`,{
            headers: { "Content-Type": "application/json" },
            status: 500,
        })
    }
}

export async function PUT (req: Request){
    try {
        const data = await req.json()
        const updateduser = await UserSchema.findByIdAndUpdate(data._id, data, { new: true })
        return new Response(JSON.stringify(updateduser), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify(error), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 500,
        })
        
    }
}
