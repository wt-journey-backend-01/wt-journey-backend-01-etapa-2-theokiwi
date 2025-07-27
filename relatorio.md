<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 0 créditos restantes para usar o sistema de feedback AI.

# Feedback para theokiwi:

Nota final: **60.3/100**

# Feedback para theokiwi 🚔🌟

Olá, theokiwi! Que jornada incrível você está trilhando ao construir essa API para o Departamento de Polícia com Node.js e Express! 🎉 Quero começar parabenizando você por várias coisas que estão muito bem feitas no seu projeto. Bora conversar sobre o que está ótimo e onde podemos dar um upgrade? 😉

---

## 🎯 O que você mandou muito bem

- **Arquitetura modular:** Você organizou seu projeto em `routes`, `controllers` e `repositories` de forma clara e consistente, seguindo bem o padrão MVC. Isso facilita demais a manutenção e a escalabilidade do código. Parabéns por essa organização! 👏

- **Implementação dos endpoints obrigatórios:** Os métodos HTTP para `/agentes` e `/casos` estão presentes e funcionando na maior parte, com tratamento de erros para buscar por ID inexistente, criação com payload inválido, deleção, e atualizações. Isso mostra que você entendeu o fluxo básico de uma API RESTful.

- **Filtros básicos implementados:** Você conseguiu implementar filtros simples para os casos por `status` e `agente_id`, e para agentes por `cargo` e ordenação por `dataDeIncorporacao` (mesmo que ainda precise de ajustes, falaremos disso). Isso já é um diferencial super legal! 🌟

- **Mensagens de erro personalizadas:** Em vários pontos você retorna mensagens claras para o cliente, por exemplo:

  ```js
  return res.status(404).json({ message: 'Agente com essa ID não encontrado' });
  ```

  Isso melhora muito a experiência de quem consome sua API.

---

## 🔍 Pontos importantes para você focar e aprimorar

### 1. Validação e tratamento correto dos dados no PUT e PATCH para agentes e casos

Eu percebi que, embora você tenha implementado os endpoints para atualizar agentes e casos, a validação do payload está incompleta e isso gera problemas importantes, como:

- Você permite atualizar o **ID** do agente e do caso, o que não deve acontecer. O ID é a chave única e imutável do recurso. Por exemplo, no seu `agentesController.js`:

  ```js
  function updateAgenteFull(req, res){
    const {id} = req.params;
    const novosDados = req.body;

    // Aqui falta validar se novosDados.id está presente e impedir a alteração
    // Você faz isso no PATCH, mas no PUT não:
    let agente = agentesRepository.findAgente(id);

    agente = {
      id: agente.id,
      ...novosDados
    };
  }
  ```

  Porém, no repositório, seu `updateAgente` recebe só `agente` e não o `id` separado, e na verdade você está sobrescrevendo o agente sem impedir que `id` seja alterado no PATCH:

  ```js
  function updateAgente(req, res){
    const {id} = req.params;
    const novosDados = req.body;

    if (novosDados.id) {
      delete novosDados.id; 
    }

    // Falta validar se o agente existe antes de montar o objeto
    let agente = agentesRepository.findAgente(id);

    agente = {
      ...agente,
      ...novosDados
    };
  }
  ```

- Além disso, a validação do conteúdo do payload está insuficiente. Por exemplo, não está impedindo que a `dataDeIncorporacao` seja inválida ou esteja no futuro. Isso é um problema porque dados incorretos podem comprometer a integridade do sistema.

- Para os casos, você também permite que o status seja qualquer valor, sem validar se é `'aberto'` ou `'solucionado'`.

**Como melhorar?**

Você deve fazer validações explícitas antes de atualizar o recurso, por exemplo:

