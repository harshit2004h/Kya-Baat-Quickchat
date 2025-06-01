import { Kafka, logLevel } from "kafkajs";
export const kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKER],
    ssl: true,
    sasl: {
        mechanism: "scram-sha-256",
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
    },
    logLevel: logLevel.ERROR,
    retry: {
        initialRetryTime: 300,
        retries: 10,
        maxRetryTime: 30000,
    },
});
export const producer = kafka.producer();
export const consumer = kafka.consumer({
    groupId: "chats",
    retry: {
        initialRetryTime: 300,
        retries: 10,
    },
});
export const connectKafkaProducer = async () => {
    try {
        await producer.connect();
        console.log("Kafka producer connected");
    }
    catch (error) {
        console.error("Failed to connect Kafka producer:", error);
        throw error;
    }
};
export const connectKafkaConsumer = async () => {
    try {
        await consumer.connect();
        console.log("Kafka consumer connected");
    }
    catch (error) {
        console.error("Failed to connect Kafka consumer:", error);
        throw error;
    }
};
// Utility function to create a topic if it doesn't exist
export const createTopicIfNotExists = async (topic) => {
    const admin = kafka.admin();
    try {
        await admin.connect();
        const topics = await admin.listTopics();
        if (!topics.includes(topic)) {
            await admin.createTopics({
                topics: [{ topic }],
            });
            console.log(`Topic ${topic} created successfully`);
        }
    }
    catch (error) {
        console.error(`Failed to create topic ${topic}:`, error);
    }
    finally {
        await admin.disconnect();
    }
};
