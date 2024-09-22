import { ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import Signin from "~/components/Authentication/Signin";

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log(email, password);

    return null;
}

export default function Login() {
    return (
        <div className="h-screen flex justify-center items-center">
            <Form method="post">
                <Signin />
            </Form>
        </div>
    );
}
