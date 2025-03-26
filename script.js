//Obtiene los elementos del HTML por ID y los guarda en variables
let btnPrueba = document.getElementById('btn-prueba');
let inputPalabra = document.getElementById('input-palabra');
let btnConsultar = document.getElementById('btn-consultar');
let btnLimpiar = document.getElementById('btn-limpiar');
let resultado = document.getElementById('resultado');

// Agrega un evento al botón de prueba para consultar la palabra "hello"
btnPrueba.addEventListener('click', () => {
  consultarPalabra('hello');
});

/*Obtiene la palabra escrita en el input y la consulta, trim para eliminar espacios en blanco y toLowerCase para convertir a minúsculas
Si el input esta vacio llama a la función consultarPalabra con la palabra escrita en el input
*/
btnConsultar.addEventListener('click', () => {
  let palabra = inputPalabra.value.trim().toLowerCase();
  if (palabra !== '') { 
    consultarPalabra(palabra); 
  }
});

//Limpia el input y el resultado
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

//Función asíncrona que consulta la palabra en la API y muestra los resultados en el HTML
async function consultarPalabra(palabra) {
  //Crea URL con la palabra a consultar
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${palabra}`;
  //Si la respuesta no es correcta muestra un error
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(`No se encontró la palabra: "${palabra}"`);
    }
    //Convierte respuesta en JSON
    let data = await response.json();
    let palabraInfo = data[0];
    //Busca si existe audio en la palabra, si no existe lo deja vacío
    let audioUrl = palabraInfo.phonetics.find(p => p.audio)?.audio || '';
    //Genera HTML con los resultados ↓
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
    //↑ Fin del HTML
    //Muestra resultado si hay error lo muestra en rojo↓
    resultado.innerHTML = html;
  } catch (error) {
    console.error(error);
    resultado.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}
