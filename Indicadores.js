  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
  import { getDatabase, ref, set, onValue, push, update, remove} from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js';
  const firebaseConfig = {
    apiKey: "AIzaSyD-2BTqppd41YhQfpTXz280tzY9PlKwWNY",
    authDomain: "indicadores-45c63.firebaseapp.com",
    databaseURL: "https://indicadores-45c63-default-rtdb.firebaseio.com",
    projectId: "indicadores-45c63",
    storageBucket: "indicadores-45c63.firebasestorage.app",
    messagingSenderId: "1060474160227",
    appId: "1:1060474160227:web:af59ffeca9a1c67c96e456"
  };
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);



  window.sesionActiva = {
  metodo: null,        // "usuario" o "clave"
  id: null,            // usuarioId o clave
  nombre: null         // nombre visible
  };


function cambiarColor(select, id) {
      //  select.disabled = true;
      console.log("Indicadores.js conectado correctamente");

  const color = select.value;
  const div = document.getElementById(id);
  const cuadro = div.querySelector('.cuadro');
  if (cuadro) {
    cuadro.className = `cuadro ${color}`;
  }
}
// Exponer al global
window.cambiarColor = cambiarColor;







// Inicializar los primeros 10 indicadores si no existen
function inicializarIndicadores(estados) {
  for (let i = 1; i <= 140; i++) {
    const id = `indicador${i}`;
    if (!estados || !estados[id]) {
      console.log("1.1");
      set(ref(db, `indicadores/${id}`), 'gris'); // Valor por defecto
       console.log("5");
    }
  }
}

import { get, child } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
//////////
function lecturaSoloSiVisible({ ruta, callback }) {
  let refNodo;
  let unsubscribe;

  function conectar() {
    if (unsubscribe || !document.hasFocus()) return;

    refNodo = ref(db, ruta);
    unsubscribe = onValue(refNodo, snapshot => {
      const datos = snapshot.val();
      if (datos) callback(datos);
    });

    console.log("📡 Conectado a", ruta);
  }

  function desconectar() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
      console.log("🔌 Desconectado de", ruta);
    }
  }

  function verificarEstado() {
    if (document.visibilityState === "visible" && document.hasFocus()) {
      conectar();
    } else {
      desconectar();
    }
  }

  document.addEventListener("visibilitychange", verificarEstado);
  window.addEventListener("focus", verificarEstado);
  window.addEventListener("blur", verificarEstado);

  // Ejecutar al cargar
  verificarEstado();
}
///////////

document.addEventListener("DOMContentLoaded", () => {
  // Selecciona todos los contenedores de columnas
  const columnas = document.querySelectorAll('.indicadores');

  // Recolecta todos los <select> de todas las columnas
  const selects = [];

  columnas.forEach(contenedor => {
    const internos = contenedor.querySelectorAll('.indicador select');
    internos.forEach(select => {
      selects.push(select);

      const id = select.closest('.indicador')?.id;
      if (!id) return;

      // Guardar cambios al seleccionar
      select.addEventListener("change", () => {
  const valor = select.value;

  // 🔄 Guardar solo el valor en la ruta principal
  set(ref(db, `indicadores/${id}`), valor);
   console.log("6");

  // ✅ Guardar estado completo en ruta secundaria
  const input = select.closest('.indicador').querySelector('.comentario-input');
const usuario = window.sesionActiva?.nombre || "Desconocido"; //|| document.getElementById("nombre")?.textContent;


  const fecha = new Date().toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const estadosColor = {
    gris: "No plan",
    rojo: "Paro",
    verde: "Corriendo",
    azul: "Cambio de molde"
  };

  const estado = estadosColor[valor] || valor;

  const comentarioRef = ref(db, `comentariosIndicadores/${id}`);
   console.log("8");
  set(comentarioRef, {
    estado,
    usuario,
    fecha
  });
const registroRef = ref(db, `registro/${id}`);
 console.log("9");
  push(registroRef, {
    estado,
    usuario,
    fecha
  });


  cambiarColor(select, id);
});
    });
  });

  // 🔄 Lectura en tiempo real desde Firebase
lecturaSoloSiVisible({
  ruta: "indicadores",
  callback: (estados) => {
    console.log("1");
    selects.forEach(select => {
      const id = select.closest('.indicador')?.id;
      if (id && estados[id]) {
        select.value = estados[id];
        cambiarColor(select, id);
      }
    });
  }
});
});
document.querySelectorAll(".indicador").forEach(indicador => {
  const id = indicador.id;
  const comentarioVisible2 = indicador.querySelector(".comentario-visible2");
  if (!comentarioVisible2) return;

 lecturaSoloSiVisible({
  ruta: `comentariosIndicadores/${id}`,
  callback: (datos) => {
    console.log("2");
    if (!datos) return;
    comentarioVisible2.textContent = `${datos.usuario} seleccionó "${datos.estado}" el ${datos.fecha}`;
  }
});
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function enviarComentario(event, inputElement) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    guardarComentario(inputElement);
    // inputElement.disabled = true;
  }
}

