import { ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import Signup from "~/components/Authentication/Signup";
import { authenticator } from "~/server/auth.server";

export async function action({ request }: ActionFunctionArgs) {
    return await authenticator.authenticate("user-pass", request, {
        successRedirect: "/session/cm1cb7int0001a5ldryz4ul6o",
        failureRedirect: "/login",
    });
}

export default function Login() {
    return (
        <div className="h-screen flex justify-center items-center">
            <Form method="post">
                <Signup />
            </Form>
        </div>
    );
}
