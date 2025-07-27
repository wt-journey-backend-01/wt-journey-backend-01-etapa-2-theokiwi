const casos = [
    {
        id: 'f5fb2ad5-22a8-4cb4-90f2-8733517a0d46',
        titulo: 'Homicídio',
        descricao:
            'Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.',
        status: 'aberto',
        agente_id: '401bccf5-cf9e-489d-8412-446cd169a0f1',
    },
    {
        id: 'b72d9d31-5cb8-4bcb-8fd3-fbf308f8b2a1',
        titulo: 'Roubo a residência',
        descricao:
            'Arrombamento de uma residência na rua São Pedro durante a madrugada, vários eletrônicos foram levados.',
        status: 'aberto',
        agente_id: 'a9c32a52-63c5-4f27-9f3e-9ee1d49d982c',
    },
    {
        id: 'c0a2e4f1-1234-4e56-8abc-77fd5c2e8390',
        titulo: 'Furto de veículo',
        descricao:
            'Um carro foi furtado em um estacionamento próximo ao centro comercial na tarde do dia 15/03/2021.',
        status: 'solucionado',
        agente_id: 'b2c97e7a-84a3-4ac2-b12b-2cde1a0e2f3f',
    },
    {
        id: 'aa33bb44-5566-7788-99aa-bbccddeeff00',
        titulo: 'Violência doméstica',
        descricao:
            'Vítima registrou ocorrência de agressão física cometida pelo cônjuge na noite de sábado.',
        status: 'aberto',
        agente_id: 'dd112233-4455-6677-8899-aabbccddeeff',
    },
    {
        id: 'f7e9c5d2-44f3-4a99-93bb-2ff34b7e132a',
        titulo: 'Tráfico de drogas',
        descricao:
            'Investigação sobre um ponto de tráfico identificado no bairro Industrial.',
        status: 'solucionado',
        agente_id: '22334455-6677-8899-aabb-ccddeeff0011',
    },
    {
        id: '0d3f4b5e-6789-4abc-bcde-1234567890ab',
        titulo: 'Desaparecimento de pessoa',
        descricao:
            'Homem de 32 anos desaparecido desde o dia 05/08/2022, última vez visto na estação central.',
        status: 'aberto',
        agente_id: '33445566-7788-99aa-bbcc-ddeeff001122',
    },
    {
        id: '9a8b7c6d-5e4f-3d2c-1b0a-9876543210ba',
        titulo: 'Fraude bancária',
        descricao:
            'Clonagem de cartão de crédito com movimentações suspeitas em contas bancárias.',
        status: 'solucionado',
        agente_id: '44556677-8899-aabb-ccdd-eeff00112233',
    },
    {
        id: '1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
        titulo: 'Lesão corporal',
        descricao:
            'Vítima sofreu agressões em via pública durante uma briga de trânsito.',
        status: 'aberto',
        agente_id: '55667788-99aa-bbcc-ddee-ff0011223344',
    },
    {
        id: '2e3f4g5h-6i7j-8k9l-0m1n-2o3p4q5r6s7t',
        titulo: 'Estelionato',
        descricao:
            'Relato de golpe virtual envolvendo venda de produtos inexistentes em redes sociais.',
        status: 'solucionado',
        agente_id: '66778899-aabb-ccdd-eeff-001122334455',
    },
    {
        id: '3f4g5h6i-7j8k-9l0m-1n2o-3p4q5r6s7t8u',
        titulo: 'Ameaça',
        descricao: 'Vítima recebeu ameaças de morte por mensagens anônimas.',
        status: 'aberto',
        agente_id: '778899aa-bbcc-ddee-ff00-112233445566',
    },
];

function findAll() {
    return casos;
}

//adiciona
function addCaso(CasoData) {
    const newCaso = {
        id: uuidv4(),
        ...CasoData,
    };
    casos.push(newCaso);
    return newCaso;
}

//remove
function removeCaso(id) {
    const CasoToRemove = casos.findIndex((item) => item.id === id);
    if (CasoToRemove > -1) {
        casos.splice(CasoToRemove, 1);
    }
    return null;
}

//busca
function findCaso(id) {
    return casos.find((item) => item.id === id);
}

//atualiza
function updateCaso(id, CasoData) {
    const index = findCaso(id);
    if (index == -1) {
        return null;
    }
    casos[index] = {
        ...casos[index],
        ...CasoData,
    };

    return casos[index];
}

module.exports = {
    findAll,
    addCaso,
    removeCaso,
    findCaso,
    updateCaso,
};
