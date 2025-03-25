"use strict";

var btnPrueba = document.getElementById('btn-prueba');
var inputPalabra = document.getElementById('input-palabra');
var btnConsultar = document.getElementById('btn-consultar');
var resultado = document.getElementById('resultado');
btnPrueba.addEventListener('click', function () {
  consultarPalabra('hello');
});
btnConsultar.addEventListener('click', function () {
  var palabra = inputPalabra.value.trim();

  if (palabra !== '') {
    consultarPalabra(palabra);
  }
});

function consultarPalabra(palabra) {
  var url = "https://api.dictionaryapi.dev/api/v2/entries/en/".concat(palabra);
  fetch(url).then(function (response) {
    return response.json();
  }).then(function (data) {
    var palabraInfo = data[0];
    var audioUrl = palabraInfo.phonetics && palabraInfo.phonetics[0] && palabraInfo.phonetics[0].audio ? palabraInfo.phonetics[0].audio : '';
    var html = "\n        <h2>".concat(palabraInfo.word, "</h2>\n        <p>Fon\xE9tica: ").concat(palabraInfo.phonetic, "</p>\n        <p>Origen: ").concat(palabraInfo.origin || 'No disponible', "</p>\n        <h3>Significados</h3>\n        <ul>\n          ").concat(palabraInfo.meanings.map(function (meaning) {
      return "\n            <li>\n              <strong>".concat(meaning.partOfSpeech, "</strong>\n              <ul>\n                ").concat(meaning.definitions.map(function (definition) {
        return "\n                  <li>\n                    <p>Definici\xF3n: ".concat(definition.definition, "</p>\n                    <p>Ejemplo: ").concat(definition.example || 'No disponible', "</p>\n                  </li>\n                ");
      }).join(''), "\n              </ul>\n            </li>\n          ");
    }).join(''), "\n        </ul>\n        <h3>Audio</h3>\n        ").concat(audioUrl ? "\n          <audio controls>\n            <source src=\"".concat(audioUrl, "\" type=\"audio/mp3\">\n            Tu navegador no soporta el elemento audio.\n          </audio>\n        ") : 'No hay audio disponible', "\n      ");
    resultado.innerHTML = html;
  })["catch"](function (error) {
    console.error(error);
    resultado.innerHTML = 'Error al consultar la palabra';
  });
}