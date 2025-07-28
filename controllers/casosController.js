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
    const { id } = req.params;
    let caso = casosRepository.findCaso(id);

    if (!caso) {
        return res.status(404).json({ message: 'Caso não encontrados' });
    }
    if (!caso.agente_id) {
        return res
            .status(404)
            .json({ message: 'Caso não possui agente associado' });
    }

    const agente_id = caso.id;
    if (!casosRepository.findAgente(caso.agente_id)) {
        return res.status(404).json({ message: 'Agente não encontrado' });
    } else {
        const agente = agentesRepository.findAgente(agente_id);
    }

    return res.status(200).json(agente);
}

function listID(req, res) {
    const { id } = req.params;
    let caso = casosRepository.findCaso(id);

    if (!caso) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }

    return res.status(200).json(caso);
}

function addCaso(req, res) {
    const casoData = req.body;

    if (
        !casoData ||
        !casoData.titulo ||
        !casoData.descricao ||
        !casoData.status ||
        !casoData.agente_id
    ) {
        return res
            .status(400)
            .json({ message: 'Dados do caso incompletos ou inválidos' });
    }

    const agenteExiste = agentesRepository.findAgente(casoData.agente_id);
    if (!agenteExiste) {
        return res
            .status(404)
            .json({ message: 'Agente responsável não encontrado' });
    }

    const novoCaso = casosRepository.addCaso(casoData);

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

    if (novosDados.id) {
        delete novosDados.id;
    }
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

function searchCasos(req, res) {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ message: 'Query de busca não fornecida' });
  }

  let casos = casosRepository.findAll();

  casos = casos.filter(caso =>
    caso.titulo.toLowerCase().includes(q.toLowerCase()) ||
    caso.descricao.toLowerCase().includes(q.toLowerCase())
  );

  return res.status(200).json(casos);
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
    searchCasos
};
