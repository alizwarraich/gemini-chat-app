import type { Config } from "tailwindcss";

export default {
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                bgDarkSecondary: "#151518",
                bgDarkPrimary: "#09090B",
                textLightPrimary: "#FAFAFA",
                textLightSecondary: "#8B8B94",
            },
        },
    },
    plugins: [],
} satisfies Config;
