const { Fatura } = require('./../src/models/FaturaModel');

describe('Fatura', () => {
    test('deve retornar JSON corretamente', () => {
        const fatura = new Fatura(
            'mes', 123, 'contrato', 1, 'tipo', 'status', 100, 'updated', 'created'
        );

        const expectedJSON = {
            fatura_id: 123,
            mes_referencia: 'mes',
            contrato: 'contrato',
            fazenda_id: 1,
            tipo_fatura: 'tipo',
            status: 'status',
            valor_total: 100,
            updated_at: 'updated',
            created_at: 'created'
        };

        expect(fatura.toJSON()).toEqual(expectedJSON);
    });
});
