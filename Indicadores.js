  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";

  import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js'; // ¡Asegúrate de incluir 'ref' y 'set'!

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

// Función para aplicar el color visualmente
function cambiarColor(select, id) {
  const color = select.value;
  const div = document.getElementById(id);
  if (div) {
    div.style.backgroundColor = color;
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

  // Leer los datos una sola vez
  get(child(ref(db), 'indicadores')).then((snapshot) => {
    if (snapshot.exists()) {
      const estados = snapshot.val();
      selects.forEach(select => {
        const id = select.closest('.indicador').id;
        if (estados[id]) {
          select.value = estados[id];
          cambiarColor(select, id);
        }
      });
    } else {
      console.log("No hay datos en 'indicadores'");
    }
  }).catch((error) => {
    console.error("Error al leer datos:", error);
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
