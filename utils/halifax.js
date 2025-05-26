
export function calcolaHexaflex(responses, actItems) {
  const poli = {};

  // Calcola somma pesata per ciascun polo
  actItems.forEach((item, index) => {
    const risposta = responses[index];
    const peso = item.peso;
    const polo = item.polo;

    if (!poli[polo]) {
      poli[polo] = { somma: 0, pesi: 0 };
    }

    poli[polo].somma += risposta * peso;
    poli[polo].pesi += Math.abs(peso);
  });

  // Calcola media normalizzata su scala 0–100
  const profilo = {};
  Object.keys(poli).forEach(polo => {
    const { somma, pesi } = poli[polo];
    const media = somma / pesi;
    const normalizzato = ((media + 5) / 10) * 100;
    profilo[polo] = Math.round(normalizzato);
  });

  return profilo;
}
