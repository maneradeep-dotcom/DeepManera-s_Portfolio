(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  const chapters = [...document.querySelectorAll('[data-story-stage]')];
  const chapterLinks = [...document.querySelectorAll('[data-stage-link]')];
  const setCurrentChapter = (name) => {
    chapters.forEach((chapter) => chapter.classList.toggle('is-current', chapter.dataset.storyStage === name));
    chapterLinks.forEach((link) => {
      if (link.dataset.stageLink === name) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
  };
  chapterLinks.forEach((link) => link.addEventListener('click', () => setCurrentChapter(link.dataset.stageLink)));
  if (document.documentElement.classList.contains('motion-ready') && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); currentObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
    reveals.forEach((node) => { node.classList.add('reveal'); observer.observe(node); });

    const chapterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        setCurrentChapter(entry.target.dataset.storyStage);
      });
    }, { rootMargin: '-35% 0px -50% 0px', threshold: 0 });
    chapters.forEach((chapter) => chapterObserver.observe(chapter));
  } else {
    if (chapterLinks[0]) setCurrentChapter(chapterLinks[0].dataset.stageLink);
  }

  const inventory = [
    { serial: 'SAMPLE-1001', box: 'BOX-07', status: 'Boxed', history: ['Received', 'Boxed'] },
    { serial: 'SAMPLE-1002', box: 'BOX-07', status: 'Verified', history: ['Received', 'Boxed', 'Verified'] },
    { serial: 'SAMPLE-1003', box: 'BOX-12', status: 'Dispatched', history: ['Received', 'Boxed', 'Verified', 'Dispatched'] },
    { serial: 'SAMPLE-1004', box: 'BOX-18', status: 'In review', history: ['Received', 'Review'] }
  ];
  const search = document.querySelector('#serial-search');
  const results = document.querySelector('#serial-results');
  const status = document.querySelector('#serial-status');
  const renderResults = () => {
    if (!search || !results) return;
    const term = search.value.trim().toLowerCase();
    const matches = inventory.filter((row) => row.serial.toLowerCase().includes(term) || row.box.toLowerCase().includes(term));
    results.replaceChildren();
    if (!matches.length) {
      const empty = document.createElement('p'); empty.className = 'demo-status'; empty.textContent = 'No match in the fictional sample list.'; results.append(empty); return;
    }
    matches.forEach((row) => {
      const item = document.createElement('div'); item.className = 'demo-record';
      const identity = document.createElement('span'); identity.textContent = `${row.serial} · ${row.box}`;
      const button = document.createElement('button'); button.type = 'button'; button.dataset.serial = row.serial; button.textContent = `View · ${row.status}`;
      item.append(identity, button); results.append(item);
    });
  };
  if (search && results && status) {
    search.addEventListener('input', renderResults);
    results.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-serial]');
      if (!button) return;
      const row = inventory.find((item) => item.serial === button.dataset.serial);
      if (row) status.textContent = `${row.serial} in ${row.box}: ${row.history.join(' → ')}. Example status only.`;
    });
    renderResults();
  }

  const stages = [
    'A team member submits a request using the agreed fields. No data is saved by this demo.',
    'A reviewer checks the required details and supporting evidence within their assigned role.',
    'An authorized decision is made; any approval, decline or return path is defined in scope.',
    'The decision and reason can be recorded for traceability when the real system requires it.',
    'An authorized report can summarize the fictional examples without exposing unrelated records.'
  ];
  const stepper = document.querySelector('.demo-stepper');
  const description = document.querySelector('#workflow-description');
  if (stepper && description) {
    stepper.addEventListener('click', (event) => {
      const button = event.target.closest('[data-workflow-step]');
      if (!button) return;
      const index = Number(button.dataset.workflowStep);
      if (!Number.isInteger(index) || !stages[index]) return;
      stepper.querySelectorAll('[data-workflow-step]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      description.textContent = stages[index];
    });
  }
})();
