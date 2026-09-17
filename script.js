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
  let fechaActual = new Date();

  function renderCalendario() {
    calGrid.innerHTML = '';
    const year = fechaActual.getFullYear();
    const month = fechaActual.getMonth();
    const meses = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    calMonth.textContent = `${meses[month]} ${year}`;

    const primerDia = new Date(year, month, 1).getDay();
    const diasEnMes = new Date(year, month + 1, 0).getDate();
    const diasMesAnterior = new Date(year, month, 0).getDate();

    for (let i = primerDia - 1; i >= 0; i--) {
      const d = document.createElement('div');
      d.classList.add('cal-day', 'otro-mes');
      d.textContent = diasMesAnterior - i;
      calGrid.appendChild(d);
    }

    const hoy = new Date();
    for (let i = 1; i <= diasEnMes; i++) {
      const d = document.createElement('div');
      d.classList.add('cal-day');
      d.textContent = i;
      if (i === hoy.getDate() && month === hoy.getMonth() && year === hoy.getFullYear()) {
        d.classList.add('hoy');
      }
      if (i === 5) d.classList.add('con-evento', 'ev-hw');
      if (i === 12) d.classList.add('con-evento', 'ev-exam');
      if (i === 18) d.classList.add('con-evento', 'ev-proj');
      if (i === 25) d.classList.add('con-evento', 'ev-act');
      if (i === 8) d.classList.add('con-evento', 'ev-hw');
      if (i === 22) d.classList.add('con-evento', 'ev-exam');
      calGrid.appendChild(d);
    }

    const total = primerDia + diasEnMes;
    const restantes = (7 - (total % 7)) % 7;
    for (let i = 1; i <= restantes; i++) {
      const d = document.createElement('div');
      d.classList.add('cal-day', 'otro-mes');
      d.textContent = i;
      calGrid.appendChild(d);
    }
  }

  document.getElementById('cal-prev').addEventListener('click', () => {
    fechaActual.setMonth(fechaActual.getMonth() - 1);
    renderCalendario();
  });
  document.getElementById('cal-next').addEventListener('click', () => {
    fechaActual.setMonth(fechaActual.getMonth() + 1);
    renderCalendario();
  });
  renderCalendario();
}