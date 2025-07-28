const agentesRepository = require('../repositories/agentesRepository');
function agenteGet(req, res) {
    const { agente, cargo, sort } = req.query;
    let agentes = agentesRepository.findAll();

    if (cargo) {
        agentes = agentes.filter((a) => a.cargo === cargo);
    }

    if (sort) {
        let campo = sort;
        let ordem = 'asc';
        if (sort.startsWith('-')) {
            ordem = 'desc';
            campo = sort.substring(1);
        }

        if (campo === 'dataDeIncorporacao') {
            agentes.sort((a, b) => {
                const dataA = new Date(a.dataDeIncorporacao).getTime();
                const dataB = new Date(b.dataDeIncorporacao).getTime();

                return ordem === 'asc' ? dataA - dataB : dataB - dataA;
            });
        }
    }

    return res.status(200).json(agentes);
}

function listID(req, res) {
    const { id } = req.params;
    const agente = agentesRepository.findAgente(id);

    if (!agente) {
        return res
            .status(404)
            .json({ message: 'Agente com essa ID não encontrado' });
    }

    return res.status(200).json(agente);
}

function isStatusValido(status) {
    return STATUS_VALIDOS.includes(status);
}

function isDataValida(dataStr) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) return false;

    const data = new Date(dataStr);
    if (isNaN(data.getTime())) return false;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return data <= hoje;
}

function addAgente(req, res) {
    const newAgente = req.body;

    if (
        !newAgente ||
        !newAgente.nome ||
        !newAgente.cargo ||
        !newAgente.dataDeIncorporacao
    ) {
        return res
            .status(400)
            .json({ message: 'Dados do agente incompletos ou inválidos' });
    }

    if (isDataValida(newAgente.dataDeIncorporacao) === false) {
        return res
            .status(400)
            .json({ message: 'Data de incorporação inválida' });
    }

    const agenteAdded = agentesRepository.addAgente(newAgente);
    return res.status(201).json(agenteAdded);
}

function updateAgenteFull(req, res) {
    const { id } = req.params;
    const novosDados = req.body;

    if (!novosDados || !id) {
        return res
            .status(400)
            .json({ message: 'Conteúdo a ser inserido não encontrado' });
    }

    if (novosDados.id) {
        delete novosDados.id;
    }

    if (!isStatusValido(novosDados.status)) {
        return res.status(400).json({ message: 'Status inválido' });
    }

    if (!isDataValida(novosDados.dataDeIncorporacao)) {
        return res
            .status(400)
            .json({ message: 'Data de incorporação inválida' });
    }

    let agente = agentesRepository.findAgente(id);

    if (!agente) {
        return res.status(404).json({ message: 'Agente não encontrado' });
    }

    agente = {
        id: agente.id,
        ...novosDados,
    };

    const agenteAtualizado = agentesRepository.updateAgente(agente);

    return res.status(200).json(agenteAtualizado);
}

function updateAgente(req, res) {
    const { id } = req.params;
    const novosDados = req.body;

    if (!novosDados || !id) {
        return res
            .status(400)
            .json({ message: 'Conteúdo a ser inserido não encontrado' });
    }

    if (novosDados.id) {
        delete novosDados.id;
    }

    if (!isStatusValido(novosDados.status)) {
        return res.status(400).json({ message: 'Status inválido' });
    }

    if (!isDataValida(novosDados.dataDeIncorporacao)) {
        return res
            .status(400)
            .json({ message: 'Data de incorporação inválida' });
    }

    let agente = agentesRepository.findAgente(id);
    if (!agente) {
        return res.status(404).json({ message: 'Agente não encontrado' });
    }

    agente = {
        ...agente,
        ...novosDados,
    };


    const agenteAtualizado = agentesRepository.updateAgente(agente);

    return res.status(200).json(agenteAtualizado);
}

function deleteAgente(req, res) {
    const { id } = req.params;

    const agenteRemovido = agentesRepository.removeAgente(id);

    if (!agenteRemovido) {
        return res.status(404).json({ message: 'Agente não encontrado' });
    }

    return res.status(204).send();
}

module.exports = {
    agenteGet,
    listID,
    addAgente,
    updateAgenteFull,
    updateAgente,
    deleteAgente,
};
