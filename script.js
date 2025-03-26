let btnPrueba = document.getElementById('btn-prueba');
let inputPalabra = document.getElementById('input-palabra');
let btnConsultar = document.getElementById('btn-consultar');
let btnConsultarXML = document.getElementById('btn-consultar-xml');
let btnLimpiar = document.getElementById('btn-limpiar');
let resultado = document.getElementById('resultado');

// Evento para consulta con fetch (botón de lupa)
btnConsultar.addEventListener('click', () => {
  let palabra = inputPalabra.value.trim().toLowerCase();
  if (palabra !== '') {
    consultarPalabra(palabra);
  }
});

// Evento para consulta con XMLHttpRequest (botón de código)
btnConsultarXML.addEventListener('click', () => {
  let palabra = inputPalabra.value.trim().toLowerCase();
  if (palabra !== '') {
    consultarPalabraXML(palabra);
  }
});

// Evento para limpiar el input y los resultados
btnLimpiar.addEventListener('click', () => {
  inputPalabra.value = '';
  resultado.innerHTML = '';
});

// Evento para presionar Enter y buscar la palabra
inputPalabra.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    btnConsultar.click();
  }
});

// Función para consultar la API con Fetch (ya existente)
async function consultarPalabra(palabra) {
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${palabra}`;
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(`No se encontró la palabra: "${palabra}"`);
    }
    let data = await response.json();
    mostrarResultado(data);
  } catch (error) {
    resultado.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

// Función para consultar la API con XMLHttpRequest
function consultarPalabraXML(palabra) {
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${palabra}`;
  let xhr = new XMLHttpRequest();

  console.log(`📡 Enviando solicitud a: ${url}`); // Verifica la URL en la consola

  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(`✅ Estado: ${xhr.status}`); // Verifica el estado de la respuesta
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        console.log('📦 Respuesta recibida:', data); // Muestra los datos en consola
        mostrarResultado(data);
      } else {
        resultado.innerHTML = `<p style="color:red;">No se encontró la palabra: "${palabra}"</p>`;
      }
    }
  };
  xhr.send();
}


// Función para mostrar resultados en la página (evita código duplicado)
function mostrarResultado(data) {
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
}
