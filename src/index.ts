import { AsyncLocalStorage } from "async_hooks";
import { IncomingMessage, ServerResponse } from "http";
import { App } from "./app";

const app = new App();

const asyncLocalStorage = new AsyncLocalStorage();

function a() {
    b();
}

function b() {
    c();
}

function c() {
    const requestID = asyncLocalStorage.getStore()
    console.info("Something happened with the request", requestID)
}

function d() {
    const requestID = asyncLocalStorage.getStore()
    console.info("Something happened with the request", requestID)
}

app.get("/", (req: IncomingMessage, res: ServerResponse) => {
    const requestID = Date.now()

    asyncLocalStorage.run(requestID, a);

    d();

    res.writeHead(200);
    res.end('Hello, World!');
})

app.post("/test", async (req: IncomingMessage, res: ServerResponse) => {
    const chunks = [];

    for await (const chunk of req) {
        chunks.push(chunk);
    }

    throw new Error("Bam")
    /*
    const json = JSON.parse(Buffer.concat(chunks).toString())

    console.info(json)

    // Produce json
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ hello: "World" }));
    */
})

app.start(8080)
