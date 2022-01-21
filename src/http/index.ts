import express from 'express';
import cors from 'cors';
import Collection from '@discordjs/collection';
import { glob } from 'glob';
import RouteExecutor from './classes/RouteExecutor';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';

export class HTTPServer {
    public port: number;

    public routes: Collection<string, RouteExecutor> = new Collection();
    public app = express();

    constructor(port: number) {
        this.port = port;
        this.app.use(cors());
        this.app.use(bodyParser.json())

        this.registerOperators();
        this.startServer();
    }

    private registerOperators() {
        const ext = (__filename.endsWith("ts") ? "ts" : "js");
        glob(`${__dirname}/routes/**/**/*.${ext}`, async (err, files) => {
            files.map(f => {
                const imported = require(f);
                if (!(imported.default instanceof RouteExecutor)) return;

                const route: RouteExecutor = imported.default;
                this.routes.set(route.path, route);
            });
        });
    }

    private startServer() {
        this.app.get("*", (req, res) => {
            this.handleRequest(req, res);
        })
        this.app.post("*", (req, res) => {
            this.handleRequest(req, res);
        })

        this.app.listen(this.port, () => {
            console.log(`http server started on http://localhost:${this.port}`)
        })
    }

    private handleRequest(req: Request, res: Response) {
        if (!this.routes.has(req.path)) return res.send({ code: 404, error: 'Invalid Route' });

        const route = this.routes.get(req.path);

        if (!route) return res.send({ code: 404, error: 'Invalid Route' });
        if (route.method !== req.method) return res.send({ code: 405, error: 'Method Not Allowed' });

        route.execute(this, req, res);
    }
}