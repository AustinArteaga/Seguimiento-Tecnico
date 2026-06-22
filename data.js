/* ============================================================
   BASE DE DATOS DEL SISTEMA DE COTIZACIONES SFV
   ============================================================
   Este archivo contiene TODA la información editable:
   sistemas, tramos de medición, materiales y costos.

   PUEDES EDITAR ESTE ARCHIVO DIRECTAMENTE para:
   - Agregar/quitar sistemas FV
   - Agregar/quitar tramos de medición
   - Asignar materiales a un tramo (esto activa su costo)
   - Cambiar precios por metro

   No es necesario tocar el resto del código de la app.
   ============================================================ */

window.SFV_DATA = {

  // ----------------------------------------------------------
  // 1. SISTEMAS FOTOVOLTAICOS DISPONIBLES
  // (de la hoja "Seleccion del tipo de Sistema")
  // ----------------------------------------------------------
  sistemas: [
    { id: 1, nombre: "HYBRID FOX 11.4 KW - 20 PANELES" },
    { id: 2, nombre: "RESPALD FOX 11.4 KW - 2 BATERIAS" },
    { id: 3, nombre: "ALL IN ONE 6KW - 15-10 KWH" },
    { id: 4, nombre: "ALL IN ONE 6KW - 15-10 KWH 4PFV" },
    { id: 5, nombre: "BS 5KW 10KWH CON PANELES" },
    { id: 6, nombre: "BS 5KW 10KWH SIN PANELES" },
    { id: 7, nombre: "BS 3KW 5KWH CON PANELES" },
    { id: 8, nombre: "BS 3KW 5KWH SIN PANELES" },
    { id: 9, nombre: "BS 1KW 5KWH CON PANELES" },
    { id: 10, nombre: "BS 1KW 5KWH SIN PANELES" }
  ],

  // ----------------------------------------------------------
  // 2. TRAMOS DE MEDICIÓN POR DISTANCIA (metros)
  // (de la hoja "Registro de longitudes")
  // Cada tramo tiene: sistema al que pertenece, nombre, y
  // medida estándar de referencia (solo informativa).
  // ----------------------------------------------------------
  tramosDistancia: [
    // --- HYBRID FOX 11.4 KW- 20 PANELES ---
    { sistemaId: 1, tramo: "Metros desde el Tablero del cliente hasta el Inversor", estandar: 3 },
    { sistemaId: 1, tramo: "Metros desde el Inversor hasta los CTs", estandar: 3 },
    { sistemaId: 1, tramo: "Metros desde el Tablero del cliente hasta la Transferencia", estandar: 2 },
    { sistemaId: 1, tramo: "Metros desde el Inversor hasta la Transferencia", estandar: 2 },
    { sistemaId: 1, tramo: "Metros desde el inversor al paro de emergencia", estandar: 0.5 },
    { sistemaId: 1, tramo: "Metros desde la Transferencia hasta el Tablero de Respaldo", estandar: 6 },
    { sistemaId: 1, tramo: "Metros desde tablero DC hasta String 1", estandar: 12 },
    { sistemaId: 1, tramo: "Metros desde tablero DC hasta String 2", estandar: 27 },
    { sistemaId: 1, tramo: "Metros desde Junction Box hasta la Bateria 1", estandar: 2 },
    { sistemaId: 1, tramo: "Metros desde Junction Box hasta la Bateria 2", estandar: 2 },
    { sistemaId: 1, tramo: "Metros desde Varilla Tierra hasta Barra de Tierra", estandar: 3 },
    { sistemaId: 1, tramo: "Metros desde la Barra de Tierra hasta el Tablero del Cliente", estandar: 3 },
    { sistemaId: 1, tramo: "Metros desde la Barra de Tierra hasta el Inversor", estandar: 2 },
    { sistemaId: 1, tramo: "Metros desde la Barra de Tierra hasta el Tablero DC", estandar: 2 },
    { sistemaId: 1, tramo: "Metros desde la Barra de Tierra hasta el Junction Box", estandar: 3 },
    { sistemaId: 1, tramo: "Metros desde la Barra de Tierra hasta el Tablero de Respaldo", estandar: 3 },
    { sistemaId: 1, tramo: "Metros desde la Barra de Tierra hasta los Paneles Solares", estandar: 27 },

    // --- RESPALD FOX 11.4 KW- 2 BATERIAS ---
    { sistemaId: 2, tramo: "Metros desde el Tablero del cliente hasta el Inversor", estandar: 3 },
    { sistemaId: 2, tramo: "Metros desde el Inversor hasta los CTs", estandar: 3 },
    { sistemaId: 2, tramo: "Metros desde el Tablero del cliente hasta la Transferencia", estandar: 2 },
    { sistemaId: 2, tramo: "Metros desde el Inversor hasta la Transferencia", estandar: 2 },
    { sistemaId: 2, tramo: "Metros desde el inversor al paro de emergencia", estandar: 0.5 },
    { sistemaId: 2, tramo: "Metros desde la Transferencia hasta el Tablero de Respaldo", estandar: 6 },
    { sistemaId: 2, tramo: "Metros desde Junction Box hasta la Bateria 1", estandar: 2 },
    { sistemaId: 2, tramo: "Metros desde Junction Box hasta la Bateria 2", estandar: 2 },
    { sistemaId: 2, tramo: "Metros desde Varilla Tierra hasta Barra de Tierra", estandar: 3 },
    { sistemaId: 2, tramo: "Metros desde la Barra de Tierra hasta el Tablero del Cliente", estandar: 3 },
    { sistemaId: 2, tramo: "Metros desde la Barra de Tierra hasta el Inversor", estandar: 2 },
    { sistemaId: 2, tramo: "Metros desde la Barra de Tierra hasta el Junction Box", estandar: 3 },
    { sistemaId: 2, tramo: "Metros desde la Barra de Tierra hasta el Tablero de Respaldo", estandar: 3 },

    // --- ALL IN ONE 6KW- 15-10 kwh ---
    { sistemaId: 3, tramo: "Metros desde el Tablero del cliente hasta el Inversor", estandar: 3 },
    { sistemaId: 3, tramo: "Metros desde el Tablero del cliente hasta la Transferencia", estandar: 2 },
    { sistemaId: 3, tramo: "Metros desde el Inversor hasta la Transferencia", estandar: 2 },
    { sistemaId: 3, tramo: "Metros desde la Transferencia hasta el Tablero de Respaldo", estandar: 6 },
    { sistemaId: 3, tramo: "Metros desde Varilla Tierra hasta Barra de Tierra", estandar: 3 },
    { sistemaId: 3, tramo: "Metros desde la Barra de Tierra hasta el Tablero del Cliente", estandar: 3 },
    { sistemaId: 3, tramo: "Metros desde la Barra de Tierra hasta el Inversor", estandar: 2 },
    { sistemaId: 3, tramo: "Metros desde la Barra de Tierra hasta el Tablero de Respaldo", estandar: 3 },

    // --- ALL IN ONE 6KW- 15-10 kwh 4PFV ---
    { sistemaId: 4, tramo: "Metros desde el Tablero del cliente hasta el Inversor", estandar: 3 },
    { sistemaId: 4, tramo: "Metros desde el Tablero del cliente hasta la Transferencia", estandar: 2 },
    { sistemaId: 4, tramo: "Metros desde el Inversor hasta la Transferencia", estandar: 2 },
    { sistemaId: 4, tramo: "Metros desde la Transferencia hasta el Tablero de Respaldo", estandar: 6 },
    { sistemaId: 4, tramo: "Metros desde tablero DC hasta String 1", estandar: 12 },
    { sistemaId: 4, tramo: "Metros desde Varilla Tierra hasta Barra de Tierra", estandar: 3 },
    { sistemaId: 4, tramo: "Metros desde la Barra de Tierra hasta el Tablero del Cliente", estandar: 3 },
    { sistemaId: 4, tramo: "Metros desde la Barra de Tierra hasta el Inversor", estandar: 2 },
    { sistemaId: 4, tramo: "Metros desde la Barra de Tierra hasta el Tablero DC", estandar: 2 },
    { sistemaId: 4, tramo: "Metros desde la Barra de Tierra hasta el Tablero de Respaldo", estandar: 3 },
    { sistemaId: 4, tramo: "Metros desde la Barra de Tierra hasta los Paneles Solares", estandar: 27 }

    // --- Sistemas BS (5,6,7,8,9,10) ---
    // Aún no había tramos definidos en el Excel para estos sistemas.
    // Agrégalos aquí con el mismo formato cuando los tengas:
    // { sistemaId: 5, tramo: "Nombre del tramo", estandar: 0 },
  ],

  // ----------------------------------------------------------
  // 3. TRAMOS DE MEDICIÓN POR CANTIDAD (unidades, no metros)
  // (de "Hoja3" - puntos de verificación cant)
  // ----------------------------------------------------------
  tramosCantidad: [
    { sistemaId: 1, tramo: "Breaker principales en Tablero del Cliente", estandar: 2 },
    { sistemaId: 1, tramo: "Tablero de protecciones DC", estandar: 1 },
    { sistemaId: 1, tramo: "Tablero de Transferencia", estandar: 1 },
    { sistemaId: 1, tramo: "Tablero de Respaldo", estandar: 1 }

    // Agrega aquí los puntos de cantidad para los demás sistemas
    // cuando los tengas definidos.
  ],

  // ----------------------------------------------------------
  // 4. MATERIALES QUE LLEVA CADA TRAMO DE DISTANCIA
  // (de "Componentes por cada linea")
  // IMPORTANTE: un tramo sin materiales asignados aquí se
  // sigue capturando en el formulario, pero NO se cobra en
  // la cotización hasta que le asignes materiales.
  // ----------------------------------------------------------
  materialesPorTramo: {
    "Metros desde el Tablero del cliente hasta el Inversor": [
      "Cable 3x6AWG",
      "Bandeja Portacables 10x10x10"
    ],
    "Metros desde el Inversor hasta los CTs": [
      "Cable 4x16AWG",
      "Bandeja Portacables 5x5x5"
    ]

    // Para agregar más, copia este formato:
    // "Nombre EXACTO del tramo": ["Material 1", "Material 2"],
  },

  // ----------------------------------------------------------
  // 5. COSTO UNITARIO POR MATERIAL ($/metro)
  // (de "Costo unitario")
  // ----------------------------------------------------------
  costoUnitario: {
    "Cable 3x6AWG": 6.2,
    "Bandeja Portacables 10x10x10": 4.0,
    "Cable 4x16AWG": 1.8,
    "Bandeja Portacables 5x5x5": 2.0

    // Agrega aquí nuevos materiales con su costo por metro:
    // "Nombre del material": precio,
  }
};
