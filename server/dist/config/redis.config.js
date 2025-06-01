import { createClient } from "redis";
const client = createClient({
    url: "rediss://default:AUP6AAIjcDExYjhmZTA0N2E5NWY0Y2M3OTdiYjU3MWExM2E0MDljOXAxMA@cosmic-seahorse-17402.upstash.io:6379"
});
client.on("error", function (err) {
    throw err;
});
await client.connect();
await client.set('foo', 'bar');
export default client;
