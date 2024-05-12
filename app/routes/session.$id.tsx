import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    MetaFunction,
    json,
} from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
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
            sessionId,
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
                role: "user",
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
                role: "model",
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
    const { messages, sessionId } = useLoaderData<typeof loader>();
    const { state } = useNavigation();
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (state === "loading" && message) {
            setMessage("");
        }
    }, [state, message]);

    return (
        <Dashboard
            messages={
                state === "submitting" && message
                    ? [
                          ...messages,
                          {
                              content: message,
                              role: "user",
                              createdAt: new Date().toISOString(),
                              id: "user-temp",
                              sessionId: sessionId,
                          },
                          {
                              content: "",
                              role: "model",
                              createdAt: new Date().toISOString(),
                              id: "model-temp",
                              sessionId: sessionId,
                          },
                      ]
                    : messages
            }
            message={message}
            setMessage={setMessage}
            navigationState={state}
        />
    );
};

export default App;
