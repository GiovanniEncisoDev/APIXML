let btnPrueba = document.getElementById('btn-prueba');
let inputPalabra = document.getElementById('input-palabra');
let btnConsultar = document.getElementById('btn-consultar');
let btnLimpiar = document.getElementById('btn-limpiar');
let resultado = document.getElementById('resultado');

btnPrueba.addEventListener('click', () => {
  consultarPalabra('hello');
});

btnConsultar.addEventListener('click', () => {
  let palabra = inputPalabra.value.trim().toLowerCase();
  if (palabra !== '') {
    consultarPalabra(palabra);
  }
});

btnLimpiar.addEventListener('click', () => {
  inputPalabra.value = ''; // Limpia el input
  resultado.innerHTML = ''; // Borra los resultados
});

// Detecta la tecla Enter y ejecuta la consulta
inputPalabra.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    btnConsultar.click();
  }
});

async function consultarPalabra(palabra) {
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${palabra}`;
  
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(`No se encontró la palabra: "${palabra}"`);
    }

    let data = await response.json();
    let palabraInfo = data[0];

    let audioUrl = palabraInfo.phonetics.find(p => p.audio)?.audio || '';

    let html = `
      <h2>${palabraInfo.word}</h2>
      <p><strong>Fonética:</strong> ${palabraInfo.phonetic || 'No disponible'}</p>
      <p><strong>Origen:</strong> ${palabraInfo.origin || 'No disponible'}</p>
      <h3>Significados</h3>
      <ul>
        ${palabraInfo.meanings.map(meaning => `
          <li>
            <strong>${meaning.partOfSpeech}</strong>
            <ul>
              ${meaning.definitions.map(definition => `
                <li>
                  <p><strong>Definición:</strong> ${definition.definition}</p>
                  <p><strong>Ejemplo:</strong> ${definition.example || 'No disponible'}</p>
                </li>
              `).join('')}
            </ul>
          </li>
        `).join('')}
      </ul>
      <h3>Audio</h3>
      ${audioUrl ? `
        <audio controls>
          <source src="${audioUrl}" type="audio/mp3">
          Tu navegador no soporta el elemento audio.
        </audio>
      ` : '<p>No hay audio disponible</p>'}
    `;

    resultado.innerHTML = html;
  } catch (error) {
    console.error(error);
    resultado.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}
