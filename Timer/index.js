require('dotenv').config();
const processAndUpdateFaturas = require('./../app');
const logger = require('../src/log/logger');

module.exports = async function (context, myTimer) {
    const timeStamp = new Date().toISOString();

    try {
        await processAndUpdateFaturas(context, timeStamp);
    } catch (error) {
        logger.error('Erro:', error);
    }
};