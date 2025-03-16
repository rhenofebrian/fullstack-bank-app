const { processWithOpenAI, processWithNatural } = require("../models/nlp");

async function chatbotResponse(messages) {
  return await processWithOpenAI(messages);
}

module.exports = { chatbotResponse };
