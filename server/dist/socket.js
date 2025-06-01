import { produceMessage } from "./helper.kafka.js";
export function setupSocket(io) {
    io.use((socket, next) => {
        const room = socket.handshake.auth.room || socket.handshake.headers.room;
        if (!room) {
            return next(new Error("Invalid room"));
        }
        socket.room = room;
        next();
    });
    io.on("connection", (socket) => {
        //Join the room
        socket.join(socket.room);
        socket.on("message", async (data) => {
            console.log("The socket message is- ", data);
            // socket.broadcast.emit("message", data);
            await produceMessage(process.env.KAFKA_TOPIC, data);
            socket.to(socket.room).emit("message", data);
        });
        socket.on("disconnect", () => {
            console.log("Socket disconnected- ", socket.id);
        });
    });
}
