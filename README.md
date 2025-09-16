Kafka with Node.js Consumer

This repository demonstrates how to set up and run Apache Kafka using Docker and consume messages with a Node.js KafkaJS consumer.

Features

Run Kafka in Docker with Zookeeper.

Use KafkaJS to consume messages from topics.

Supports multiple partitions and consumer groups.

Simple and production-ready configuration.

 Prerequisites

Make sure you have the following installed:

Docker

Node.js
 (>= 16.x recommended)

npm
 or yarn

⚡ Setup
1. Run Kafka with Docker

Start Kafka and Zookeeper with:

docker run -p 9092:9092 \
  -e KAFKA_ZOOKEEPER_CONNECT=192.168.1.23:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.1.23:9092 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  -e KAFKA_PROCESS_ROLES=broker \
  -e KAFKA_NODE_ID=1 \
  -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 \
  confluentinc/cp-kafka


.Replace 192.168.1.23 with your machine’s IP address.
.Ensure Zookeeper is already running.

2. Install Dependencies
npm install kafkajs

3. Create a Kafka Consumer (consumer.js)
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "KAFKA",
  brokers: ["192.168.1.23:9092"], // Replace with your Kafka broker
});

const consumer = kafka.consumer({ groupId: "user-1" });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "rider-updates", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(
        `[${topic}]: PART:${partition} => ${message.value.toString()}`
      );
    },
  });
};

run().catch(console.error);

4. Run the Consumer
node consumer.js


You should see logs similar to:

[Consumer] Starting
[ConsumerGroup] Consumer has joined the group
[rider-updates]: PART:0 => {"riderId":"123","status":"active"}

 Useful Kafka CLI Commands

Create a topic:

docker exec -it <kafka-container-id> kafka-topics --create \
  --topic rider-updates --bootstrap-server localhost:9092 --partitions 2 --replication-factor 1


Produce a test message:

docker exec -it <kafka-container-id> kafka-console-producer \
  --topic rider-updates --bootstrap-server localhost:9092


Consume messages:

docker exec -it <kafka-container-id> kafka-console-consumer \
  --topic rider-updates --from-beginning --bootstrap-server localhost:9092

 References

KafkaJS Docs

Confluent Kafka Docker

Apache Kafka

 Author
SparshYay
sicario.official28@gmail.com