window.enviarComentario = async function (event, input) {
  if (event.key !== "Enter" && !event.shiftKey) return;

  const comentario = input.value.trim();
  if (!comentario) return;

  const indicadorId = input.dataset.indicador;
  const usuario = window.sesionActiva?.nombre || "Desconocido"; //|| document.getElementById("nombre")?.textContent;

  const timestamp = new Date().toISOString();

  const indicador = document.getElementById(indicadorId);
  const area = indicador?.dataset.area || "desconocida";

  const db = getDatabase();
  const comentarioData = {
    texto: comentario,
    usuario,
    fecha: timestamp
  };

  const indicadorRef = ref(db, `indicadores/${indicadorId}`);
   console.log("10");
  await update(indicadorRef, {
    texto: comentario,
    usuario,
    fecha: timestamp
  });
  const registroRef = ref(db, `registro/area${area}/${indicadorId}`);
   console.log("11");
   await push(registroRef, comentarioData);


  input.value = "";
  // input.disabled = true;
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
  const usuario = window.sesionActiva?.nombre || "Desconocido"; //|| document.getElementById("nombre")?.textContent;

  const indicador = document.getElementById(indicadorId);
  const estado = indicador?.querySelector("select")?.value || "manual";
  const timestamp = new Date().toISOString();
   // 👉 Formatear fecha estilo indicador
  const fechaFormateada = new Date(timestamp).toLocaleString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });


  const comentarioRef = ref(db, `comentarios/${indicadorId}`);
   console.log("12");
  set(comentarioRef, {
    estado: estado,
    texto: comentario,
    fecha: timestamp,//ISO
    usuario: usuario 
  })
  .then(() => {
    console.log(`Comentario actualizado en ${indicadorId}:`, comentario);
    inputElement.value = "";
  })

  .catch(error => {
    console.error(`Error al actualizar comentario en ${indicadorId}:`, error);
  });

  const registroRef = push(ref(db, `registro/${indicadorId}`));
   console.log("13");
  set(registroRef, {
    estado: estado,
    texto: comentario,
     fecha: fechaFormateada, //formato personalizado
    usuario: usuario 
  })
}

// ✅ Exponer funciones si usas atributos inline
window.enviarComentario = enviarComentario;
// window.enviarComentarioDesdeBoton = enviarComentarioDesdeBoton;


///////////////////////////mensaje y guardado/////////////////////////////////////////////////////

function cargarComentario(indicadorId) {
  const indicador = document.getElementById(indicadorId);
  const comentarioBox = indicador?.querySelector('.comentario-visible');
  if (!comentarioBox) return;

   lecturaSoloSiVisible({
    ruta: `comentarios/${indicadorId}`,
    callback: (data) => {
      console.log("3");
      const autor = data?.usuario || "Desconocido";
      const fechaFormateada = new Date(data?.fecha).toLocaleString("es-MX", {
        dateStyle: "medium",
        timeStyle: "short"
      });
      comentarioBox.textContent = `"${data?.texto || "Sin comentario"}", ${autor}, ${fechaFormateada}`;
    }
  });

}
for (let i = 1; i < 140; i++) {
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
       console.log("4");
      const datos = snapshot.val();
      if (!datos || datos.contraseña !== contraseñaIngresada) {
        resolve(false);
      } else {
        resolve(datos.nombre); // Devuelve el nombre si es válido
      }
    }, { onlyOnce: true });
  });
  
}

