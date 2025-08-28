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


function cambiarColor(select, id) {
  const color = select.value;
  const div = document.getElementById(id);
  if (div) {
    div.style.backgroundColor = color;
  }
}
// // Referencia al select del indicador 100
// document.addEventListener("DOMContentLoaded", () => {
//   const select = document.querySelector('#indicador100 select');

//   // Leer estado desde Firebase
//   onValue(ref(db, 'indicadores/indicador100'), (snapshot) => {
//     const valor = snapshot.val();
//     if (valor && select) {
//       select.value = valor;
//       cambiarColor(select, 'indicador100');
//     }
//   });

//   // Guardar estado cuando cambie
//   if (select) {
//     select.addEventListener("change", () => {
//       const valor = select.value;
//       set(ref(db, 'indicadores/indicador100'), valor);
//       cambiarColor(select, 'indicador100');
//     });
//   }
// });


