import { destinationForms } from "../seed/grammar.mjs";

// Unico punto in cui un template di prompt diventa testo. Tenerlo qui evita
// che la stessa interpolazione venga riscritta (e sbagliata) in tre posti.
export function renderPrompt(prompt, { destination, category }) {
  let text = prompt.template;
  if (destination) {
    const forms = destinationForms(destination)[prompt.lang];
    text = text
      .replace(/\{inDestination\}/g, forms.in)
      .replace(/\{theDestination\}/g, forms.the)
      .replace(/\{destination\}/g, forms.bare);
  }
  if (category) {
    text = text.replace(/\{subject\}/g, category.comparativeSubject[prompt.lang]);
  }
  return text;
}
