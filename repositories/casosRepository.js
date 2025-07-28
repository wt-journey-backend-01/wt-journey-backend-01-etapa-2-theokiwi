const { v4: uuidv4 } = require('uuid');

const casos = [];

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
function removeCaso(id){
  const index = casos.findIndex(item => item.id === id);
  if(index === -1){
    return null;
  }
  const removed = casos.splice(index, 1)[0];
  return removed;
}
//busca
function findCaso(id) {
    return casos.find((item) => item.id === id);
}

//atualiza
function updateCaso(id, casosData){
  const index = casos.findIndex(item => item.id === id);
  if(index === -1){
    return null;
  }
  casos[index] = {
    ...casos[index],
    ...casosData
  }
  return casos[index];
}

module.exports = {
    findAll,
    addCaso,
    removeCaso,
    findCaso,
    updateCaso,
};
