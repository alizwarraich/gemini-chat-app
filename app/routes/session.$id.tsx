import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    MetaFunction,
    json,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Dashboard } from "~/components/Dashboard";
import { prisma } from "~/server/db.server";
import { model } from "~/server/model.server";

export const meta: MetaFunction = ({ params }) => {
    const sessionId = params.id;
    return [
        { title: `ChatGenie - Custom Session ${sessionId}` },
        { name: "description", content: "Welcome to ChatGenie!" },
    ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const sessionId = params.id;
    if (!sessionId) {
        console.error("Session does not exist");
        throw new Error("Session does not exist");
    }

    // fetch all messages for the session
    try {
        const messages = await prisma.message.findMany({
            where: {
                sessionId,
            },
        });

        return json({
            messages,
        });
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch messages");
    }
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const sessionId = params.id;
    if (!sessionId) {
        console.error("Session does not exist");
        throw new Error("Session does not exist");
    }

    const formData = await request.formData();
    const body = Object.fromEntries(formData.entries()) as {
        [key: string]: string;
    };
    const { message } = body;
    if (!message) {
        console.error("Something went wrong");
        throw new Error("Something went wrong");
    }
    try {
        // store the user's message in the database
        await prisma.message.create({
            data: {
                content: message,
                role: "USER",
                sessionId,
            },
        });

        // send the message to the chat server
        const { response } = await model.generateContent(message);
        const textResponse = response.text();

        // store the chat server's response in the database
        await prisma.message.create({
            data: {
                content: textResponse,
                role: "BOT",
                sessionId,
            },
        });

        return json({
            response: textResponse,
        });
    } catch (error) {
        console.error(error);
        throw new Error("Failed to generate response");
    }
};

const App = () => {
    const { messages } = useLoaderData<typeof loader>();
    return <Dashboard messages={messages} />;
};

export default App;
