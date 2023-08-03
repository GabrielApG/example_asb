const { MongoDBUpdater } = require('./../src/services/MongoDBUpdater');
const { database } = require('./../config/database');
const logger = require('./../src/log/logger');


// Simula o objeto de banco de dados
const mockDb = {
    collection: jest.fn().mockReturnThis(),
    find: jest.fn().mockReturnThis(),
    toArray: jest.fn(),
    updateOne: jest.fn().mockResolvedValue()
};

// Substitui a função getDb por uma função mock
database.getDb = jest.fn().mockResolvedValue(mockDb);

describe('MongoDBUpdater', () => {
    test('deve buscar coleções com status', async () => {
        const updater = new MongoDBUpdater('connection', 'db');
        mockDb.toArray.mockResolvedValueOnce(['document1', 'document2']);

        const result = await updater.findCollectionsWithStatus('collection', 'status');

        expect(result).toEqual(['document1', 'document2']);
        expect(database.getDb).toHaveBeenCalledWith('db');
        expect(mockDb.collection).toHaveBeenCalledWith('collection');
        expect(mockDb.find).toHaveBeenCalledWith({ status: 'status' });
        expect(mockDb.toArray).toHaveBeenCalled();
    });
});
