import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import Signin from "~/components/Authentication/Signin";
import { ErrorCode } from "~/constants/constants";
import { authenticator } from "~/server/auth.server";

export const meta: MetaFunction = () => {
    return [
        { title: "Sign in | ChatGenie" },
        { name: "description", content: "Welcome to ChatGenie!" },
    ];
};

export async function loader({ request }: ActionFunctionArgs) {
    // if the user is already authenticated redirect to /dashboard directly
    return await authenticator.isAuthenticated(request, {
        successRedirect: "/session/cm1cb7int0001a5ldryz4ul6o",
    });
}

export async function action({ request }: ActionFunctionArgs) {
    try {
        return await authenticator.authenticate(
            "login-with-user-pass",
            request,
            {
                successRedirect: "/session/cm1cb7int0001a5ldryz4ul6o",
                throwOnError: true,
            }
        );
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            switch (error.message) {
                case ErrorCode.PasswordIncorrect:
                    return new Error(ErrorCode.PasswordIncorrect);
                default:
                    return new Error(error.message);
            }
        } else {
            console.error(error);
            return new Error(ErrorCode.UnknownError);
        }
    }
}

export default function Login() {
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();

    console.log("data", JSON.stringify(actionData));
    console.log("state", navigation.state);

    return (
        <div className="h-screen flex justify-center items-center">
            <Form method="post">
                <Signin />
            </Form>
        </div>
    );
}
