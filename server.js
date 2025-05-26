const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');
const { calculateHalifaxProfile } = require('./utils/halifax');
const questions = require('./quiz/questions.json');
const { generatePrompt } = require('./utils/promptBuilder');

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

let lastProfile = null;
let memory = {
  valori: "",
  crisi_recenti: "",
  azioni_impegnate: "",
  note_diario: ""
};

// Quiz iniziale (una domanda alla volta)
app.get('/', (req, res) => {
  res.render('quiz', { questions });
});

app.post('/api/quiz/submit', (req, res) => {
  const responses = req.body.responses;
  try {
    lastProfile = calculateHalifaxProfile(responses);
    res.json({ profile: lastProfile });
  } catch (error) {
    console.error("Errore calcolo Halifax:", error.message);
    res.status(500).json({ error: "Errore interno nel quiz." });
  }
});

// Chat
app.get('/chat', (req, res) => {
  res.render('chat', { response: "" });
});

app.post('/ask', async (req, res) => {
  const question = req.body.question?.trim();
  if (!question) return res.render('chat', { response: "La domanda non può essere vuota." });

  try {
    const prompt = generatePrompt(question, lastProfile, memory);
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const reply = response.data.choices[0].message.content;
    res.render('chat', { response: reply });

  } catch (err) {
    console.error("Errore OpenAI:", err.message);
    res.render('chat', { response: "Si è verificato un errore nel generare la risposta." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Mental Wealth attivo sulla porta ${PORT}`));
