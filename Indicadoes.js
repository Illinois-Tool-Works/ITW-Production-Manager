  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
  import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
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
// 🔄 Leer todos los estados al cargar
onValue(ref(db, 'indicadores'), (snapshot) => {
  const estados = snapshot.val();
  if (estados) {
    Object.keys(estados).forEach(id => {
      const select = document.querySelector(`#${id} select`);
      if (select) {
        select.value = estados[id];
        cambiarColor(select, id); // Aplica el color visualmente
      }
    });
  }
});
function cambiarColor(select, id) {
  const color = select.value;
  const div = document.getElementById(id);
  if (div) {
    div.style.backgroundColor = color;
  }
}
// 📤 Guardar estado cuando cambie el select
document.addEventListener("DOMContentLoaded", () => {
  const selects = document.querySelectorAll('.indicador select');
  selects.forEach(select => {
    const id = select.closest('.indicador').id;
    select.addEventListener("change", () => {
      set(ref(db, `indicadores/${id}`), select.value);
    });
  });
});

