import { Authenticator } from "remix-auth";
import { sessionStorage } from "./sessions.server";
import { FormStrategy } from "remix-auth-form";
import * as bcrypt from "bcrypt";
import { prisma } from "./db.server";
import { User } from "@prisma/client";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(sessionStorage);

// Tell the Authenticator to use the form strategy
authenticator.use(
    new FormStrategy(async ({ form }) => {
        const name = form.get("name")?.toString() || "";
        const email = form.get("email")?.toString() || "";
        const password = form.get("password")?.toString() || "";

        // You can validate the inputs however you want
        if (!email || !password) {
            throw new Error("Email and password are required");
        }

        // And if you have a password you should hash it
        const hashedPassword = await bcrypt.hash(password, 10);

        // And finally, you can find, or create, the user
        let user = await prisma.user.findFirst({
            where: {
                email,
            },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                },
            });
        }

        // And return the user as the Authenticator expects it
        // the type of this user must match the type you pass to the Authenticator
        // the strategy will automatically inherit the type if you instantiate
        // directly inside the `use` method
        return user;
    }),
    // each strategy has a name and can be changed to use another one
    // same strategy multiple times, especially useful for the OAuth2 strategy.
    "user-pass"
);
