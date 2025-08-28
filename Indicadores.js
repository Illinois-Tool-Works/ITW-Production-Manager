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

 console.log("Intentando leer indicadores.. ..");

// Leer estados desde Firebase al cargar
onValue(ref(db, 'indicadores'), (snapshot) => {
  const estados = snapshot.val();
  if (estados) {
    const contenedor = document.querySelector('.indicadores');
    const selects = contenedor.querySelectorAll('.indicador select');
    selects.forEach(select => {
      const id = select.closest('.indicador').id;
      if (estados[id]) {
        select.value = estados[id];
        cambiarColor(select, id);
      }
    });
  }
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




