class Fatura {
    constructor(mesReferencia, faturaId, contrato, fazendaId, tipoFatura, status, valorTotal, updatedAt, createdAt) {
        this.fatura_id = faturaId;
        this.mes_referencia = mesReferencia;
        this.contrato = contrato;
        this.fazenda_id = fazendaId;
        this.tipo_fatura = tipoFatura;
        this.status = status;
        this.valor_total = valorTotal;
        this.updated_at = updatedAt;
        this.created_at = createdAt;
    }

    toJSON() {
        return {
            fatura_id: this.fatura_id,
            mes_referencia: this.mes_referencia,
            contrato: this.contrato,
            fazenda_id: this.fazenda_id,
            tipo_fatura: this.tipo_fatura,
            status: this.status,
            valor_total: this.valor_total,
            updated_at: this.updated_at,
            created_at: this.created_at
        };
    }
}

module.exports = { Fatura };
