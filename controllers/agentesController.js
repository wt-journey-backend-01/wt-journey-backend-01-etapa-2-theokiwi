const agentesRepository = require("../repositories/agentesRepository");
function getAllAgentes(req, res) {
  const agentes = agentesRepository.findAll();
  res.json(agentes);
}

function agenteGet(req, res) {
  const { agente, cargo, sort } = req.query;
  let agentes = agentesRepository.findAll();

  if (cargo) {
    agentes = agentes.filter((a) => a.cargo === cargo);
  }

  if (sort) {
    let campo = sort;
    let ordem = "asc";
    if (sort.startsWith("-")) {
      ordem = "desc";
      campo = sort.substring(1);
    }

    if (campo === "dataDeIncorporacao") {
      agentes.sort((a, b) => {
        const dataA = new Date(a.dataDeIncorporacao);
        const dataB = new Date(b.dataDeIncorporacao);

        return ordem === "asc" ? dataA - dataB : dataB - dataA;
      });
    }
  }

  return res.status(200).json(agentes);
}

function listID(req, res) {
  const { id } = req.params;
  const agente = agentesRepository.findAgente(agente_id);

  if(!agente){
    return res.status(404).json({message: "Agente come essa ID não encontrado"});
  }

  return res.status(200).json(agente);
}

function addAgente(req, res){
  const {newAgente} = req.body;
  
  if(!newAgente){
       return res
            .status(400)
            .json({ message: 'Agente a ser inserido não encontrado' });
  }

  const agenteAdded = agentesRepository.addAgente(newAgente);
  return res.status(201).json(agenteAdded);
}

function updateAgenteFull(req, res){
  const {id} = req.params;
  const novosDados = req.body;

  if(!novosDados || !id){
    return res
            .status(400)
            .json({ message: 'Conteúdo a ser inserido não encontrado' });
  }

  let agente = agentesRepository.findAgente(id);

  agente = {
    id: agente.id,
    ...novosDados
  };

  agentesRepository.updateAgente(agente);

  return res.status(200).json(agente);
}


function updateAgente(req, res){
  const {id} = req.params;
  const novosDados = req.body;

  if(!novosDados || !id){
    return res
            .status(400)
            .json({ message: 'Conteúdo a ser inserido não encontrado' });
  }

  let agente = agentesRepository.findAgente(id);

  agente = {
    ...agente,
    ...novosDados
  };

  if (!agente) {
    return res.status(404).json({ message: "Agente não encontrado" });
  }

  agentesRepository.updateAgente(agente);

  return res.status(200).json(agente);
}

function deleteAgente(req, res) {
    const { id } = req.params;

    const agenteRemovido = agentesRepository.removeAgente(id);

    if (!agenteRemovido) {
        return res.status(404).json({ message: 'Agente não encontrado' });
    }

    return res.status(200).json(agenteRemovido);
}

module.exports = {
  getAllAgentes,
  agenteGet,
  listID,
  addAgente,
  updateAgenteFull,
  updateAgente,
  deleteAgente
};
