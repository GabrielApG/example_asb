const { ServiceBusMessenger } = require('./../src/services/ServiceBusMessenger');
const { ServiceBusClient } = require('@azure/service-bus');
const logger = require('./../src/log/logger');

// Simula o objeto de ServiceBusClient
const mockServiceBusClient = {
    createSender: jest.fn().mockReturnThis(),
    sendMessages: jest.fn().mockResolvedValue(),
    close: jest.fn().mockResolvedValue()
};

// Substitui o construtor de ServiceBusClient pelo objeto mock
jest.mock('@azure/service-bus', () => ({
    ServiceBusClient: jest.fn(() => mockServiceBusClient)
}));

describe('ServiceBusMessenger', () => {
    test('deve enviar mensagem com sucesso', async () => {
        const messenger = new ServiceBusMessenger('connection', 'queue');
        const message = { body: 'message', applicationProperties: { prop: 'value' } };

        const success = await messenger.sendMessage(message);

        expect(success).toBe(true);
        expect(mockServiceBusClient.createSender).toHaveBeenCalledWith('queue');
    })
});