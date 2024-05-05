import type { MetaFunction } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { prisma } from "~/server/db.server";

export const meta: MetaFunction = () => {
    return [
        { title: "ChatGenie - A Gemini based Chat Application" },
        { name: "description", content: "Welcome to ChatGenie!" },
    ];
};

export const action = async () => {
    // create a new session
    try {
        const { id } = await prisma.session.create({
            data: {},
        });
        return redirect(`/session/${id}`);
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create a new session");
    }
};

export default function Index() {
    return (
        <Form method="post">
            <Button>Create a new session</Button>
        </Form>
    );
}
