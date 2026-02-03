import type { Config } from "tailwindcss";
import sharedConfig from "@fevrex/ui/tailwind.config";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    presets: [sharedConfig],
};
export default config;
