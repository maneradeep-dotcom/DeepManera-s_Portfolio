(() => {
  const form = document.querySelector('#estimate-form');
  if (!form) return;

  const packageHost = document.querySelector('#package-options');
  const addonHost = document.querySelector('#addon-options');
  const supportHost = document.querySelector('#support-options');
  const message = document.querySelector('#estimate-message');
  const error = document.querySelector('#pricing-error');
  const linesHost = document.querySelector('#estimate-lines');
  const totalNode = document.querySelector('#estimate-total');
  const monthlyNode = document.querySelector('#estimate-monthly');
  const timelineNode = document.querySelector('#estimate-timeline');
  const copyButton = document.querySelector('#copy-estimate');
  const currencyButtons = [...document.querySelectorAll('[data-currency-choice]')];
  const mailAddress = 'scriptinkvisualizer@gmail.com';
  let data;
  let currency = 'INR';
  let currentQuote;
  const chosenAddons = new Map();

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const makeChoice = (type, name, value, title, note, price, checked = false, disabled = false) => {
    const label = element('label', type === 'radio' && name === 'package-id' ? 'estimate-choice' : type === 'radio' ? 'support-choice' : 'addon-choice');
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.value = value;
    input.checked = checked;
    input.disabled = disabled;
    label.append(input);
    const copy = element('span', 'choice-copy');
    copy.append(element('strong', '', title));
    if (note) copy.append(element('small', '', note));
    label.append(copy);
    if (price) label.append(element('span', 'choice-price', price));
    return { label, input, copy };
  };
  const money = (amount) => new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency', currency, maximumFractionDigits: 0
  }).format(amount);
  const activePackage = () => data.packages.find((item) => item.id === form.querySelector('input[name="package-id"]:checked')?.value) || data.packages[0];

  const renderPackages = () => {
    const selectedId = packageHost.querySelector('input[name="package-id"]:checked')?.value || data.packages[0]?.id;
    packageHost.replaceChildren();
    data.packages.forEach((item) => {
      const start = item.priceType === 'starting-from' ? 'From ' : '';
      const entry = makeChoice('radio', 'package-id', item.id, item.name,
        `${item.scope} · ${item.delivery}`, `${start}${money(item.prices[currency])}`, item.id === selectedId);
      entry.label.classList.add('estimate-choice');
      entry.input.addEventListener('change', () => {
        (item.includedAddons || []).forEach((id) => chosenAddons.delete(id));
        renderAddons();
        updateQuote();
      });
      packageHost.append(entry.label);
    });
  };

  const renderAddons = () => {
    addonHost.replaceChildren();
    const item = activePackage();
    const included = new Set(item.includedAddons || []);
    data.addons.forEach((addon) => {
      const isIncluded = included.has(addon.id);
      const entry = makeChoice('checkbox', `addon-${addon.id}`, addon.id,
        `${addon.name}${addon.startingFrom ? ' — starting fee' : ''}`,
        addon.description, `${money(addon.prices[currency])}${addon.type === 'quantity' ? ` / ${addon.unitLabel}` : ''}`,
        isIncluded || Boolean(chosenAddons.get(addon.id)), isIncluded);
      if (addon.type === 'quantity' && !isIncluded) {
        const qty = document.createElement('input');
        qty.type = 'number';
        qty.min = '0';
        qty.max = String(addon.max || 5);
        qty.step = '1';
        qty.value = String(chosenAddons.get(addon.id) || 0);
        qty.setAttribute('aria-label', `${addon.name} quantity`);
        qty.className = 'quantity-input';
        qty.addEventListener('input', () => {
          const count = Math.max(0, Math.min(Number(qty.value) || 0, addon.max || 5));
          qty.value = String(count);
          if (count) chosenAddons.set(addon.id, count); else chosenAddons.delete(addon.id);
          updateQuote();
        });
        entry.label.querySelector('.choice-copy').append(qty);
        entry.input.checked = Number(qty.value) > 0;
        entry.input.addEventListener('change', () => {
          if (!entry.input.checked) { chosenAddons.delete(addon.id); qty.value = '0'; }
          else if (Number(qty.value) === 0) { chosenAddons.set(addon.id, 1); qty.value = '1'; }
          updateQuote();
        });
      } else {
        if (isIncluded) entry.copy.append(element('span', 'included-label', 'Included with this package'));
        entry.input.addEventListener('change', () => {
          if (entry.input.checked) chosenAddons.set(addon.id, true); else chosenAddons.delete(addon.id);
          updateQuote();
        });
      }
      addonHost.append(entry.label);
    });
  };

  const renderSupport = () => {
    const selectedSupportId = supportHost.querySelector('input[name="support-plan"]:checked')?.value ?? '';
    supportHost.replaceChildren();
    const none = makeChoice('radio', 'support-plan', '', 'No monthly support', 'Not included in the one-time project total.', 'None', selectedSupportId === '');
    none.label.classList.add('support-choice');
    none.input.addEventListener('change', updateQuote);
    supportHost.append(none.label);
    data.supportPlans.forEach((plan) => {
      const entry = makeChoice('radio', 'support-plan', plan.id, plan.name,
        plan.description, `${money(plan.prices[currency])} / month`, selectedSupportId === plan.id);
      entry.label.classList.add('support-choice');
      entry.input.addEventListener('change', updateQuote);
      supportHost.append(entry.label);
    });
  };

  const updateCatalogAmounts = () => {
    document.querySelectorAll('[data-price-inr][data-price-usd]').forEach((node) => {
      node.textContent = currency === 'INR' ? node.dataset.priceInr : node.dataset.priceUsd;
    });
    currencyButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.currencyChoice === currency)));
    if (!data) return;
    renderPackages(); renderAddons(); renderSupport(); updateQuote();
  };

  const setLine = (title, amount) => {
    const row = element('div');
    row.append(element('dt', '', title), element('dd', '', amount));
    linesHost.append(row);
  };

  const updateQuote = () => {
    if (!data) return;
    const item = activePackage();
    const details = [];
    let oneTime = item.prices[currency];
    const startText = item.priceType === 'starting-from' ? 'Base estimate (from)' : 'Package estimate';
    details.push({ label: `${item.name} · ${startText}`, amount: item.prices[currency] });
    data.addons.forEach((addon) => {
      const chosen = chosenAddons.get(addon.id);
      const included = (item.includedAddons || []).includes(addon.id);
      if (!chosen || included) return;
      const quantity = typeof chosen === 'number' ? chosen : 1;
      if (quantity < 1) return;
      const amount = addon.prices[currency] * quantity;
      oneTime += amount;
      details.push({ label: `${addon.name}${quantity > 1 ? ` × ${quantity}` : ''}`, amount });
    });
    const rush = document.querySelector('#rush-option')?.checked || false;
    const surcharge = rush ? Math.round(oneTime * data.rushSurchargePercent / 100) : 0;
    const total = oneTime + surcharge;
    if (rush) details.push({ label: `Rush surcharge (${data.rushSurchargePercent}%)`, amount: surcharge });
    linesHost.replaceChildren();
    details.forEach((line) => setLine(line.label, money(line.amount)));
    totalNode.textContent = money(total);
    const supportId = form.querySelector('input[name="support-plan"]:checked')?.value;
    const support = data.supportPlans.find((plan) => plan.id === supportId);
    monthlyNode.textContent = support ? `${money(support.prices[currency])} / month` : 'None selected';
    timelineNode.textContent = `Prior planning range: ${item.delivery}. Confirm the actual schedule in the written scope.`;
    currentQuote = { item, details, rush, surcharge, total, support, currency };
  };

  currencyButtons.forEach((button) => button.addEventListener('click', () => {
    currency = button.dataset.currencyChoice === 'USD' ? 'USD' : 'INR';
    updateCatalogAmounts();
  }));
  document.querySelector('#rush-option')?.addEventListener('change', updateQuote);
  document.querySelectorAll('[data-select-package]').forEach((link) => link.addEventListener('click', () => {
    const id = link.dataset.selectPackage;
    const target = document.querySelector(`input[name="package-id"][value="${CSS.escape(id)}"]`);
    if (target) { target.checked = true; renderAddons(); updateQuote(); }
  }));
  copyButton?.addEventListener('click', async () => {
    if (!currentQuote) return;
    const summary = makeEmailBody(currentQuote, false);
    const status = document.querySelector('#copy-feedback');
    try {
      await navigator.clipboard.writeText(summary);
      if (status) status.textContent = 'Estimate copied to clipboard.';
    } catch {
      const fallback = element('textarea', 'copy-fallback');
      fallback.readOnly = true; fallback.value = summary; fallback.setAttribute('aria-label', 'Select and copy the estimate summary');
      copyButton.insertAdjacentElement('afterend', fallback); fallback.focus(); fallback.select();
      if (status) status.textContent = 'Select the visible summary and copy it manually.';
    }
  });

  function makeEmailBody(quote, includeClient) {
    const rows = [
      'Project estimate request — Deep Manera',
      `Package: ${quote.item.name} (${quote.item.priceType === 'starting-from' ? 'starting from ' : ''}${money(quote.item.prices[quote.currency])})`,
      `Prior delivery estimate: ${quote.item.delivery}`,
      ...quote.details.slice(1).map((line) => `${line.label}: ${money(line.amount)}`),
      `Estimated one-time total: ${money(quote.total)}`,
      `Monthly support: ${quote.support ? `${quote.support.name}, ${money(quote.support.prices[quote.currency])} / month` : 'None selected'}`,
      `Currency: ${quote.currency}`,
      'This is an unverified, non-binding estimate from the previous portfolio rate file. Final pricing and dates require an agreed written scope.',
      'Applicable taxes, hosting, domains, provider charges and licences are not included unless agreed in writing.'
    ];
    if (includeClient) {
      rows.push(`Name: ${document.querySelector('#estimate-name').value.trim()}`);
      rows.push(`Reply email: ${document.querySelector('#estimate-email').value.trim()}`);
      rows.push(`Country: ${document.querySelector('#estimate-country').value.trim() || 'Not specified'}`);
      rows.push(`Project outline: ${document.querySelector('#estimate-notes').value.trim()}`);
    }
    return rows.join('\n');
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    message.textContent = '';
    if (!form.reportValidity()) return;
    if (!currentQuote) { message.textContent = 'Pricing options are unavailable. Please email directly.'; return; }
    const subject = encodeURIComponent(`Estimate enquiry — ${currentQuote.item.name}`);
    const body = encodeURIComponent(makeEmailBody(currentQuote, true));
    if (subject.length + body.length > 1700) {
      message.textContent = 'Please shorten the project outline to 400 characters so your email app can open the full draft.';
      document.querySelector('#estimate-notes').focus();
      return;
    }
    message.textContent = 'Opening your email app with a draft. It will not be sent automatically or stored on this website.';
    window.location.href = `mailto:${mailAddress}?subject=${subject}&body=${body}`;
  });

  fetch('/data/pricing.json', { cache: 'no-store' })
    .then((response) => { if (!response.ok) throw new Error('Pricing data unavailable'); return response.json(); })
    .then((loaded) => {
      if (!Array.isArray(loaded.packages) || !Array.isArray(loaded.addons) || !Array.isArray(loaded.supportPlans)) throw new Error('Pricing data is incomplete');
      data = loaded;
      error.hidden = true;
      const placeholder = document.querySelector('#estimate-lines > div');
      placeholder?.remove();
      if (!document.querySelector('#copy-feedback')) copyButton?.insertAdjacentElement('afterend', element('p', 'copy-feedback', ''));
      renderPackages(); renderAddons(); renderSupport(); updateCatalogAmounts();
      const queryPackage = new URLSearchParams(window.location.search).get('package');
      const requested = queryPackage || window.location.hash.match(/package-([a-z-]+)/)?.[1];
      if (requested && data.packages.some((item) => item.id === requested)) {
        const radio = packageHost.querySelector(`input[value="${CSS.escape(requested)}"]`);
        if (radio) { radio.checked = true; renderAddons(); updateQuote(); }
      }
    })
    .catch(() => {
      error.hidden = false;
      packageHost.replaceChildren(element('p', 'field-help', 'Estimator unavailable. Use the package guide above and contact Deep for a current written quote.'));
      addonHost.replaceChildren(element('p', 'field-help', 'Optional scope is discussed in the written proposal.'));
      supportHost.replaceChildren(element('p', 'field-help', 'Ongoing support is optional and scoped separately.'));
      totalNode.textContent = 'Ask for an estimate';
    });
})();