document.addEventListener("DOMContentLoaded", () => {
  // 🔹 Identificador único por ventana
  const tabId = Date.now().toString();
  sessionStorage.setItem("tabId", tabId);

  let edicionActiva = false;
  let nombreUsuario = null;

  const activarBtn = document.getElementById("activarEdicion");
  const exportarBtn = document.getElementById("btnRegistro");
  const backBtn = document.querySelector(".btn-secondary");
  const eliminarBtn = document.createElement("button");

  exportarBtn.style.display = "none";
  backBtn.style.display = "inline-block";

  eliminarBtn.id = "btnEliminar";
  eliminarBtn.className = "btn btn-danger mt-0.9 ms-2";
  eliminarBtn.textContent = "Eliminar registro";
  eliminarBtn.style.display = "none";
const buttonGroup = document.querySelector(".button-group");
if (buttonGroup) {
  buttonGroup.appendChild(eliminarBtn);
}
if (activarBtn) {

  activarBtn.addEventListener("click", async () => {
    if (!edicionActiva) {
      const usuarioId = prompt("ID de usuario:");
      const contraseña = prompt("Contraseña:");

      const nombre = await validarUsuario(usuarioId, contraseña);
      if (!nombre) {
        alert("Credenciales incorrectas. Comentarios bloqueados.");
        return;
      }
      // ✅ Aquí creas el objeto de sesión
    window.sesionActiva = {
      metodo: "usuario",
      id: usuarioId,
      nombre: nombre
    };


      nombreUsuario = nombre;
      localStorage.setItem("controlActivo", tabId);

      if (localStorage.getItem("controlActivo") !== tabId) return;

      edicionActiva = true;

      activarBtn.classList.add("activo");
      activarBtn.textContent = "Desactivar edición";
      activarBtn.style.backgroundColor = "#dc3545";
      activarBtn.style.color = "white";

      exportarBtn.style.display = "inline-block";
      backBtn.style.display = "none";

      eliminarBtn.style.display = nombre.trim().toLowerCase() === "luis" ? "inline-block" : "none";

      document.querySelectorAll(".indicador select:not(.oculto), .indicador input:not(.oculto)").forEach(el => {
        el.disabled = false;
        if (el.classList.contains("comentario-input")) {
          el.dataset.usuario = nombreUsuario;
        }
      });
    } else {
      edicionActiva = false;
      nombreUsuario = null;
      localStorage.removeItem("controlActivo");

      activarBtn.classList.remove("activo");
      activarBtn.textContent = "Admin";
      activarBtn.style.backgroundColor = "";
      activarBtn.style.color = "";

      exportarBtn.style.display = "none";
      eliminarBtn.style.display = "none";
      backBtn.style.display = "inline-block";

      document.querySelectorAll(".indicador select, .indicador input").forEach(el => {
        el.disabled = true;
      });
    }
  });

  // 🔹 Escuchar si otra ventana toma el control
  window.addEventListener("storage", (e) => {
    if (e.key === "controlActivo" && e.newValue !== tabId) {
      edicionActiva = false;
      nombreUsuario = null;

      activarBtn.classList.remove("activo");
      activarBtn.textContent = "Admin";
      activarBtn.style.backgroundColor = "";
      activarBtn.style.color = "";

      exportarBtn.style.display = "none";
      eliminarBtn.style.display = "none";
      backBtn.style.display = "inline-block";

      document.querySelectorAll(".indicador select, .indicador input").forEach(el => {
        el.disabled = true;
      });
    }
  });

  // 🔹 Limpiar control si esta ventana se cierra
  window.addEventListener("beforeunload", () => {
    if (localStorage.getItem("controlActivo") === tabId) {
      localStorage.removeItem("controlActivo");
    }
  });

  // 🔹 Lógica de eliminación con confirmación
  if (!eliminarBtn.dataset.listenerAgregado) {
    eliminarBtn.addEventListener("click", async () => {
      const confirmacion = confirm("¿Estás seguro de que quieres borrar el registro?");
      if (!confirmacion) return;

      try {
        await remove(ref(db, 'registro'));
         console.log("14");
        // await remove(ref(db, 'registroindicadores'));
        console.log("Registro eliminado correctamente.");
      } catch (error) {
        console.error("Error al eliminar registro:", error.message);
        alert("Hubo un problema al eliminar los registros.");
      }
    });
    eliminarBtn.dataset.listenerAgregado = "true";
  }

  // 🔹 Mostrar campos al hacer clic en el cuadro
  document.querySelectorAll(".cuadro").forEach(cuadro => {
    cuadro.addEventListener("click", (e) => {
      e.stopPropagation();

      const id = cuadro.dataset.indicador;
      const indicador = document.getElementById(id);

      document.querySelectorAll(".indicador").forEach(ind => {
        if (ind !== indicador) {
          ind.querySelectorAll("select, input, .comentario-visible, .comentario-visible2").forEach(el => {
            el.classList.add("oculto");
            el.disabled = true;
          });
        }
      });

      const ocultos = indicador.querySelectorAll(".oculto");
      ocultos.forEach(el => {
        el.classList.remove("oculto");
        if (edicionActiva) {
          el.disabled = false;
          if (el.classList.contains("comentario-input")) {
            el.dataset.usuario = nombreUsuario;
          }
        }
      });
    });
  });

  // 🔹 Ocultar campos si se hace clic fuera
  document.addEventListener("click", (e) => {
    document.querySelectorAll(".indicador").forEach(indicador => {
      if (!indicador.contains(e.target)) {
        const visibles = indicador.querySelectorAll("select, input, .comentario-visible, .comentario-visible2");
        visibles.forEach(el => {
          el.classList.add("oculto");
          el.disabled = true;
        });
      }
    });
  });
}
});

