const { v4: uuidv4 } = require('uuid');

const agentes = [
  {
    "id": "401bccf5-cf9e-489d-8412-446cd169a0f1",
    "nome": "Rommel Carneiro",
    "dataDeIncorporacao": "1992-10-04",
    "cargo": "delegado"
  },
  {
    "id": "a9c32a52-63c5-4f27-9f3e-9ee1d49d982c",
    "nome": "Cláudia Nascimento",
    "dataDeIncorporacao": "2001-03-15",
    "cargo": "inspetor"
  },
  {
    "id": "b2c97e7a-84a3-4ac2-b12b-2cde1a0e2f3f",
    "nome": "Fernando Silveira",
    "dataDeIncorporacao": "1998-07-22",
    "cargo": "delegado"
  },
  {
    "id": "dd112233-4455-6677-8899-aabbccddeeff",
    "nome": "Patrícia Lima",
    "dataDeIncorporacao": "2005-11-02",
    "cargo": "inspetor"
  },
  {
    "id": "22334455-6677-8899-aabb-ccddeeff0011",
    "nome": "Gilberto Souza",
    "dataDeIncorporacao": "2010-05-19",
    "cargo": "delegado"
  },
  {
    "id": "33445566-7788-99aa-bbcc-ddeeff001122",
    "nome": "Aline Costa",
    "dataDeIncorporacao": "2012-08-30",
    "cargo": "inspetor"
  },
  {
    "id": "44556677-8899-aabb-ccdd-eeff00112233",
    "nome": "Renato Figueiredo",
    "dataDeIncorporacao": "1995-02-14",
    "cargo": "delegado"
  },
  {
    "id": "55667788-99aa-bbcc-ddee-ff0011223344",
    "nome": "Mariana Borges",
    "dataDeIncorporacao": "2018-01-09",
    "cargo": "inspetor"
  },
  {
    "id": "66778899-aabb-ccdd-eeff-001122334455",
    "nome": "João Paulo Dias",
    "dataDeIncorporacao": "2007-06-25",
    "cargo": "delegado"
  },
  {
    "id": "778899aa-bbcc-ddee-ff00-112233445566",
    "nome": "Helena Almeida",
    "dataDeIncorporacao": "2016-09-12",
    "cargo": "inspetor"
  }
]


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