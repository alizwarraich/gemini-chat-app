import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        { title: "ChatGenie - A Gemini based Chat Application" },
        { name: "description", content: "Welcome to ChatGenie!" },
    ];
};

export default function Index() {
    return <div className="text-3xl font-bold">Hello World</div>;
}
