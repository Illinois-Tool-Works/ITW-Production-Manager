  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";

  import { getDatabase, ref, set, onValue, push } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js'; // ¡Asegúrate de incluir 'ref' y 'set' y onValue!

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD-2BTqppd41YhQfpTXz280tzY9PlKwWNY",
    authDomain: "indicadores-45c63.firebaseapp.com",
    databaseURL: "https://indicadores-45c63-default-rtdb.firebaseio.com",
    projectId: "indicadores-45c63",
    storageBucket: "indicadores-45c63.firebasestorage.app",
    messagingSenderId: "1060474160227",
    appId: "1:1060474160227:web:af59ffeca9a1c67c96e456"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
//   document.addEventListener("DOMContentLoaded", () => {
//   set(ref(db, 'pruebaEstado'), 'corriendo');
//   console.log('Dato enviado: corriendo');
// });
// Exponer al ámbito global
window.activarComentarioYColor = activarComentarioYColor;
window.cambiarColor = cambiarColor;
window.activarComentario = activarComentario;
window.guardarAlEnter = guardarAlEnter;
window.mostrarTooltip = mostrarTooltip;
window.ocultarTooltip = ocultarTooltip;
window.guardarAlEnter = guardarAlEnter;

// Función para aplicar el color visualmente al cuadro
function cambiarColor(select, id) {
  const color = select.value;
  const div = document.getElementById(id);
  const cuadro = div.querySelector('.cuadro');
  if (cuadro) {
    cuadro.className = `cuadro ${color}`;
  }
}


// Inicializar los primeros 10 indicadores si no existen
function inicializarIndicadores(estados) {
  for (let i = 100; i <= 110; i++) {
    const id = `indicador${i}`;
    if (!estados || !estados[id]) {
      set(ref(db, `indicadores/${id}`), 'gris'); // Valor por defecto
    }
  }
}

import { get, child } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector('.indicadores');
  const selects = contenedor.querySelectorAll('.indicador select');

  // Guardar cambios al seleccionar
  selects.forEach(select => {
    const id = select.closest('.indicador').id;
    select.addEventListener("change", () => {
      const valor = select.value;
      set(ref(db, `indicadores/${id}`), valor);
      cambiarColor(select, id);
    });
  });

  // 🔄 Aquí es donde agregas la lectura en tiempo real
  onValue(ref(db, 'indicadores'), (snapshot) => {
    const estados = snapshot.val();
    if (!estados) return;

    selects.forEach(select => {
      const id = select.closest('.indicador').id;
      if (estados[id]) {
        select.value = estados[id];
        cambiarColor(select, id);
      }
    });
  });

  // Guardar cambios al seleccionar
  selects.forEach(select => {
    const id = select.closest('.indicador').id;
    select.addEventListener("change", () => {
      const valor = select.value;
      set(ref(db, `indicadores/${id}`), valor);
      cambiarColor(select, id);
    });
  });
});



// Detectar cambios y guardar en Firebase
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector('.indicadores');
  const selects = contenedor.querySelectorAll('.indicador select');
  selects.forEach(select => {
    const id = select.closest('.indicador').id;
    select.addEventListener("change", () => {
      const valor = select.value;
      set(ref(db, `indicadores/${id}`), valor);
      cambiarColor(select, id);
    });
  });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////

 // Mostrar campo de comentario al cambiar estado
  function activarComentario(selectElement) {
    const indicador = selectElement.closest('.indicador');
    const input = indicador.querySelector('.comentario-input');
    input.style.display = 'block';
    input.focus();
  }
  function activarComentarioYColor(selectElement, indicadorId) {
  cambiarColor(selectElement, indicadorId);
  activarComentario(selectElement);
}





  // Guardar comentario al presionar Enter
  function guardarAlEnter(event, inputElement) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const comentario = inputElement.value.trim();
      if (!comentario) return;

      const indicador = inputElement.closest('.indicador');
      const indicadorId = indicador.id;
      const estado = indicador.querySelector('select').value;
      const timestamp = new Date().toISOString();

      db.ref(`comentarios/${indicadorId}`).push({
        estado: estado,
        texto: comentario,
        fecha: timestamp
      }).then(() => {
        inputElement.value = "";
        inputElement.style.display = 'none';
        const tooltip = indicador.querySelector('.tooltip-comentario');
        tooltip.textContent = comentario;
      }).catch(error => {
        console.error("Error al guardar:", error);
      });
    }
  }

  // Mostrar tooltip al pasar el cursor
  function mostrarTooltip(spanElement) {
    const indicador = spanElement.closest('.indicador');
    const tooltip = indicador.querySelector('.tooltip-comentario');
    if (tooltip.textContent) {
      tooltip.style.display = 'block';
    }
  }

  // Ocultar tooltip al salir del cursor
  function ocultarTooltip(spanElement) {
    const indicador = spanElement.closest('.indicador');
    const tooltip = indicador.querySelector('.tooltip-comentario');
    tooltip.style.display = 'none';
  }
function guardarAlEnter(event, inputElement) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();

    const comentario = inputElement.value.trim();
    if (!comentario) return;

    const indicador = inputElement.closest('.indicador');
    const indicadorId = indicador.id;
    const estado = indicador.querySelector('select').value;
    const timestamp = new Date().toISOString();

    const comentarioRef = ref(db, `comentarios/${indicadorId}`);
    push(comentarioRef, {
      estado: estado,
      texto: comentario,
      fecha: timestamp
    })
    .then(() => {
      inputElement.value = "";
      inputElement.style.display = 'none';

      const tooltip = indicador.querySelector('.tooltip-comentario');
      if (tooltip) tooltip.textContent = comentario;
    })
    .catch(error => {
      console.error("Error al guardar:", error);
    });
  }
}