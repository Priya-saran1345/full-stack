/* eslint-disable @typescript-eslint/no-explicit-any */

import { connect } from "@/dbconfig/dbconfig";
// import
import FruitsSchema from "@/models/post";
import UserSchema from "@/models/user"; // Ensure the correct import path
import jwt from 'jsonwebtoken'; // or `import { verify } from 'jsonwebtoken'`
const JWT_SECRET = process.env.JWT_SECRET ||'priya saran';
connect().catch((error) => {
  console.error("Failed to connect to the database:", error);
});


export async function POST(request: Request) {
  try {
    // 1️⃣ Get Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return new Response(JSON.stringify({ error: 'Authorization token missing.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // 2️⃣ Extract and verify token
    const token = authHeader.split(' ')[1];
    console.log('the token is ',token)
    let decoded: any;
    try
    {
      decoded = jwt.verify(token, JWT_SECRET);
    } 
    catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.log('decoded',decoded)
    const userId = decoded.id;
    console.log('user id from token is ',userId) 
    // 👈 assuming the token includes `userId`
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID missing in token.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // 3️⃣ Ensure user exists
    const userExists = await UserSchema.findById(userId);
    if (!userExists) {
      return new Response(JSON.stringify({ error: 'User not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // 4️⃣ Parse body data
    const data = await request.json();
    console.log('Received Fruits data:', data);
    // 5️⃣ Save fruit post with associated user
    const newFruit = new FruitsSchema({ ...data, user: userId });
    const savedPost = await newFruit.save();
    // 6️⃣ Respond with success
    return new Response(JSON.stringify(savedPost), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error saving post:', error);
    return new Response(JSON.stringify({ error: 'Unable to save the data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const data = await request.json();
    console.log("Post data you want to delete:", data);
    if (!data._id) {
      return new Response(
        JSON.stringify({ error: "Missing _id in request body" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    const existingFruit = await FruitsSchema.findOne({ _id: data._id });

    if (!existingFruit) {
      return new Response(
        JSON.stringify({ error: "Fruit not found in database" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 404, // Not Found
        }
      );
    }
    // const deletedFruits1 = await FruitsSchema.findOne({ _id: data._id });
    const deletedFruits = await FruitsSchema.findOneAndDelete({
      _id: data._id,
    });
    return new Response(JSON.stringify(deletedFruits), {
      headers: { "content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(`unable to delete the data ${error}`, {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    console.log("Fruits data you want to update:", data);
    if (!data.id) {
      return new Response(
        JSON.stringify({ error: "Missing _id in request body" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    const existingFruit = await FruitsSchema.findOne({ _id: data.id });
    if (!existingFruit) {
      return new Response(
        JSON.stringify({ error: "Fruit not found in database" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 404, // Not Found
        }
      );
    }
    const updatedFruit = await FruitsSchema.findByIdAndUpdate(
      data.id, // ID to find the document
      data, // Data to update
      { new: true } // Returns updated document
    );
    return new Response(JSON.stringify(updatedFruit), {
      headers: { "content-Type": "application/json" },
      status: 200,
    });
  } 
  catch (error) {
    return new Response(`unable to update the data ${error}`, {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}



export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user");
    let fruits;
    if (userId) {
      fruits = await FruitsSchema.find({ user: userId }).exec();
    } else {
      fruits = await FruitsSchema.find().exec();
    }
    return new Response(JSON.stringify(fruits), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error fetching fruits:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch fruits",
        details: error.message,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}