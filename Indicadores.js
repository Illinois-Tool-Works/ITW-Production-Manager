  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";

  import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js'; // ¡Asegúrate de incluir 'ref' y 'set' y onValue!

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

// // Función para aplicar el color visualmente al cuadro
// function cambiarColor(select, id) {
//   const color = select.value;
//   const div = document.getElementById(id);
//   const cuadro = div.querySelector('.cuadro');
//   if (cuadro) {
//     cuadro.className = `cuadro ${color}`;
//   }
// }


// Inicializar los primeros 10 indicadores si no existen
function inicializarIndicadores(estados) {
  for (let i = 100; i <= 130; i++) {
    const id = `indicador${i}`;
    if (!estados || !estados[id]) {
      set(ref(db, `indicadores/${id}`), 'gris'); // Valor por defecto
    }
  }
}

import { get, child } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

function cambiarColor(select, id) {
  const color = select.value;
  const div = document.getElementById(id);
  const cuadro = div.querySelector('.cuadro');
  if (cuadro) {
    cuadro.style.backgroundColor = color;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector('.indicadores');
  const selects = contenedor.querySelectorAll('.indicador select');
  const comentarios = contenedor.querySelectorAll('.indicador .comentario');

  // Guardar estado al cambiar el select
  selects.forEach(select => {
    const id = select.closest('.indicador').id;
    select.addEventListener("change", () => {
      const comentario = document.querySelector(`#${id} .comentario`).value;
      const estado = select.value;
      const horaComentario = new Date().toISOString();
      set(ref(db, `indicadores/${id}`), { estado, comentario, horaComentario });
      cambiarColor(select, id);
    });
  });

  // Guardar comentario al escribir
  comentarios.forEach(textarea => {
    const id = textarea.closest('.indicador').id;
    textarea.addEventListener("input", () => {
      const estado = document.querySelector(`#${id} select`).value;
      const comentario = textarea.value;
      const horaComentario = new Date().toISOString();
      set(ref(db, `indicadores/${id}`), { estado, comentario, horaComentario });
    });
  });

  // Escuchar cambios en tiempo real
  onValue(ref(db, 'indicadores'), (snapshot) => {
    const estados = snapshot.val();
    if (!estados) return;

    selects.forEach(select => {
      const id = select.closest('.indicador').id;
      if (estados[id]) {
        select.value = estados[id].estado;
        cambiarColor(select, id);
        const textarea = document.querySelector(`#${id} .comentario`);
        if (textarea) textarea.value = estados[id].comentario || '';
      }
    });
  });
  const horaDiv = document.querySelector(`#${id} .hora-comentario`);
if (horaDiv && estados[id].horaComentario) {
  const fecha = new Date(estados[id].horaComentario).toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short"
  });
  horaDiv.textContent = `Última actualización: ${fecha}`;
}

});