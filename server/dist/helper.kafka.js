import prisma from "./config/db.config.js";
import { consumer, producer, createTopicIfNotExists, } from "./config/kafka.config.js";
export const produceMessage = async (topic, message) => {
    try {
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
    }
    catch (error) {
        console.error(`Error producing message to topic ${topic}:`, error);
        throw error;
    }
};
export const consumeMessages = async (topic) => {
    try {
        // Try to create the topic first to ensure it exists and we have access
        await createTopicIfNotExists(topic);
        await consumer.connect();
        console.log(`Subscribing to topic: ${topic}`);
        await consumer.subscribe({
            topic: topic,
            fromBeginning: true,
        });
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const data = JSON.parse(message.value.toString());
                    await prisma.chats.create({
                        data: data,
                    });
                    console.log(`Message processed from topic ${topic}, partition ${partition}`);
                }
                catch (error) {
                    console.error(`Error processing message from ${topic}:`, error);
                }
            },
        });
    }
    catch (error) {
        console.error(`Error setting up consumer for topic ${topic}:`, error);
        // If this is an authorization error, log a more specific message
        if (error.type === "TOPIC_AUTHORIZATION_FAILED") {
            console.error(`Authorization failed for topic ${topic}. Please check your Kafka credentials and topic permissions.`);
        }
        throw error;
    }
};
