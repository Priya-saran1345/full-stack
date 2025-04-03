/* eslint-disable @typescript-eslint/no-explicit-any */

import { connect } from "@/dbconfig/dbconfig";
// import
import FruitsSchema from "@/models/fruits";
import UserSchema from "@/models/user"; // Ensure the correct import path

connect().catch((error) => {
    console.error("Failed to connect to the database:", error);
});



export async function GET()
{
    try{const fruits = await FruitsSchema.find().exec();
    return new Response(JSON.stringify(fruits),{
        headers: {
            'Content-Type': 'application/json',
        },
    })}
    catch (error: any) {
        console.error("Error saving Fruits:", error);
        return new Response(
        JSON.stringify({
            error: "Failed to save the post",
            details: error.message,
        }),
        {
            headers: { "Content-Type": "application/json" },
            status: 500,
        }
        );
    }
}
// export async function POST(request: Request) {
//     try {
//         const data = await request.json();
//         console.log("Fruits data:", data);
//         const newFruits = new FruitsSchema(data);
//         const savedPost = await newFruits.save();
//         return new Response(JSON.stringify(savedPost), {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             status: 200,
//         });
//     } catch (error: any) {
//         console.error("Error saving post:", error);
//         return new Response('Unable to save the data', {
//             headers: { "Content-Type": "application/json" },
//             status: 500,
//         });
//     }
// }

export async function POST(request: Request) {
    try {
        // 1️⃣ Parse request data
        const data = await request.json();
        console.log("Received Fruits data:", data);

        const { userId } = data;

        // 2️⃣ Check if userId is provided
        if (!userId) {
            return new Response(JSON.stringify({ error: "User ID is required." }), {
                headers: { "Content-Type": "application/json" },
                status: 400,
            });
        }

        // 3️⃣ Check if user exists
        const userExists = await UserSchema.findById(userId);
        if (!userExists) {
            return new Response(JSON.stringify({ error: "User not found." }), {
                headers: { "Content-Type": "application/json" },
                status: 404,
            });
        }

        // 4️⃣ Save the new fruit post
        const newFruit = new FruitsSchema({ ...data, user: userId }); // Ensure user is saved properly
        const savedPost = await newFruit.save();

        // 5️⃣ Respond with the saved data
        return new Response(JSON.stringify(savedPost), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        });

    } catch (error: any) {
        console.error("Error saving post:", error);
        return new Response(JSON.stringify({ error: "Unable to save the data" }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
}

export async function DELETE(request: Request) {
try{
const data = await request.json();
console.log("Fruits data you want to delete:", data)
if (!data._id) {
    return new Response(JSON.stringify({ error: "Missing _id in request body" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
    });
}
const existingFruit = await FruitsSchema.findOne({ _id: data._id });

if (!existingFruit) {
    return new Response(JSON.stringify({ error: "Fruit not found in database" }), {
        headers: { "Content-Type": "application/json" },
        status: 404, // Not Found
    });
}

// const deletedFruits1 = await FruitsSchema.findOne({ _id: data._id });
const deletedFruits = await FruitsSchema.findOneAndDelete({ _id: data._id });
return new Response(JSON.stringify(deletedFruits), {
    headers: {"content-Type":"application/json"}
,
status:200,
})
}
catch(error){

    return new Response(`unable to delete the data ${error}`,{
        headers: { "Content-Type": "application/json" },
        status: 500,
    })
}
}

export async function PUT(request: Request) {
try{
const data = await request.json();
console.log("Fruits data you want to update:", data)
if (!data._id) {
    return new Response(JSON.stringify({ error: "Missing _id in request body" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
    });
}
const existingFruit = await FruitsSchema.findOne({ _id: data._id });
if(!existingFruit)
{
    return new Response(JSON.stringify({ error: "Fruit not found in database" }), 
{
    headers: { "Content-Type": "application/json" },
        status: 404, // Not Found
    });
}
const updatedFruit = await FruitsSchema.findByIdAndUpdate(
    data._id,    // ID to find the document
    data,        // Data to update
    { new: true } // Returns updated document
); return new Response(JSON.stringify(updatedFruit), {
    headers: {"content-Type":"application/json"},status:200})

}
catch(error){
    return new Response (`unable to update the data ${error}`,{
        headers: { "Content-Type": "application/json" },
        status: 500,
    })
}
}