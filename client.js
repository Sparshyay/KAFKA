const { Kafka } = require("kafkajs");

exports.kafka = new Kafka({
    clientId: "KAFKA",
    brokers: ["192.168.1.23:9092"]
});