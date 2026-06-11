import connectDB from "@/src/lib/mongodb";
import { authLib } from "@/src/lib/auth";
import { NextResponse, userAgent } from "next/server";
import { RegisterValidation } from "@/src/lib/validations";
import { User } from "@/src/models/User";

export async function POST(req: Request) {
    try {
        await connectDB();
        
        const body = await req.json();
        const validations = RegisterValidation.safeParse(body);

        if(!validations.success) {
            return NextResponse.json({error: "Datos invalidos" }, { status: 400 });
        }

        const hashPassword = await authLib.hashPassword(validations.data.password);

        const user = await User.create({
            name: validations.data.name,
            email: validations.data.email,
            password: hashPassword
        });
    } catch {

    }
} 

