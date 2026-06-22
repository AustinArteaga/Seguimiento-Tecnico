/* ============================================================
   COTIZADOR SFV - LÓGICA DE LA APLICACIÓN
   ============================================================ */

window.state = {
  screen: 'cliente', // cliente -> sistema -> medidas -> cotizacion -> config
  cliente: { codigo: generarCodigo(), nombre: '', fecha: hoy() },
  sistemaId: null,
  medidasDistancia: {}, // { "nombre tramo": metros }
  medidasCantidad: {}   // { "nombre tramo": cantidad }
};
const state = window.state;

const SCREENS_ORDER = ['cliente', 'sistema', 'medidas', 'cotizacion'];

function generarCodigo(){
  const f = new Date();
  const rnd = Math.floor(Math.random() * 900 + 100);
  return `${f.getFullYear().toString().slice(2)}${pad(f.getMonth()+1)}${pad(f.getDate())}${rnd}`;
}
function pad(n){ return n.toString().padStart(2,'0'); }
function hoy(){
  const f = new Date();
  return `${f.getFullYear()}-${pad(f.getMonth()+1)}-${pad(f.getDate())}`;
}
function fechaLegible(iso){
  const [y,m,d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/* ---------------- Navegación ---------------- */

function render(){
  pintarSteps();
  const app = document.getElementById('app');
  if(state.screen === 'cliente') app.innerHTML = pantallaCliente();
  else if(state.screen === 'sistema') app.innerHTML = pantallaSistema();
  else if(state.screen === 'medidas') app.innerHTML = pantallaMedidas();
  else if(state.screen === 'cotizacion') app.innerHTML = pantallaCotizacion();
  else if(state.screen === 'config') app.innerHTML = pantallaConfig();

  document.getElementById('codProyectoTag').textContent =
    state.screen === 'config' ? 'CONFIGURACIÓN' : `PROYECTO ${state.cliente.codigo}`;

  window.scrollTo(0,0);
}

function pintarSteps(){
  const bar = document.getElementById('stepsBar');
  if(state.screen === 'config'){ bar.innerHTML = ''; return; }
  const idx = SCREENS_ORDER.indexOf(state.screen);
  bar.innerHTML = SCREENS_ORDER.map((s,i) => {
    let cls = 'step-dot';
    if(i < idx) cls += ' done';
    if(i === idx) cls += ' active';
    return `<div class="${cls}"></div>`;
  }).join('');
}

function irAConfig(){
  state._prevScreen = state.screen;
  state.screen = 'config';
  render();
}
function salirDeConfig(){
  state.screen = state._prevScreen || 'cliente';
  render();
}

function irSiguienteDesdeCliente(){
  const nombre = document.getElementById('inputNombreCliente').value.trim();
  const fecha = document.getElementById('inputFecha').value;
  if(!nombre){
    mostrarToast('Falta el nombre del cliente');
    return;
  }
  state.cliente.nombre = nombre;
  state.cliente.fecha = fecha || hoy();
  state.screen = 'sistema';
  render();
}

function seleccionarSistema(id){
  state.sistemaId = id;
  state.medidasDistancia = {};
  state.medidasCantidad = {};
  render();
}

function irSiguienteDesdeSistema(){
  if(!state.sistemaId){
    mostrarToast('Selecciona un sistema FV para continuar');
    return;
  }
  state.screen = 'medidas';
  render();
}

function volverACliente(){ state.screen = 'cliente'; render(); }
function volverASistema(){ state.screen = 'sistema'; render(); }
function volverAMedidas(){ state.screen = 'medidas'; render(); }

function guardarMedidaDistancia(tramo, valor){
  state.medidasDistancia[tramo] = valor === '' ? null : parseFloat(valor);
}
function guardarMedidaCantidad(tramo, valor){
  state.medidasCantidad[tramo] = valor === '' ? null : parseFloat(valor);
}

function irSiguienteDesdeMedidas(){
  state.screen = 'cotizacion';
  render();
}

/* ---------------- Pantalla 1: Cliente ---------------- */

function pantallaCliente(){
  return `
    <div class="screen">
      <div class="screen-label">Paso 1 de 3</div>
      <h2 class="screen-title">Datos del cliente</h2>

      <div class="card">
        <div class="field">
          <label>Código de proyecto</label>
          <input type="text" value="${state.cliente.codigo}" disabled style="opacity:0.6">
          <div class="hint">Generado automáticamente</div>
        </div>
        <div class="field">
          <label>Nombre del cliente *</label>
          <input type="text" id="inputNombreCliente" placeholder="Ej. Juan Piguave" value="${escapeHtml(state.cliente.nombre)}">
        </div>
        <div class="field">
          <label>Fecha</label>
          <input type="date" id="inputFecha" value="${state.cliente.fecha}">
        </div>
      </div>
    </div>

    <div class="bottom-bar">
      <div class="bottom-bar-inner">
        <button class="btn btn-primary" onclick="irSiguienteDesdeCliente()">Continuar →</button>
      </div>
    </div>
  `;
}

/* ---------------- Pantalla 2: Sistema ---------------- */

function pantallaSistema(){
  const opciones = SFV_DATA.sistemas.map(s => {
    const sel = state.sistemaId === s.id ? 'selected' : '';
    return `
      <div class="sistema-option ${sel}" onclick="seleccionarSistema(${s.id})">
        <span class="nombre">${s.nombre}</span>
        <span class="check"></span>
      </div>`;
  }).join('');

  return `
    <div class="screen">
      <div class="screen-label">Paso 2 de 3</div>
      <h2 class="screen-title">Selecciona el sistema FV</h2>
      ${opciones}
    </div>

    <div class="bottom-bar">
      <div class="bottom-bar-inner">
        <button class="btn btn-secondary" onclick="volverACliente()">←</button>
        <button class="btn btn-primary" onclick="irSiguienteDesdeSistema()">Continuar →</button>
      </div>
    </div>
  `;
}

/* ---------------- Pantalla 3: Medidas ---------------- */

function pantallaMedidas(){
  const tramosDist = SFV_DATA.tramosDistancia.filter(t => t.sistemaId === state.sistemaId);
  const tramosCant = SFV_DATA.tramosCantidad.filter(t => t.sistemaId === state.sistemaId);

  let html = `
    <div class="screen">
      <div class="screen-label">Paso 3 de 3</div>
      <h2 class="screen-title">Toma de medidas en sitio</h2>
  `;

  if(tramosDist.length === 0 && tramosCant.length === 0){
    html += `<div class="alert-box">Este sistema todavía no tiene tramos de medición configurados. Ve a <b>⚙ Config</b> para agregarlos.</div>`;
  }

  if(tramosDist.length > 0){
    html += `<div class="tramo-group-title">Distancias (metros)</div>`;
    tramosDist.forEach(t => {
      const tieneMateriales = !!SFV_DATA.materialesPorTramo[t.tramo];
      const valor = state.medidasDistancia[t.tramo];
      html += `
        <div class="tramo-row">
          <div class="tramo-nombre">${t.tramo}${tieneMateriales ? '' : '<span class="badge-sincosto">sin costo asignado</span>'}</div>
          <div class="tramo-meta">
            <input type="number" inputmode="decimal" step="0.1" min="0"
              placeholder="0.0"
              value="${valor !== undefined && valor !== null ? valor : ''}"
              oninput="guardarMedidaDistancia('${escapeAttr(t.tramo)}', this.value)">
            <span class="unidad-tag">m</span>
            <span class="estandar-tag">est. ${t.estandar}m</span>
          </div>
        </div>`;
    });
  }

  if(tramosCant.length > 0){
    html += `<div class="tramo-group-title">Cantidades (unidades)</div>`;
    tramosCant.forEach(t => {
      const valor = state.medidasCantidad[t.tramo];
      html += `
        <div class="tramo-row">
          <div class="tramo-nombre">${t.tramo}</div>
          <div class="tramo-meta">
            <input type="number" inputmode="numeric" step="1" min="0"
              placeholder="0"
              value="${valor !== undefined && valor !== null ? valor : ''}"
              oninput="guardarMedidaCantidad('${escapeAttr(t.tramo)}', this.value)">
            <span class="unidad-tag">und</span>
            <span class="estandar-tag">est. ${t.estandar}</span>
          </div>
        </div>`;
    });
  }

  html += `</div>
    <div class="bottom-bar">
      <div class="bottom-bar-inner">
        <button class="btn btn-secondary" onclick="volverASistema()">←</button>
        <button class="btn btn-primary" onclick="irSiguienteDesdeMedidas()">Ver cotización →</button>
      </div>
    </div>
  `;
  return html;
}

/* ---------------- Motor de cálculo ---------------- */

function calcularCotizacion(){
  const lineas = [];
  let total = 0;

  Object.keys(state.medidasDistancia).forEach(tramo => {
    const metros = state.medidasDistancia[tramo];
    if(!metros || metros <= 0) return;
    const materiales = SFV_DATA.materialesPorTramo[tramo];
    if(!materiales) return; // sin costo asignado aún

    materiales.forEach(mat => {
      const costoM = SFV_DATA.costoUnitario[mat];
      if(costoM === undefined) return;
      const subtotal = metros * costoM;
      lineas.push({
        tramo, material: mat, cantidad: metros, unidad: 'm',
        costoUnitario: costoM, subtotal
      });
      total += subtotal;
    });
  });

  return { lineas, total };
}

/* ---------------- Pantalla 4: Cotización ---------------- */

function pantallaCotizacion(){
  const sistema = SFV_DATA.sistemas.find(s => s.id === state.sistemaId);
  const { lineas, total } = calcularCotizacion();

  let filas = '';
  if(lineas.length === 0){
    filas = `<div class="empty-note">Aún no hay líneas con costo calculado.<br>Verifica que las medidas tengan materiales asignados en Config.</div>`;
  } else {
    filas = lineas.map(l => `
      <div class="linea-item">
        <div class="desc"><b>${l.material}</b>${l.tramo}</div>
        <div class="monto">${l.cantidad}${l.unidad} × $${l.costoUnitario.toFixed(2)} = $${l.subtotal.toFixed(2)}</div>
      </div>
    `).join('');
  }

  return `
    <div class="screen">
      <div class="screen-label">Cotización</div>
      <h2 class="screen-title">Resumen para enviar</h2>

      <div class="quote-header">
        <div class="cod">PROYECTO ${state.cliente.codigo}</div>
        <div class="cliente">${escapeHtml(state.cliente.nombre)}</div>
        <div class="sistema">${sistema ? sistema.nombre : ''} · ${fechaLegible(state.cliente.fecha)}</div>
      </div>

      <div class="card">
        ${filas}
        <div class="total-row">
          <span class="label">Total estimado</span>
          <span class="amount">$${total.toFixed(2)}</span>
        </div>
      </div>

      <div class="hint" style="margin-bottom:14px;">
        Este monto cubre materiales de cableado según medidas reales. No incluye el equipo del sistema (paneles, inversor, baterías) ni mano de obra, salvo que se sumen aparte.
      </div>

      <button class="btn btn-primary" onclick="generarYDescargarPDF()" style="margin-bottom:10px;">📄 Generar PDF</button>
      <button class="btn btn-secondary" onclick="enviarPorCorreo()">✉ Enviar por correo</button>
    </div>

    <div class="bottom-bar">
      <div class="bottom-bar-inner">
        <button class="btn btn-secondary" onclick="volverAMedidas()">← Editar medidas</button>
      </div>
    </div>
  `;
}

/* ---------------- PDF ---------------- */

function construirHTMLCotizacion(){
  const sistema = SFV_DATA.sistemas.find(s => s.id === state.sistemaId);
  const { lineas, total } = calcularCotizacion();

  const filas = lineas.map(l => `
    <tr>
      <td>${l.material}</td>
      <td>${l.tramo}</td>
      <td style="text-align:right">${l.cantidad} ${l.unidad}</td>
      <td style="text-align:right">$${l.costoUnitario.toFixed(2)}</td>
      <td style="text-align:right">$${l.subtotal.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <html><head><meta charset="UTF-8"><style>
      body{ font-family: Arial, sans-serif; color:#0B3D44; padding:30px; }
      h1{ font-size:20px; color:#0B3D44; margin-bottom:2px;}
      .sub{ color:#4A5759; font-size:13px; margin-bottom:20px;}
      table{ width:100%; border-collapse:collapse; font-size:12px; }
      th{ background:#0B3D44; color:white; text-align:left; padding:8px; }
      td{ padding:8px; border-bottom:1px solid #DEDAD0; }
      .total{ text-align:right; font-size:18px; font-weight:bold; margin-top:16px; color:#0B3D44; }
      .footer{ font-size:11px; color:#4A5759; margin-top:30px; }
    </style></head>
    <body>
      <h1>Cotización — Proyecto ${state.cliente.codigo}</h1>
      <div class="sub">Cliente: ${escapeHtml(state.cliente.nombre)} · Fecha: ${fechaLegible(state.cliente.fecha)}<br>
      Sistema: ${sistema ? sistema.nombre : ''}</div>
      <table>
        <thead><tr><th>Material</th><th>Tramo</th><th style="text-align:right">Cantidad</th><th style="text-align:right">$/Unid.</th><th style="text-align:right">Subtotal</th></tr></thead>
        <tbody>${filas || '<tr><td colspan="5">Sin líneas calculadas</td></tr>'}</tbody>
      </table>
      <div class="total">Total estimado: $${total.toFixed(2)}</div>
      <div class="footer">Cotización generada en sitio. No incluye equipo del sistema ni mano de obra salvo indicación contraria.</div>
    </body></html>
  `;
}

function generarYDescargarPDF(){
  const ventana = window.open('', '_blank');
  ventana.document.write(construirHTMLCotizacion());
  ventana.document.close();
  setTimeout(() => { ventana.print(); }, 300);
  mostrarToast('Se abrió la vista de impresión: elige "Guardar como PDF"');
}

function enviarPorCorreo(){
  const sistema = SFV_DATA.sistemas.find(s => s.id === state.sistemaId);
  const { lineas, total } = calcularCotizacion();

  const cuerpoLineas = lineas.map(l =>
    `- ${l.material} (${l.tramo}): ${l.cantidad}${l.unidad} x $${l.costoUnitario.toFixed(2)} = $${l.subtotal.toFixed(2)}`
  ).join('\n');

  const asunto = `Cotización SFV - Proyecto ${state.cliente.codigo} - ${state.cliente.nombre}`;
  const cuerpo =
`Cotización para: ${state.cliente.nombre}
Proyecto: ${state.cliente.codigo}
Sistema: ${sistema ? sistema.nombre : ''}
Fecha: ${fechaLegible(state.cliente.fecha)}

Detalle:
${cuerpoLineas || '(sin líneas calculadas)'}

TOTAL ESTIMADO: $${total.toFixed(2)}

Nota: este monto cubre materiales de cableado según medidas reales. No incluye equipo del sistema ni mano de obra.`;

  const mailto = `mailto:?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  window.location.href = mailto;
  mostrarToast('Genera primero el PDF para adjuntarlo manualmente en el correo');
}

/* ---------------- Config ---------------- */

function pantallaConfig(){
  const sistemasRows = SFV_DATA.sistemas.map(s => `<tr><td>${s.id}</td><td>${s.nombre}</td></tr>`).join('');

  const materialesRows = Object.keys(SFV_DATA.costoUnitario).map(m =>
    `<tr><td>${m}</td><td style="text-align:right">$${SFV_DATA.costoUnitario[m].toFixed(2)} /m</td></tr>`
  ).join('');

  const tramosConCostoRows = Object.keys(SFV_DATA.materialesPorTramo).map(t =>
    `<tr><td>${t}</td><td>${SFV_DATA.materialesPorTramo[t].join(', ')}</td></tr>`
  ).join('');

  const sistemasSinTramos = SFV_DATA.sistemas.filter(s =>
    !SFV_DATA.tramosDistancia.some(t => t.sistemaId === s.id) &&
    !SFV_DATA.tramosCantidad.some(t => t.sistemaId === s.id)
  ).map(s => s.nombre);

  return `
    <div class="screen">
      <div class="screen-label">Panel</div>
      <h2 class="screen-title">Configuración</h2>

      <div class="alert-box">
        Para agregar o editar sistemas, tramos, materiales y precios, edita el archivo <b>data.js</b> directamente. Está organizado en 5 bloques comentados para que sea fácil de modificar sin tocar el resto del código.
      </div>

      ${sistemasSinTramos.length > 0 ? `
        <div class="alert-box" style="background:#FCE9E7; border-color:#B3392C;">
          <b>Pendiente:</b> estos sistemas aún no tienen tramos de medición definidos:<br>
          ${sistemasSinTramos.join(' · ')}
        </div>` : ''
      }

      <div class="config-section">
        <h3>Sistemas FV (${SFV_DATA.sistemas.length})</h3>
        <table class="cfg-table">
          <thead><tr><th>ID</th><th>Nombre</th></tr></thead>
          <tbody>${sistemasRows}</tbody>
        </table>
      </div>

      <div class="config-section">
        <h3>Materiales y costo por metro</h3>
        <table class="cfg-table">
          <thead><tr><th>Material</th><th>Costo</th></tr></thead>
          <tbody>${materialesRows}</tbody>
        </table>
      </div>

      <div class="config-section">
        <h3>Tramos con costo asignado</h3>
        <table class="cfg-table">
          <thead><tr><th>Tramo</th><th>Materiales</th></tr></thead>
          <tbody>${tramosConCostoRows || '<tr><td colspan="2">Ninguno</td></tr>'}</tbody>
        </table>
        <div class="hint">Los tramos que no aparecen aquí se capturan en el formulario pero no afectan el total todavía.</div>
      </div>
    </div>

    <div class="bottom-bar">
      <div class="bottom-bar-inner">
        <button class="btn btn-secondary" onclick="salirDeConfig()">← Volver</button>
      </div>
    </div>
  `;
}

/* ---------------- Utilidades ---------------- */

function mostrarToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}
function escapeHtml(str){
  return (str || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function escapeAttr(str){
  return (str || '').replace(/'/g, "\\'");
}

render();
