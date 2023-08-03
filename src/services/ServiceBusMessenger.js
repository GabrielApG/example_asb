const { ServiceBusClient } = require('@azure/service-bus');
const logger = require('./../log/logger');

class ServiceBusMessenger {
    constructor(serviceBusConnectionString, queueName) {
        this.serviceBusConnectionString = serviceBusConnectionString;
        this.queueName = queueName;
        this.serviceBusClient = new ServiceBusClient(serviceBusConnectionString);
        this.sender = this.serviceBusClient.createSender(queueName);
    }

    async sendMessage(message) {
        try {
            await this.sender.sendMessages({
                body: message,
                applicationProperties: message.applicationProperties
            });

            return true; // success

        } catch (error) {
            logger.error('Erro ao enviar mensagem:', error);
            return false; // fail
        }
    }

    async closeConnection() {
        // await this.sender.close();
        // await this.serviceBusClient.close();
    }
}

module.exports = { ServiceBusMessenger };
