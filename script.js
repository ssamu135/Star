/* ============================================================
   STARBALANCE — Shared Scripts
   Stars, mobile menu, active nav, reveal, calendar
   ============================================================ */

/* ============ BACKGROUND STARS (solo en welcome) ============ */
const lienzo = document.getElementById('lienzo-estrellas');
if (lienzo) {
  const ctx = lienzo.getContext('2d');
  let estrellas = [];

  function ajustarLienzo() {
    lienzo.width = window.innerWidth;
    lienzo.height = window.innerHeight;
  }

  function crearEstrellas() {
    const cantidad = Math.floor((window.innerWidth * window.innerHeight) / 4000);
    estrellas = [];
    for (let i = 0; i < cantidad; i++) {
      estrellas.push({
        x: Math.random() * lienzo.width,
        y: Math.random() * lienzo.height,
        r: Math.random() * 1.4 + 0.3,
        velocidad: Math.random() * 0.02 + 0.005,
        fase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.85 ? '236,72,153' : '255,255,255'
      });
    }
  }

  function dibujarEstrellas(tiempo) {
    ctx.clearRect(0, 0, lienzo.width, lienzo.height);
    estrellas.forEach(e => {
      const brillo = 0.5 + 0.5 * Math.sin(tiempo * e.velocidad + e.fase);
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${e.color},${brillo})`;
      ctx.fill();
    });
    requestAnimationFrame(dibujarEstrellas);
  }

  ajustarLienzo();
  crearEstrellas();
  requestAnimationFrame(dibujarEstrellas);
  window.addEventListener('resize', () => { ajustarLienzo(); crearEstrellas(); });
}

/* ============ MOBILE MENU ============ */
const btnMenu = document.getElementById('btn-menu');
const menuLista = document.querySelector('#nav-principal ul');
if (btnMenu && menuLista) {
  btnMenu.addEventListener('click', () => menuLista.classList.toggle('abierto'));
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => menuLista.classList.remove('abierto'));
  });
}

/* ============ ACTIVE NAV ============ */
const rutaActual = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === rutaActual) link.classList.add('activo');
});

/* ============ REVEAL ============ */
const elementosReveal = document.querySelectorAll('.reveal');
if (elementosReveal.length) {
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 });
  elementosReveal.forEach(el => obs.observe(el));
}

/* ============ CALENDAR (solo planner.html) ============ */
const calGrid = document.getElementById('calendar-grid');
if (calGrid) {
  const calMonth = document.getElementById('cal-month');
  const fechaSeleccionadaEl = document.getElementById('fecha-seleccionada');
  const formEvento = document.getElementById('form-evento');
  const tituloEvento = document.getElementById('titulo-evento');
  const tipoEvento = document.getElementById('tipo-evento');
  const listaEventos = document.getElementById('lista-eventos');

  let fechaActual = new Date();
  let diaSeleccionado = null;

  // Cargar eventos guardados
  let eventos = JSON.parse(localStorage.getItem('starbalance-eventos') || '{}');

  function guardarEventos() {
    localStorage.setItem('starbalance-eventos', JSON.stringify(eventos));
  }

  function claveDia(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function renderCalendario() {
    calGrid.innerHTML = '';
    const year = fechaActual.getFullYear();
    const month = fechaActual.getMonth();
    const meses = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    calMonth.textContent = `${meses[month]} ${year}`;

    const primerDia = new Date(year, month, 1).getDay();
    const diasEnMes = new Date(year, month + 1, 0).getDate();
    const diasMesAnterior = new Date(year, month, 0).getDate();

    // Días del mes anterior
    for (let i = primerDia - 1; i >= 0; i--) {
      const d = document.createElement('div');
      d.classList.add('cal-day', 'otro-mes');
      d.textContent = diasMesAnterior - i;
      calGrid.appendChild(d);
    }

    // Días del mes
    const hoy = new Date();
    for (let i = 1; i <= diasEnMes; i++) {
      const d = document.createElement('div');
      d.classList.add('cal-day');
      d.textContent = i;

      if (i === hoy.getDate() && month === hoy.getMonth() && year === hoy.getFullYear()) {
        d.classList.add('hoy');
      }

      // Marcar día seleccionado
      if (diaSeleccionado &&
          diaSeleccionado.year === year &&
          diaSeleccionado.month === month &&
          diaSeleccionado.day === i) {
        d.classList.add('seleccionado');
      }

      // Marcar eventos existentes
      const key = claveDia(year, month, i);
      if (eventos[key] && eventos[key].length > 0) {
        const tipo = eventos[key][0].tipo;
        d.classList.add('con-evento', `ev-${tipo}`);
      }

      // Click para seleccionar el día
      d.addEventListener('click', () => {
        diaSeleccionado = { year, month, day: i };
        renderCalendario();
        mostrarEventosDelDia();
      });

      calGrid.appendChild(d);
    }

    // Rellenar hasta completar la semana
    const total = primerDia + diasEnMes;
    const restantes = (7 - (total % 7)) % 7;
    for (let i = 1; i <= restantes; i++) {
      const d = document.createElement('div');
      d.classList.add('cal-day', 'otro-mes');
      d.textContent = i;
      calGrid.appendChild(d);
    }
  }

  function mostrarEventosDelDia() {
    if (!diaSeleccionado) {
      fechaSeleccionadaEl.textContent = 'Click a day to add an event.';
      listaEventos.innerHTML = '';
      return;
    }

    const { year, month, day } = diaSeleccionado;
    const meses = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    fechaSeleccionadaEl.textContent = `📅 ${meses[month]} ${day}, ${year}`;

    const key = claveDia(year, month, day);
    const eventosDia = eventos[key] || [];

    if (eventosDia.length === 0) {
      listaEventos.innerHTML = '<p class="vacio-evento">No events yet. Add one above! ✨</p>';
      return;
    }

    listaEventos.innerHTML = '';
    eventosDia.forEach((ev, idx) => {
      const item = document.createElement('div');
      item.classList.add('evento-item', `tipo-${ev.tipo}`);
      item.innerHTML = `
        <span class="titulo-evento">${ev.titulo}</span>
        <button class="btn-borrar" data-idx="${idx}" title="Delete">×</button>
      `;
      listaEventos.appendChild(item);
    });

    // Botones de borrar
    listaEventos.querySelectorAll('.btn-borrar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.idx);
        eventosDia.splice(idx, 1);
        if (eventosDia.length === 0) delete eventos[key];
        else eventos[key] = eventosDia;
        guardarEventos();
        renderCalendario();
        mostrarEventosDelDia();
      });
    });
  }

  // Agregar evento
  formEvento.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!diaSeleccionado) {
      alert('Please click a day on the calendar first.');
      return;
    }

    const titulo = tituloEvento.value.trim();
    if (!titulo) return;

    const key = claveDia(diaSeleccionado.year, diaSeleccionado.month, diaSeleccionado.day);
    if (!eventos[key]) eventos[key] = [];
    eventos[key].push({ titulo, tipo: tipoEvento.value });
    guardarEventos();

    tituloEvento.value = '';
    renderCalendario();
    mostrarEventosDelDia();
  });

  // Navegación de meses
  document.getElementById('cal-prev').addEventListener('click', () => {
    fechaActual.setMonth(fechaActual.getMonth() - 1);
    renderCalendario();
  });
  document.getElementById('cal-next').addEventListener('click', () => {
    fechaActual.setMonth(fechaActual.getMonth() + 1);
    renderCalendario();
  });

  // Inicializar
  renderCalendario();
  mostrarEventosDelDia();
}
