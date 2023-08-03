const { ServiceBusMessenger } = require('./src/services/ServiceBusMessenger');
const { MongoDBUpdater } = require('./src/services/MongoDBUpdater');
const { Fatura } = require('./src/models/FaturaModel');
const logger = require('./src/log/logger');

async function prepareMessage(messengerAsb, message) {
    try {
        const success = await messengerAsb.sendMessage(message);
        return success;
    } catch (error) {
        logger.error('Erro ao enviar mensagem::', error);
        return false;
    } finally {
        await messengerAsb.closeConnection();
    }
}

async function processAndUpdateFaturas(context, timeStamp) {
    const connectionString = process.env.MONGODB_CONNECTION_STRING;
    const dbName = process.env.MONGODB_DATABASE;
    const updater = new MongoDBUpdater(connectionString, dbName);

    const collectionName = 'fatura_balanco_recebiveis';
    const currentStatus = 'Não';
    const newStatus = 'Sim';

    const documents = await updater.findCollectionsWithStatus(collectionName, currentStatus);

    if (documents.length > 0) {
        const messengerAsb = new ServiceBusMessenger(process.env.CONNECTION_STRING_TOPICO_FATURA_MENSALIDADE, process.env.QUEUE_NAME);

        for (const document of documents) {
            const parsedDocument = new Fatura(
                document.mes_referencia,
                document.fatura_id,
                document.contrato,
                document.fazenda_id,
                document.tipo_fatura,
                document.status,
                document.valor_total,
                document.updated_at,
                document.created_at
            );

            const message = parsedDocument.toJSON();

            const success = await prepareMessage(messengerAsb, message);
            
            if (success) {
                await updater.updateCollectionStatus(collectionName, [document], newStatus);
                context.log(`Documento enviado e status atualizado: ${document._id}`);
            } else {
                context.log(`Erro ao enviar documento: ${document._id}`);
            }
        }
    }

    logger.info(`Processamento concluído. Total de documentos enviados: ${documents.length}`);
}

module.exports = processAndUpdateFaturas;