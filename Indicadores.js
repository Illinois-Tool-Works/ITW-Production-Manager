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







// Inicializar los primeros 10 indicadores si no existen
function inicializarIndicadores(estados) {
  for (let i = 1; i <= 140; i++) {
    const id = `indicador${i}`;
    if (!estados || !estados[id]) {
      set(ref(db, `indicadores/${id}`), 'gris'); // Valor por defecto
    }
  }
}

import { get, child } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";


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

  // ✅ Guardar estado completo en ruta secundaria
  const input = select.closest('.indicador').querySelector('.comentario-input');
  const usuario = input?.dataset?.usuario || "Desconocido";

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
  set(comentarioRef, {
    estado,
    usuario,
    fecha
  });
const registroRef = ref(db, `registro/${id}`);
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
  onValue(ref(db, 'indicadores'), (snapshot) => {
    const estados = snapshot.val();
    if (!estados) return;

    selects.forEach(select => {
      const id = select.closest('.indicador')?.id;
      if (id && estados[id]) {
        select.value = estados[id];
        cambiarColor(select, id);
      }
    });
  });
});
document.querySelectorAll(".indicador").forEach(indicador => {
  const id = indicador.id;
  const comentarioVisible2 = indicador.querySelector(".comentario-visible2");

  const refComentario = ref(db, `comentariosIndicadores/${id}`);
  onValue(refComentario, (snapshot) => {
    const datos = snapshot.val();
    if (!datos || !comentarioVisible2) return;

    comentarioVisible2.textContent = `${datos.usuario} seleccionó "${datos.estado}" el ${datos.fecha}`;
    // comentarioVisible2.classList.remove("oculto");
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
  const usuario = input.dataset.usuario || "desconocido";
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
  await update(indicadorRef, {
    texto: comentario,
    usuario,
    fecha: timestamp
  });
  const registroRef = ref(db, `registro/area${area}/${indicadorId}`);
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
  const usuario = inputElement.dataset.usuario || "desconocido";
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

  const comentarioRef = ref(db, `comentarios/${indicadorId}`);
  onValue(comentarioRef, snapshot => {
    const data = snapshot.val();
    const autor = data?.usuario;
    const fechaFormateada = new Date(data?.fecha).toLocaleString("es-MX", {
  dateStyle: "medium",
  timeStyle: "short"
}
);

comentarioBox.textContent = `"${data?.texto || "Sin comentario"}" ,${autor} ,${fechaFormateada}`;
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
  document.querySelector(".button-group").appendChild(eliminarBtn);

  activarBtn.addEventListener("click", async () => {
    if (!edicionActiva) {
      const usuarioId = prompt("ID de usuario:");
      const contraseña = prompt("Contraseña:");

      const nombre = await validarUsuario(usuarioId, contraseña);
      if (!nombre) {
        alert("Credenciales incorrectas. Comentarios bloqueados.");
        return;
      }

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
});
// window.desbloquearIndicador = async function (indicadorId) {
//   const usuarioId = prompt("ID de usuario:");
//   const contraseña = prompt("Contraseña:");

//   const nombre = await validarUsuario(usuarioId, contraseña);
//   if (!nombre) {
//     alert("Credenciales incorrectas. Comentario bloqueado.");
//     return;
//   }

//   const indicador = document.getElementById(indicadorId);
//   if (!indicador) {
//     alert(`No se encontró el indicador "${indicadorId}".`);
//     return;
//   }

//   const input = indicador.querySelector('.comentario-input');
//   const select = indicador.querySelector('select');

//     input.disabled = false;
//     input.dataset.usuario = nombre;
//     select.disabled = false;

//   alert(`Bienvenido, ${nombre}. Puedes editar el indicador ${indicadorId}.`);
// };

////////////////////registro////////////////
document.getElementById("btnRegistro").addEventListener("click", async () => {
  const db = getDatabase();
  const snapshot = await get(ref(db, 'registro'));
  
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
  await update(indicadorRef, estadoData);

  const registroRef = ref(db, `registro/${indicadorId}`);
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
  87: "Área 2",
  88: "Área 2",
  89: "Área 2",
  104: "Área 2",
  10: "Área 2",
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
function contarVerdesPorArea(indicadores, mapa) {
  const conteo = {
    total: 0,
    "Área 1": 0,
    "Área 2": 0
  };

  for (const id in indicadores) {
    const estado = indicadores[id];

    // Extrae el número del ID, por ejemplo "indicador100" → 100
    const idNum = parseInt(id.replace("indicador", ""));
    const area = mapa[idNum];

    console.log(`ID: ${id} → Num: ${idNum} → Estado: ${estado} → Área: ${area}`);

    if (estado === "verde" && area) {
      conteo.total++;
      conteo[area] = (conteo[area] || 0) + 1;
    }
  }

  return conteo;
}



// 🎨 Render en el contenedor fijo
function renderVerdesPorArea(conteo) {
  const container = document.getElementById("conteoEstados");
  container.innerHTML = `
    <span class="badge bg-success fs-6 me-2">Total: ${conteo.total}</span>
    <span class="badge bg-success fs-6 me-2">Área 1: ${conteo["Área 1"]}</span>
    <span class="badge bg-success fs-6">Área 2: ${conteo["Área 2"]}</span>
  `;
}


// 🔄 Escucha en tiempo real desde Firebase
const indicadoresRef = ref(db, "indicadores");

onValue(indicadoresRef, (snapshot) => {
  const indicadores = snapshot.val();
  if (!indicadores) return;

  const conteo = contarVerdesPorArea(indicadores, mapaIndicadores);
  renderVerdesPorArea(conteo);
});
