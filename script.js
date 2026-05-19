const btnPedido = document.getElementById("btn-pedido")
const statusContainer = document.getElementById("simulacion")
const proceso = {
  tiempoProcesado: 3000,
  tiempoPreparacion: 4000,
  probabilidadExito: 0.70 
};

const limpiarInterfaz = () => {
  statusContainer.innerHTML = "";
  btnPedido.disabled = true;
};

const restaurarBoton = () => {
  btnPedido.disabled = false;
};

const agregarEstado = (mensaje, tipo = "info") => {
  const parrafo = document.createElement("p");
  parrafo.className = `status-item status-${tipo}`;
  parrafo.innerHTML = mensaje;
  statusContainer.appendChild(parrafo);
};

const alternarLoader = (mostrar, texto = "Procesando...") => {
  if (mostrar) {
    const loader = document.createElement("div");
    loader.id = "dinamic-loader";
    loader.innerHTML = `<span>${texto}</span> <span class="loader"></span>`;
    statusContainer.appendChild(loader);
  } else {
    const loader = document.getElementById("dinamic-loader");
    if (loader) loader.remove();
  }
};

const verificarDisponibilidad = () => Math.random() < proceso.probabilidadExito;

const realizarPedido = () => {
  return new Promise((resolve, reject) => {
    alternarLoader(true, "Enviando orden a la cocina... 📝");
    
    setTimeout(() => {
      alternarLoader(false);
      if (verificarDisponibilidad()) {
        resolve("Pedido recibido y aprobado por la cocina ✅");
      } else {
        reject("El restaurante no pudo procesar tu orden en este momento ❌");
      }
    }, proceso.tiempoProcesado);
  });
};

const prepararProducto = (producto, emoji) => {
  return new Promise((resolve) => {
    agregarEstado(`Preparando ${producto}... ⏳`, "preparing");
    
    setTimeout(() => {
      resolve(`${producto} listo ${emoji}`);
    }, proceso.tiempoPreparacion);
  });
};

const iniciarSimulador = async () => {
  limpiarInterfaz();

  try {
    const confirmacion = await realizarPedido(); // registro del pedido
    agregarEstado(confirmacion, "success");

    const productos = [ // Preparación de los platos
      { nombre: "Bebida", emoji: "🥤" },
      { nombre: "Pizza",  emoji: "🍕" },
      { nombre: "Postre", emoji: "🍰" }
    ];

    for (const prod of productos) {
      const resultadoPlato = await prepararProducto(prod.nombre, prod.emoji);
      agregarEstado(resultadoPlato, "success");
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); // Entrega final
    agregarEstado("¡Disfruta tu comida! Todo ha sido servido con éxito ✨", "final");

  } catch (error) {
    console.error(`[Error de simulación]: ${error}`);
    agregarEstado(`AVISO: ${error}`, "error");
  } finally {
    restaurarBoton();
  }
};

btnPedido.addEventListener("click", iniciarSimulador);