  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";

  import { getDatabase, ref, set, onValue, push, update} from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js'; // ¡Asegúrate de incluir 'ref' y 'set' y onValue!

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
    /////////////////////////////////////////////////////////////////////////////
    
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
function enviarComentario(event, inputElement) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    guardarComentario(inputElement);
  }
}

window.enviarComentario = async function (event, input) {
  if (event.key !== "Enter" && !event.shiftKey) return;

  const comentario = input.value.trim();
  if (!comentario) return;

  const indicadorId = input.dataset.indicador;
  const usuario = input.dataset.usuario || "desconocido";
  const timestamp = new Date().toISOString();

  const db = getDatabase();
  const indicadorRef = ref(db, `indicadores/${indicadorId}`);

  await update(indicadorRef, {
    texto: comentario,
    usuario,
    fecha: timestamp
  });

  input.value = "";
  alert(`Comentario actualizado por ${usuario} en ${indicadorId}`);
};

// function enviarComentarioDesdeBoton(inputElement) {
//   guardarComentario(inputElement);
// }


function guardarComentario(inputElement) {
  const comentario = inputElement.value.trim();
  if (!comentario) return;

  const indicadorId = inputElement.dataset.indicador;
  if (!indicadorId) {
    console.warn("Falta data-indicador en el input");
    return;
  }
  const usuario = inputElement.dataset.usuario || "desconocido";
  const indicador = document.getElementById(indicadorId);
  const estado = indicador?.querySelector("select")?.value || "manual";
  const timestamp = new Date().toISOString();

  const comentarioRef = ref(db, `comentarios/${indicadorId}`);
  set(comentarioRef, {
    estado: estado,
    texto: comentario,
    fecha: timestamp,
    usuario: usuario 
  })
  .then(() => {
    console.log(`Comentario actualizado en ${indicadorId}:`, comentario);
    inputElement.value = "";
  })
  .catch(error => {
    console.error(`Error al actualizar comentario en ${indicadorId}:`, error);
  });
}

// ✅ Exponer funciones si usas atributos inline
window.enviarComentario = enviarComentario;
// window.enviarComentarioDesdeBoton = enviarComentarioDesdeBoton;


///////////////////////////mensaje y guardado/////////////////////////////////////////////////////

function cargarComentario(indicadorId) {
  const indicador = document.getElementById(indicadorId);
  const comentarioBox = indicador?.querySelector('.comentario-visible');
  if (!comentarioBox) return;

  const comentarioRef = ref(db, `comentarios/${indicadorId}`);
  onValue(comentarioRef, snapshot => {
    const data = snapshot.val();
    const autor = data?.usuario;
    const fechaFormateada = new Date(data?.fecha).toLocaleString("es-MX", {
  dateStyle: "medium",
  timeStyle: "short"
}
);

comentarioBox.textContent = `${data?.texto || "Sin comentario"} —${autor} ,${fechaFormateada}`;
  });
}
for (let i = 100; i < 110; i++) {
  cargarComentario(`indicador${i}`);
}

document.querySelectorAll('.cuadro').forEach(cuadro => {
  cuadro.addEventListener('click', () => {
    const comentario = cuadro.parentElement.querySelector('.comentario-popover');
    if (comentario) {
      comentario.style.display = comentario.style.display === 'block' ? 'none' : 'block';
    }
  });
});


/////////////////////

function validarUsuario(usuarioId, contraseñaIngresada) {
  return new Promise((resolve) => {
    const userRef = ref(db, `usuarios/${usuarioId}`);
    onValue(userRef, (snapshot) => {
      const datos = snapshot.val();
      if (!datos || datos.contraseña !== contraseñaIngresada) {
        resolve(false);
      } else {
        resolve(datos.nombre); // Devuelve el nombre si es válido
      }
    }, { onlyOnce: true });
  });
}

window.desbloquearComentarioInput = async function () {
  const usuarioId = prompt("ID de usuario:");
  const contraseña = prompt("Contraseña:");

  const nombre = await validarUsuario(usuarioId, contraseña);
  if (!nombre) {
    alert("Credenciales incorrectas. Comentario bloqueado.");
    return;
  }

  const input = document.querySelector('.comentario-input');
  input.disabled = false;
  input.dataset.usuario = nombre;
  alert(`Bienvenido, ${nombre}. Puedes escribir tu comentario.`);
};




