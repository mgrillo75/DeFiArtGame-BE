import { HTTPServer } from "..";
import { Request, Response } from 'express';
import { RouteMethods } from "../types";

export type MiddlewareMethod = (server: HTTPServer, req: Request, res: Response, next: () => void) => void;
export type Executor = (server: HTTPServer, req: Request, res: Response) => void;

const defaultExecutor: Executor = (server: HTTPServer, req: Request, res: Response) => {
    return res.send({ code: 404, error: 'Invalid Route' })
}

export default class RouteExecutor {

    private _middlewareMethods: MiddlewareMethod[] = [];
    private _executor: Executor = defaultExecutor;

    public path: string;
    public method: RouteMethods;

    constructor(vals: { path: string, method: RouteMethods }) {
        this.path = vals.path;
        this.method = vals.method;
    }


    public use(...mwm: MiddlewareMethod[]): RouteExecutor {
        mwm.map(meth => this._middlewareMethods.push(meth));
        return this;
    }

    public reply(res: Response, data: unknown) {
        const d = { code: 200, data };
        res.send(d);
    }

    public setExecutor(executor: Executor): RouteExecutor {
        this._executor = executor;
        return this;
    }

    public async execute(server: HTTPServer, req: Request, resp: Response): Promise<RouteExecutor> {
        let proms: Promise<void>[] = []
        this._middlewareMethods.map(fn => proms.push(new Promise((res, _rej) => fn(server, req, resp, res))));
        if (proms.length > 0) await Promise.all(proms);

        this._executor(server, req, resp);
        return this;
    }
}
