const express = require('express');
const app = express();
const agentesRouter = require("./routes/agentesRouter")
const casosRouter = require("./routes/casosRouter")
const PORT = 3000;

app.use(agentesRouter);
app.use(casosRouter);

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT} em modo de desenvolvimento`);
}); 