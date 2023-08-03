const { ObjectId } = require('mongodb');
const { database } = require('./../../config/database');
const logger = require('./../log/logger');

class MongoDBUpdater {
    constructor(connectionString, dbName) {
        this.connectionString = connectionString;
        this.dbName = dbName;
    }

    async findCollectionsWithStatus(collectionName, statusValue) {
        try {
            
            const db = await database.getDb(this.dbName);
            const collection = db.collection(collectionName);

            const query = { ['consumida_balanco_recebiveis']: statusValue };
            return await collection.find(query).toArray();

        } catch (error) {
            
            logger.error('Erro ao buscar coleções com status:', error);
            throw error;
        }
    }
    

    async updateCollectionStatus(collectionName, documents, newStatus) {
        try {
            const db = await database.getDb(this.dbName);
            const collection = db.collection(collectionName);
            const updatePromises = documents.map(async document => {
                const filter = { _id: new ObjectId(document._id) };
                const update = { $set: { consumida_balanco_recebiveis: newStatus } };
                return await collection.updateOne(filter, update);
            });

            await Promise.all(updatePromises);
            logger.info(`Atualizados ${documents.length} documentos para o novo status consumida_balanco_recebiveis "${newStatus}" na coleção "${collectionName}"`);

        } catch (error) {
            
            logger.error('Erro ao atualizar coleção:', error);
            throw error;
        }
    }

    async processAndUpdateCollections(collectionName, currentStatus, newStatus) {
        try {
            const documents = await this.findCollectionsWithStatus(collectionName, currentStatus);
            await this.updateCollectionStatus(collectionName, documents, newStatus);
        } catch (error) {
            logger.error('Erro ao processar e atualizar coleções:', error);
            throw error;
        }
    }
}

module.exports = { MongoDBUpdater };
