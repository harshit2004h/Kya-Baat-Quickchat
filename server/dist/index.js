import express from "express";
import "dotenv/config";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 7000;
import Routes from "./routes/index.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { setupSocket } from "./socket.js";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import client from "./config/redis.config.js";
import { instrument } from "@socket.io/admin-ui";
import { connectKafkaProducer, connectKafkaConsumer, producer, consumer, } from "./config/kafka.config.js";
import { consumeMessages } from "./helper.kafka.js";
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "https://admin.socket.io",
            "https://kya-baat-quickchat.vercel.app",
            "https://kya-baat-quickchat.vercel.app.socket.io",
        ],
        credentials: true,
    },
    adapter: createAdapter(client),
});
instrument(io, {
    auth: false,
    mode: "development",
});
setupSocket(io);
export { io };
// * Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
    return res.send("It's working 🙌");
});
//Routes
app.use("/api", Routes);
// Initialize Kafka connections
const initializeKafka = async () => {
    try {
        await connectKafkaProducer();
        await connectKafkaConsumer();
        const kafkaTopic = process.env.KAFKA_TOPIC;
        if (!kafkaTopic) {
            throw new Error("KAFKA_TOPIC environment variable is not defined");
        }
        await consumeMessages(kafkaTopic);
        console.log(`Successfully connected to Kafka and consuming from topic: ${kafkaTopic}`);
    }
    catch (error) {
        console.error("Failed to initialize Kafka:", error);
        console.error("Application will continue without Kafka functionality");
    }
};
// Start the server
server.listen(PORT, async () => {
    console.log(`Server is running on PORT ${PORT}`);
    await initializeKafka();
});
// Handle graceful shutdown
const gracefulShutdown = async () => {
    try {
        console.log("Shutting down gracefully...");
        await io.close();
        try {
            await producer.disconnect();
        }
        catch (e) { }
        try {
            await consumer.disconnect();
        }
        catch (e) { }
        server.close(() => {
            console.log("Server closed");
            process.exit(0);
        });
    }
    catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
    }
};
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
