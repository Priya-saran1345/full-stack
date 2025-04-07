/* eslint-disable @typescript-eslint/no-explicit-any */

import UserSchema from "@/models/user";
import { connect } from "@/dbconfig/dbconfig";
connect();
export async function GET(req: Request) {
try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
    return new Response("id is required", {
        headers: {
        "Content-Type": "application/json",
        },
        status: 400,
    });
    }
    const userData = await UserSchema.findById(id);
    if (!userData) {
    return new Response("User not found", {
        headers: {
        "Content-Type": "application/json",
        },
        status: 404,
    });
    } else {
    return new Response(JSON.stringify(userData), {
        headers: {
        "content-type": "application/json",
        },
        status: 200,
    });
    }
} catch (error:any) {
    return new Response(`error in finding the user  profile ${error}`, {
    headers: {
        "Content-Type": "application/json",
    },
    status: 200,
    });
}
}
