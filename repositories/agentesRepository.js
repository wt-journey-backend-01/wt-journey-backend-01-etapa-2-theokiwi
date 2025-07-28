const { v4: uuidv4 } = require('uuid');

const agentes = []


function findAll() {
    return agentes
}

//adiciona
function addAgente(agenteData){
  const newAgente = {
    id: uuidv4(),
    ...agenteData
  };
  agentes.push(newAgente);
  return newAgente;
}

//remove
function removeAgente(id){
  const index = agentes.findIndex(item => item.id === id);
  if(index === -1){
    return null;
  }
  const removed = agentes.splice(index, 1)[0];
  return removed;
}
//busca

function findAgente(id){
  return agentes.find(item => item.id === id);
}

//atualiza
function updateAgente(id, agenteData){
  const index = agentes.findIndex(item => item.id === id);
  if(index === -1){
    return null;
  }
  agentes[index] = {
    ...agentes[index],
    ...agenteData
  }
  return agentes[index];
}

module.exports = {
    findAll,
    addAgente,
    removeAgente,
    findAgente,
    updateAgente
}