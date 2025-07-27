const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');

function getAllCasos(req, res) {
    const casos = casosRepository.findAll();
    res.json(casos);
}

function getCasos(req, res) {
    const { status, agente_id, search } = req.query;
    let casos = casosRepository.findAll();

    if (status) {
        casos = casos.filter((caso) => caso.status === status);
    }

    if (agente_id) {
        casos = casos.filter((caso) => caso.agente_id === agente_id);
    }

    if (search) {
        casos = casos.filter(
            (casos) =>
                casos.titulo.toLowerCase().includes(search.toLowerCase()) ||
                casos.descricao.toLowerCase().includes(search.toLowerCase()),
        );
    }

    return res.status(200).json(casos);
}

function getAgenteCaso(req, res) {
    const { caso_id } = req.params;
    let caso = casosRepository.findCaso(caso_id);

    if (!caso) {
        return res.status(404).json({ message: 'Caso não encontrados' });
    }

    const agente_id = casos.agente_id;
    const agente = agentesRepository.findAgente(agente_id);

    return res.status(200).json(agente);
}

function listID(req, res) {
    const { caso_id } = req.params;
    let caso = casosRepository.findCaso(caso_id);

    if (!caso) {
        return res.status(404).json(caso);
    }

    return res.status(200).json(caso);
}

function addCaso(req, res) {
    const { caso_content } = req.body;

    if (!caso_content) {
        return res
            .status(400)
            .json({ message: 'Caso a ser inserido não encontrado' });
    }

    const novoCaso = casosRepository.addCaso(caso_content);

    return res.status(201).json(novoCaso);
}

function updateCasoFull(req, res) {
    const { id } = req.params;
    const novosDados = req.body;

    let caso = casosRepository.findCaso(id);

    if (!caso) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }

    caso = {
        id: caso.id,
        ...novosDados,
    };

    casosRepository.updateCaso(id, caso);

    return res.status(200).json(caso);
}

function updateCaso(req, res) {
    const { id } = req.params;
    const novosDados = req.body;

    let casoExistente = casosRepository.findCaso(id);

    if (!casoExistente) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }

    caso = {
        ...casoExistente,
        ...novosDados,
    };
  
    casosRepository.updateCaso(id, caso);

    return res.status(200).json(caso); 
}

function deleteCaso(req, res) {
    const { id } = req.params;

    const casoRemovido = casosRepository.removeCaso(id);

    if (!casoRemovido) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }

    return res.status(200).json(casoRemovido);
}

module.exports = {
    getAllCasos,
    getCasos,
    getAgenteCaso,
    listID,
    addCaso,
    updateCasoFull,
    updateCaso,
    deleteCaso,
};