// Indicadores.js

export async function generarFingerprint() {
  const raw = JSON.stringify({
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screen: {
      width: screen.width,
      height: screen.height
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, '0')).join('');
}


export async function verificarSesion() {
  const cookieClave = document.cookie.split('; ').find(row => row.startsWith('clave='));
  const clave = cookieClave?.split('=')[1];
  if (!clave) return false;

  const snapshot = await get(child(ref(db), `clavesValidas/${clave}`));
  if (!snapshot.exists()) return false;

  const datos = snapshot.val();
  const nombre = datos.nombre || "Sin nombre";
  document.getElementById("nombre").textContent = nombre;
  activarCamposPorClave();

  // activarGuardadoPorClave(nombre); // ← activa el guardado automático
  return true;
}


export async function iniciarSesion() {
  const clave = prompt("Ingresa tu clave de acceso:");
  if (!clave) return false;

  const snapshot = await get(child(ref(db), `clavesValidas/${clave}`));
  if (!snapshot.exists()) {
    alert("Clave inválida");
    return false;
  }

 document.cookie = `clave=${clave}; path=/; max-age=604800`; // 7 días
const datos = snapshot.val();
const nombre = datos.nombre || "Sin nombre";
document.getElementById("nombre").textContent = nombre;

// ✅ Aquí creas el objeto de sesión unificado
window.sesionActiva = {
  metodo: "clave",     // ← indica que fue acceso por clave
  id: clave,           // ← identificador técnico (clave)
  nombre: nombre       // ← nombre visible (ej. "Supervisor Norte")
};
activarCamposPorClave();
// activarGuardadoPorClave(nombre); // ← activa el guardado automático
return true;

}

window.desbloquearIndicador = async function (indicadorId) {
  const usuarioId = prompt("ID de usuario:");
  const contraseña = prompt("Contraseña:");

  const nombre = await validarUsuario(usuarioId, contraseña);
  if (!nombre) {
    alert("Credenciales incorrectas. Comentario bloqueado.");
    return;
  }

  const indicador = document.getElementById(indicadorId);
  if (!indicador) {
    alert(`No se encontró el indicador "${indicadorId}".`);
    return;
  }

  const input = indicador.querySelector('.comentario-input');
  const select = indicador.querySelector('select');

    input.disabled = false;
    input.dataset.usuario = nombre;
    select.disabled = false;

  alert(`Bienvenido, ${nombre}. Puedes editar el indicador ${indicadorId}.`);
};

////////////////////registro////////////////
document.getElementById("btnRegistro").addEventListener("click", async () => {
  const db = getDatabase();
  const snapshot = await get(ref(db, 'registro'));
   console.log("15");
  
  // Detectar área según el nombre de la página
let areaActual = "Área desconocida";
if (location.pathname.includes("pagina1.html")) {
  areaActual = "Área 1";
} else if (location.pathname.includes("pagina2.html")) {
  areaActual = "Área 2";
}

  if (!snapshot.exists()) {
    alert("No hay registros para exportar.");
    return;
  }

  const registros = snapshot.val();
  const filas = [];

  Object.entries(registros).forEach(([indicadorId, entradas]) => {
  const idNumerico = indicadorId.replace("indicador", ""); // extrae solo el número
  const area = mapaIndicadores[idNumerico] || "Área desconocida";

    Object.entries(entradas).forEach(([clave, datos]) => {
      filas.push({
         Área: area,
        Indicador: indicadorId,
        Estado: datos.estado,
        Comentario: datos.texto,
        Usuario: datos.usuario,
        Fecha: datos.fecha,
        // FechaIndicador: datos.fechaHora
      });
    });
  });

   const filasOrdenadas = filas.sort((a, b) => {
  // Ordenar por Área
  if (a.Área < b.Área) return -1;
  if (a.Área > b.Área) return 1;

  // Si el Área es igual, ordenar por Indicador
  if (a.Indicador < b.Indicador) return -1;
  if (a.Indicador > b.Indicador) return 1;

  // Si el Indicador es igual, ordenar por Fecha
  const fechaA = new Date(a.Fecha.replace(/a\.m\.|p\.m\./, match => match === "p.m." ? "PM" : "AM"));
  const fechaB = new Date(b.Fecha.replace(/a\.m\.|p\.m\./, match => match === "p.m." ? "PM" : "AM"));
  return fechaA - fechaB;
});

  // 🧾 Generar Excel
  const hoja = XLSX.utils.json_to_sheet(filas);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Registro");

  XLSX.writeFile(libro, `registro_${new Date().toISOString().slice(0, 10)}.xlsx`);

});

//////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  let indicadorActivo = null;

  // Activar indicador al hacer clic en cualquier cuadro
  document.querySelectorAll(".cuadro").forEach(cuadro => {
    cuadro.addEventListener("click", (e) => {
      e.stopPropagation();

      const id = cuadro.dataset.indicador;
      const indicador = document.getElementById(id);

      // Ocultar el anterior si hay uno activo
      if (indicadorActivo && indicadorActivo !== indicador) {
        ocultarIndicador(indicadorActivo);
      }

      mostrarIndicador(indicador);
      indicadorActivo = indicador;
    });
  });

  // Ocultar indicador activo si se hace clic fuera
  document.addEventListener("click", (e) => {
    if (indicadorActivo && !indicadorActivo.contains(e.target)) {
      ocultarIndicador(indicadorActivo);
      indicadorActivo = null;
    }
  });

  function mostrarIndicador(indicador) {
    const ocultos = indicador.querySelectorAll(".oculto");
    ocultos.forEach(el => {
      el.classList.remove("oculto");
      if (el.tagName === "SELECT" || el.tagName === "INPUT") {
        el.disabled = false;
      }
    });
  }

  function ocultarIndicador(indicador) {
    const visibles = indicador.querySelectorAll("select, input, .comentario-visible,.comentario-visible2");
    visibles.forEach(el => {
      el.classList.add("oculto");
      if (el.tagName === "SELECT" || el.tagName === "INPUT") {
        el.disabled = true;
      }
    });
  }
});
////////////////////////////

