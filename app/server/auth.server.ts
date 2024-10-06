import { Authenticator } from "remix-auth";
import { sessionStorage } from "./sessions.server";
import { FormStrategy } from "remix-auth-form";
import { User } from "@prisma/client";
import { prisma } from "./db.server";
import { getFullName } from "~/lib/helper";
import bcrypt from "bcrypt";

export const authenticator = new Authenticator<User>(sessionStorage);

// login form strategy
authenticator.use(
    new FormStrategy(async ({ form }) => {
        const email = form.get("email")?.toString() || "";
        const password = form.get("password")?.toString() || "";

        if (!email || !password) {
            throw new Error("Email and password are required");
        }

        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        });

        if (!user) {
            throw new Error("No user found against this email");
        }

        // compare the password
        const isPasswordSame = await bcrypt.compare(password, user.password);

        if (!isPasswordSame) {
            throw new Error("Password is incorrect");
        }

        return user;
    }),
    "login-with-user-pass"
);

// signup form strategy
authenticator.use(
    new FormStrategy(async ({ form }) => {
        const firstName = form.get("first-name")?.toString() || "";
        const lastName = form.get("last-name")?.toString() || "";
        const email = form.get("email")?.toString() || "";
        const password = form.get("password")?.toString() || "";

        if (!email || !password) {
            throw new Error("Email and password are required");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let user = await prisma.user.findFirst({
            where: {
                email,
                password: hashedPassword,
            },
        });

        // if the user already exists, throw an error
        if (user) {
            throw new Error("This email is already registered");
        }

        user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: getFullName(firstName, lastName),
            },
        });

        return user;
    }),
    "register-with-user-pass"
);
