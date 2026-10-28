(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-navigation');
  const closeMenu = () => { if (!menuButton || !nav) return; menuButton.setAttribute('aria-expanded','false'); nav.classList.remove('is-open'); document.body.classList.remove('menu-open'); };
  if (menuButton && nav) { menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); document.body.classList.toggle('menu-open', open); }); nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); }); window.addEventListener('resize', () => { if (innerWidth > 800) closeMenu(); }, {passive:true}); }
  const themeButton = document.querySelector('.theme-toggle');
  const updateTheme = (light) => { root.classList.toggle('light', light); if (themeButton) { themeButton.setAttribute('aria-pressed', String(!light)); themeButton.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme'); const label = themeButton.querySelector('small'); if (label) label.textContent = light ? 'Dark mode' : 'Light mode'; } };
  if (themeButton) themeButton.addEventListener('click', () => updateTheme(!root.classList.contains('light')));
  const year = document.querySelector('[data-current-year]'); if (year) year.textContent = String(new Date().getFullYear());
  if ('IntersectionObserver' in window && !reduceMotion.matches) { root.classList.add('motion-ready'); const observer = new IntersectionObserver((entries, obs) => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); } }), {threshold:.08, rootMargin:'0px 0px -36px 0px'}); document.querySelectorAll('.reveal').forEach(el => observer.observe(el)); }
  if (!reduceMotion.matches) document.querySelectorAll('.project-card,.lab-card').forEach(card => { card.addEventListener('pointermove', e => { const r = card.getBoundingClientRect(); const x = (e.clientX-r.left)/r.width-.5; const y = (e.clientY-r.top)/r.height-.5; card.style.transform = `perspective(900px) rotateX(${y*-2}deg) rotateY(${x*2}deg) translateY(-5px)`; }); card.addEventListener('pointerleave', () => { card.style.transform = ''; }); });
})();
