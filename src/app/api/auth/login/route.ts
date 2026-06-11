import { NextResponse } from "next/server";
import { LoginValidation } from "@/src/lib/validations";
import { userService } from "@/src/services/user.service";
import { access } from "fs";

export async function GET(req: Request) {
    try {
        const body = await req.json();

        const validations = LoginValidation.safeParse(body);
        if(!validations.success) {
            return NextResponse.json({ error: "Datos Invalidos"}, { status: 400 })
        }

        const { accessToken, refreshToken, user } = await userService.login(validations.data);

        const response = NextResponse.json({
            message: "Inicio de sesion exitoso",
            user,
            accessToken
        }, { status: 200});

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/"
        });

        return response;  
    } catch (error){
        if( error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 401 })
        }
        return NextResponse.json({ error: "Error Fatal" }, { status: 500 });
    }
}

 