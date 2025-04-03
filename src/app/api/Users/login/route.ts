import UserSchema from "@/models/user";
import { connect } from "@/dbconfig/dbconfig";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
connect();
export async function POST(req: Request) {
    const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';
    try {
        const data = await req.json();
        const { email, password } = data;
        // Retrieve user from the database
        const user = await UserSchema.findOne({ email });
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
            });}
        // Debugging logs
        console.log("User found:", user);
        console.log("Provided password:", password);
        console.log("Stored hashed password:", user.password);
        // Validate password
        const isValid = await bcrypt.compare(password, user.password);
        console.log("Password validation result:", isValid);
        if (!isValid) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), {
                status: 401,
            });
        }
        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, jwtSecret, {
            expiresIn: "7d",
        });
        return new Response(JSON.stringify({ message: "Login successful", token ,user_id:user._id }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 200,
        });
    }
    
    catch (error) {
        console.error("Error during login process:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 500,
        });
    }
}