```js
// Exemplo de validação para PUT em agentesController.js
if (!novosDados.nome || !novosDados.cargo || !novosDados.dataDeIncorporacao) {
  return res.status(400).json({ message: 'Campos obrigatórios faltando' });
}

if (novosDados.id && novosDados.id !== id) {
  return res.status(400).json({ message: 'Não é permitido alterar o ID do agente' });
}

// Validar dataDeIncorporacao no formato correto e não futura
const dataIncorp = new Date(novosDados.dataDeIncorporacao);
const hoje = new Date();
if (isNaN(dataIncorp.getTime()) || dataIncorp > hoje) {
  return res.status(400).json({ message: 'Data de incorporação inválida' });
}
```

E para o status dos casos:

```js
const statusValido = ['aberto', 'solucionado'];
if (!statusValido.includes(novosDados.status)) {
  return res.status(400).json({ message: 'Status inválido' });
}
```

**Recomendo fortemente este vídeo para entender como fazer validação e tratamento de erros corretamente em APIs Node.js/Express:**  
https://youtu.be/yNDCRAz7CM8?si=Lh5u3j27j_a4w3A_

---

### 2. Correção no status HTTP retornado em algumas respostas

Notei duas situações que precisam de ajuste:

- No método `updateCaso` (PATCH), você retorna status `204 No Content` mas envia um JSON no corpo:

  ```js
  return res.status(204).json(caso);
  ```

  O status 204 indica que não há conteúdo no corpo, então enviar JSON junto não faz sentido e pode quebrar clientes. O ideal é usar `200 OK` se for enviar o recurso atualizado.

- No método `deleteAgente`, você retorna status `204 No Content` com um JSON:

  ```js
  return res.status(204).json(agenteRemovido);
  ```

  Novamente, 204 não deve ter corpo. Se quiser enviar o recurso removido, use 200. Caso contrário, envie 204 com `res.sendStatus(204)` sem corpo.

**Como corrigir?**

```js
// Para PATCH updateCaso
return res.status(200).json(caso);

// Para DELETE deleteAgente
return res.sendStatus(204); // sem corpo
```

Esses detalhes são importantes para respeitar o protocolo HTTP e garantir interoperabilidade.

Para entender melhor sobre status codes e respostas, recomendo:  
https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/204  
https://youtu.be/RSZHvQomeKE (seção sobre status codes)

---

### 3. Endpoint `/casos/:id` está com erro na busca do parâmetro

No seu `casosController.js`, a função para buscar caso por ID está assim:

```js
function listID(req, res) {
    const { caso_id } = req.params;
    let caso = casosRepository.findCaso(caso_id);

    if (!caso) {
        return res.status(404).json({message: "Caso não encontrado"});
    }

    return res.status(200).json(caso);
}
```

Mas no `casosRoutes.js`, a rota está definida como:

```js
router.get("/casos/:id", casosController.listID);
```

Ou seja, o parâmetro na URL é `id`, não `caso_id`. Isso faz com que `caso_id` seja `undefined` e o caso nunca seja encontrado.

**Como corrigir?**

Alinhe o nome do parâmetro para `id`:

```js
function listID(req, res) {
    const { id } = req.params;
    let caso = casosRepository.findCaso(id);

    if (!caso) {
        return res.status(404).json({message: "Caso não encontrado"});
    }

    return res.status(200).json(caso);
}
```

Esse pequeno ajuste vai fazer seu endpoint funcionar corretamente para buscar casos por ID!

---

### 4. Endpoint `/casos/search` para busca full-text não está implementado

Vi que na descrição do seu arquivo de rotas você comentou a necessidade de implementar:

```js
// GET /casos/search?q=homicídio → pesquisa full-text em título e descrição
```

Porém, não encontrei essa rota criada no `casosRoutes.js`. Isso explica porque o filtro por palavras-chave não está funcionando.

**Como implementar?**

Adicione na sua rota:

```js
router.get('/casos/search', casosController.searchCasos);
```

E no controller:

```js
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
```

Isso vai habilitar a pesquisa por palavras-chave no título e descrição dos casos.

---

### 5. Ordenação por `dataDeIncorporacao` em agentes não está funcionando para ordem decrescente

