import connectDB from "../lib/mongodb";
import { User } from "../models/User";
import { authLib } from "../lib/auth";
import { IUser } from "../types/IUser";
import z from "zod";
import { LoginValidation } from "../lib/validations";

type LoginInput = z.infer<typeof LoginValidation>;

export const userService = {
    register: async (data: IUser & { confirmPassword?: string }) => {
        await connectDB();

        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            throw new Error("El correo ya esta registrado"); 
        }

        const hashPassword = await authLib.hashPassword(data.password);

        const newUser = await User.create({
            name: data.name,
            email: data.email,
            password: hashPassword,
        })

        return newUser;
    },

    login: async (data: LoginInput) => {
        await connectDB();

        const user = await User.findOne({ email: data.email });
        if (!user) {
            throw new Error("Invalido.")
        }

        const IsPasswordValid = await authLib.comparePassword(data.password, user.password)
        if (!IsPasswordValid) {
            throw new Error("Invalido")
        }

        const accessToken = await authLib.generateAccessToken({
            userId: user._id.toString(),
            email: user.email,
            name: user.name
        })

        const refreshToken = await authLib.generateRefreshToken({
            userId: user._id.toString(),
            email: user.email,
            name: user.name
        })

        return {
            accessToken,
            refreshToken,
            user: {
                name: user.name,
                email: user.email
            },
        };
    },
};  