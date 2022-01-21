import { config } from "dotenv";
import { HTTPServer } from "./http";

config();

const HTTP_PORT = Number(process.env.HTTP_PORT || 3001);

function main() {
    new HTTPServer(HTTP_PORT);
}

main();