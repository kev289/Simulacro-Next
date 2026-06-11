import connectDB from "../lib/mongodb";
import { User } from "../models/User";
import { authLib } from "../lib/auth";
import { IUser } from "../types/IUser";

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
    }
};