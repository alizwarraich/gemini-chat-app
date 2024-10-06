import type {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    MetaFunction,
} from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { authenticator } from "~/server/auth.server";
import { prisma } from "~/server/db.server";

export const meta: MetaFunction = () => {
    return [
        { title: "ChatGenie - A Gemini based Chat Application" },
        { name: "description", content: "Welcome to ChatGenie!" },
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {
    // if the user is already authenticated, redirect to "/dashboard"
    return await authenticator.isAuthenticated(request, {
        successRedirect: "/session/cm1cb7int0001a5ldryz4ul6o",
        failureRedirect: "/login",
    });
}

export async function action({ request }: ActionFunctionArgs) {
    // create a new session
    try {
        const { id } = await prisma.session.create({
            data: {},
        });
        return redirect(`/session/${id}`, {
            headers: request.headers,
        });
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create a new session", {
            cause: error,
        });
    }
}

export default function Index() {
    return (
        <Form method="post">
            <Button>Create a new session</Button>
        </Form>
    );
}
