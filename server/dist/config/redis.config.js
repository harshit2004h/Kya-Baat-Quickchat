import { createClient } from "redis";
const client = createClient({
    url: "rediss://default:Aa0nAAIjcDE5OGE0YmRmMjk3N2M0NzI3OGMxNjY5YWIzMmQzNDBhNHAxMA@loving-koala-44327.upstash.io:6379",
});
client.on("error", function (err) {
    throw err;
});
await client.connect();
await client.set("foo", "bar");
export default client;