window.enviarEstado = async function (selectElement) {
  const indicadorId = selectElement.closest('.indicador')?.id;
  if (!indicadorId) return;

  const usuario = selectElement.closest('.indicador')
    .querySelector('.comentario-input')?.dataset?.usuario || "desconocido";

  const color = selectElement.value;

  const estadosColor = {
    gris: "No plan",
    rojo: "Paro",
    verde: "Corriendo",
    azul: "Cambio de molde"
  };

  const estado = estadosColor[color] || color;

  const timestamp = new Date().toISOString();

  const db = getDatabase();
  const estadoData = {
    estado,
    usuario,
    fecha: timestamp
  };

  const indicadorRef = ref(db, `indicadores/${indicadorId}`);
   console.log("16");
  await update(indicadorRef, estadoData);

  const registroRef = ref(db, `registro/${indicadorId}`);
   console.log("17");
  await push(registroRef, estadoData);

  selectElement.disabled = true;

  alert(`Estado actualizado por ${usuario} en ${indicadorId}: ${estado}`);
};
document.querySelectorAll('.cuadro').forEach(cuadro => {
  cuadro.addEventListener('click', () => {
    const indicadorId = cuadro.dataset.indicador;
    const indicador = document.getElementById(indicadorId);
    const columna = indicador.closest('.columna-indicador');

    // Remover expansión de todas las columnas
    document.querySelectorAll('.columna-indicador').forEach(col => {
      col.classList.remove('expandida');
    });

    // Expandir solo la columna activa
    // columna.classList.add('expandida');
  });
});

