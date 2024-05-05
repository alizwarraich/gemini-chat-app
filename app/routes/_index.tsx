import type { MetaFunction } from "@remix-run/node";
import { Dashboard } from "~/components/Dashboard";

export const meta: MetaFunction = () => {
    return [
        { title: "ChatGenie - A Gemini based Chat Application" },
        { name: "description", content: "Welcome to ChatGenie!" },
    ];
};

export default function Index() {
    return <Dashboard />;
}
