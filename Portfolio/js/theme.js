(() => {
  const root = document.documentElement;
  const buttons = document.querySelectorAll('.theme-toggle');
  const meta = document.querySelector('meta[name="theme-color"]');
  const apply = (theme) => {
    root.dataset.theme = theme;
    buttons.forEach((button) => {
      const dark = theme === 'dark';
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      const label = button.querySelector('.theme-toggle-label');
      const icon = button.querySelector('.theme-toggle-icon');
      if (label) label.textContent = dark ? 'Day view' : 'Night view';
      if (icon) icon.textContent = dark ? '☼' : '◐';
    });
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#151b17' : '#f3f0e8');
  };
  buttons.forEach((button) => button.addEventListener('click', () => {
    apply(root.dataset.theme === 'dark' ? 'light' : 'dark');
  }));
})();