///////////////////////////////
const mapaIndicadores = {
  48: "Área 1",
  49: "Área 1",
  50: "Área 1",
  51: "Área 1",
  52: "Área 1",
  53: "Área 1",
  54: "Área 1",
  55: "Área 1",
  108: "Área 1",
  42: "Área 1",
  25: "Área 1",
  36: "Área 1",
  27: "Área 1",
  103: "Área 1",
  40: "Área 1",
  35: "Área 1",
  70: "Área 1",
  44: "Área 1",
  45: "Área 1",
  33: "Área 1",
  85: "Área 1",
  39: "Área 1",
  18: "Área 1",
  32: "Área 1",
  47: "Área 1",
  46: "Área 1",
  105: "Área 1",
  43: "Área 1",
  10: "Área 1",
  9: "Área 1",
  128: "Área 1",
  129: "Área 1",
  131: "Área 1",
  123: "Área 2",
  118: "Área 2",
  97: "Área 2",
  114: "Área 2",
  87: "Área 2",
  88: "Área 2",
  89: "Área 2",
  104: "Área 2",
  101: "Área 2",
  117: "Área 2",
  124: "Área 2",
  81: "Área 2",
  99: "Área 2",
  102: "Área 2",
  91: "Área 2",
  126: "Área 2",
  90: "Área 2",
  38: "Área 2",
  74: "Área 2",
  116: "Área 2",
  106: "Área 2",
  112: "Área 2",
  119: "Área 2",
  111: "Área 2",
  113: "Área 2",
  109: "Área 2",
  110: "Área 2",
  115: "Área 2",
  86: "Área 2",
  122: "Área 2",
  75: "Área 2",
  92: "Área 2",
  121: "Área 2",
  130: "Área 2",
  127: "Área 2",
  125: "Área 2",
  73: "Área 2",
  71: "Área 2",
  72: "Área 2",
  34: "Área 2",
  93: "Área 2",
  37: "Área 2",
  94: "Área 2",
  95: "Área 2",
  100: "Área 2",
  107: "Área 2",
  98: "Área 2",
  96: "Área 2",
  // y así sucesivamente...
};
document.querySelectorAll(".indicador").forEach(indicador => {
  indicador.addEventListener("click", () => {
    const grupo = indicador.closest(".grupo-indicadores");
    if (grupo) {
      grupo.classList.add("reducido-derecha");
    }
  });
});
const estadosColor = {
  gris: "No plan",
  rojo: "Paro",
  verde: "Corriendo",
  azul: "Cambio de molde"
};

let areaActual = null;

// Si existe <body2>, úsalo para obtener el área
const body2 = document.querySelector("body2");
if (body2) {
  areaActual = body2.dataset.area || null;
}

// Función para contar estados
function contarEstados(indicadores, mapa, areaActual) {
  const total = {};
  const porArea = {};

  for (const id in indicadores) {
    const estado = indicadores[id];
    const idNum = parseInt(id.replace("indicador", ""));
    const area = mapa[idNum];

    if (!estado || !area) continue;

    // Filtrar si estamos en una página de área específica
    if (areaActual && area !== areaActual) continue;

    // Conteo total
    total[estado] = (total[estado] || 0) + 1;

    // Conteo por área (solo en página principal)
    if (!areaActual) {
      if (!porArea[area]) porArea[area] = {};
      porArea[area][estado] = (porArea[area][estado] || 0) + 1;
    }
  }



  return { total, porArea };
}