No seu `agentesController.js`, você tenta ordenar agentes assim:

```js
if (campo === "dataDeIncorporacao") {
  agentes.sort((a, b) => {
    const dataA = new Date(a.dataDeIncorporacao);
    const dataB = new Date(b.dataDeIncorporacao);

    return ordem === "asc" ? dataA - dataB : dataB - dataA;
  });
}
```

Porém, `dataA - dataB` não funciona diretamente com objetos Date em JavaScript, porque você está subtraindo objetos, e isso pode dar NaN. O correto é usar `getTime()` para obter o valor numérico da data.

**Como corrigir?**

```js
agentes.sort((a, b) => {
  const dataA = new Date(a.dataDeIncorporacao).getTime();
  const dataB = new Date(b.dataDeIncorporacao).getTime();

  return ordem === "asc" ? dataA - dataB : dataB - dataA;
});
```

Essa mudança corrige a ordenação crescente e decrescente.

---

### 6. Penalidades importantes sobre validação e arquivos

- Você está permitindo registrar agentes com `dataDeIncorporacao` em formato inválido e até no futuro. Isso compromete a qualidade dos dados e pode gerar bugs futuros.

- Falta impedir alteração do ID dos agentes e casos em todas as rotas de update.

- No seu `.gitignore` não está ignorando a pasta `node_modules`, o que pode fazer seu repositório ficar pesado e conter arquivos desnecessários.

Recomendo fortemente revisar esses pontos para evitar problemas de manutenção e garantir qualidade profissional.

---

### 7. Organização de estrutura e arquivos

Sua estrutura de pastas está correta e condiz com o esperado, o que é ótimo! Continue mantendo essa organização para facilitar a leitura e evolução do projeto.

---

## 📚 Recursos para você aprofundar e evoluir

- **Validação de dados e tratamento de erros:**  
  https://youtu.be/yNDCRAz7CM8?si=Lh5u3j27j_a4w3A_  
  https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/400

- **Manipulação de arrays (filter, sort, find):**  
  https://youtu.be/glSgUKA5LjE?si=t9G2NsC8InYAU9cI

- **Express.js - roteamento e estrutura:**  
  https://expressjs.com/pt-br/guide/routing.html  
  https://youtu.be/bGN_xNc4A1k?si=Nj38J_8RpgsdQ-QH

- **HTTP status codes e boas práticas:**  
  https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status  
  https://youtu.be/RSZHvQomeKE

---

## 📝 Resumo rápido para melhorar seu projeto

- 🚫 Impedir alteração do ID em PUT e PATCH para agentes e casos.  
- ✅ Validar corretamente os campos obrigatórios e formatos, especialmente datas e status.  
- 🔧 Corrigir o uso do parâmetro `id` no endpoint `/casos/:id`.  
- ➕ Implementar o endpoint `/casos/search` para busca full-text.  
- 🔄 Ajustar a ordenação por data usando `.getTime()` para funcionar corretamente.  
- 📡 Corrigir status HTTP retornados: usar 200 para respostas com corpo, 204 para respostas sem corpo.  
- 🧹 Adicionar `node_modules` no `.gitignore`.  
- 🔍 Validar que datas não sejam futuras e estejam no formato correto.  

---

## Finalizando... 🚀

theokiwi, você já construiu uma base muito sólida e mostrou que entende os conceitos fundamentais de APIs RESTful com Express! Agora, com esses ajustes nas validações, parâmetros e respostas HTTP, sua API vai ficar ainda mais robusta e profissional. Continue praticando e explorando essas boas práticas — o caminho do aprendizado é longo, mas você está no ritmo certo! 💪😊

Se precisar, volte aos vídeos recomendados para reforçar o que vimos aqui. Estou torcendo pelo seu sucesso! 🎯✨

Abraços e até a próxima revisão! 👮‍♂️👩‍💻

---

Se quiser, posso te ajudar a montar algum desses trechos de código para deixar mais claro, é só pedir!

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>