// 🎨 Render en el contenedor fijo
// Render adaptativo
function renderConteo({ total, porArea }, areaActual) {
  const container = document.getElementById("conteoEstados");
  if (!container) return; // Silencioso si no existe
  
  container.innerHTML = "";

  // Encabezado
  const header = document.createElement("div");
  header.className = "fw-bold mb-1";
  header.textContent = areaActual ? `${areaActual}:` : "Total:";
  container.appendChild(header);

  // Totales
  for (const estado in total) {
    const badge = document.createElement("span");
    badge.className = `badge me-2 mb-1 bg-${colorBootstrap(estado)} fs-6`;
    badge.textContent = `${total[estado]}`;
    container.appendChild(badge);
  }


 // Desglose por área (solo en página principal)
  if (!areaActual) {
    for (const area in porArea) {
      const areaHeader = document.createElement("div");
      areaHeader.className = "fw-bold mt-3 mb-1";
      areaHeader.textContent = `${area}:`;
      container.appendChild(areaHeader);

      for (const estado in porArea[area]) {
        const badge = document.createElement("span");
        badge.className = `badge me-2 mb-1 bg-${colorBootstrap(estado)} fs-6`;
        badge.textContent = `${porArea[area][estado]}`;
        container.appendChild(badge);
      }
    }
  }

}

function colorBootstrap(estado) {
  switch (estado) {
    case "verde": return "success";
    case "rojo": return "danger";
    case "azul": return "primary";
    case "gris": return "secondary";
    default: return "dark";
  }
}
// 🔄 Escucha en tiempo real desde Firebase
console.log("18");
lecturaSoloSiVisible({
  ruta: "indicadores",
  callback: (indicadores) => {
    console.log("19");
    const conteo = contarEstados(indicadores, mapaIndicadores, areaActual);
    renderConteo(conteo, areaActual);
  }
});

////////////////////////////////

// function activarGuardadoPorClave(nombreDesdeClave) {
//   const estadosColor = {
//     gris: "No plan",
//     rojo: "Paro",
//     verde: "Corriendo",
//     azul: "Cambio de molde"
//   };

//   function obtenerFecha() {
//     return new Date().toLocaleString('es-MX', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit'
//     });
//   }

//   // 🟢 Guardado por SELECT
//   document.querySelectorAll(".indicador select").forEach(select => {
//     select.addEventListener("change", async () => {
//       const id = select.closest(".indicador")?.id;
//       if (!id) return;

//       const valor = select.value;
//       const comentarioInput = select.closest(".indicador").querySelector(".comentario-input");
//       const comentario = comentarioInput?.value || "";
//       const fecha = obtenerFecha();
//       const estado = estadosColor[valor] || valor;

//       await set(ref(db, `indicadores/${id}`), valor);

//       await set(ref(db, `comentariosIndicadores/${id}`), {
//         estado,
//         comentario,
//         usuario: nombreDesdeClave,
//         fecha
//       });

//       await push(ref(db, `registro/${id}`), {
//         estado,
//         comentario,
//         usuario: nombreDesdeClave,
//         fecha
//       });

//       cambiarColor(select, id);
//     });
//   });

//   // 🟠 Guardado por INPUT
//   document.querySelectorAll(".comentario-input").forEach(input => {
//     input.addEventListener("keydown", async (e) => {
//       if (e.key !== "Enter") return;

//       const id = input.dataset.indicador;
//       const comentario = input.value;
//       const select = document.getElementById(id)?.querySelector("select");
//       const valor = select?.value || "gris";
//       const fecha = obtenerFecha();
//       const estado = estadosColor[valor] || valor;

//       await set(ref(db, `comentarios/${id}`), {
//         estado,
//         comentario,
//         usuario: nombreDesdeClave,
//         fecha
//       });

//       await push(ref(db, `registro/${id}`), {
//         estado,
//         comentario,
//         usuario: nombreDesdeClave,
//         fecha
//       });

//       cambiarColor(select, id);
//     });
//   });
// }
function activarCamposPorClave() {
  document.querySelectorAll(".indicador select, .indicador input").forEach(el => {
    el.disabled = false;

    // Si es un input de comentario, firma con el nombre
    if (el.classList.contains("comentario-input")) {
      el.dataset.usuario = window.sesionActiva?.nombre || "Desconocido";
    }
  });
}
