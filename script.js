(() => {
  const SYMBOLS = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  const MAX_DIGITS = 12;

  const exprEl = document.getElementById('expr');
  const resultEl = document.getElementById('result');
  const keysEl = document.getElementById('keys');

  // ---------- State ----------
  let current = '0';        // number being typed
  let previous = null;      // stored left operand
  let operator = null;      // '+', '-', '*', '/'
  let awaiting = false;     // true right after an operator was pressed
  let justEvaluated = false;
  let error = false;
  let history = '';         // e.g. "2 + 3 =" shown after equals

  // ---------- Helpers ----------
  function format(str) {
    if (str.includes('e')) return str;
    const neg = str.startsWith('-');
    const [int, dec] = (neg ? str.slice(1) : str).split('.');
    const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (neg ? '-' : '') + grouped + (dec !== undefined ? '.' + dec : '');
  }

  function toStr(n) {
    const rounded = Number(n.toPrecision(12)); // removes 0.1 + 0.2 noise
    let s = String(rounded);
    if (s.length > 14) s = rounded.toExponential(6).replace(/\.?0+e/, 'e');
    return s;
  }

  function compute(a, b, op) {
    const x = parseFloat(a);
    const y = parseFloat(b);
    switch (op) {
      case '+': return x + y;
      case '-': return x - y;
      case '*': return x * y;
      case '/': return y === 0 ? null : x / y;
    }
    return y;
  }

  function resetAll() {
    current = '0';
    previous = null;
    operator = null;
    awaiting = false;
    justEvaluated = false;
    error = false;
    history = '';
  }

  // ---------- Actions ----------
  function inputDigit(d) {
    if (error || justEvaluated) resetAll();
    if (awaiting) { current = '0'; awaiting = false; }
    if (current.replace(/[-.]/g, '').length >= MAX_DIGITS) return;
    current = current === '0' ? d : current + d;
  }

  function inputDecimal() {
    if (error || justEvaluated) resetAll();
    if (awaiting) { current = '0'; awaiting = false; }
    if (!current.includes('.')) current += '.';
  }

  function chooseOperator(op) {
    if (error) return;
    if (justEvaluated) { justEvaluated = false; history = ''; }

    if (operator && previous !== null && !awaiting) {
      // chain: 2 + 3 × ... → calculate 2 + 3 first
      const r = compute(previous, current, operator);
      if (r === null) return fail();
      previous = toStr(r);
      current = previous;
    } else if (previous === null) {
      previous = current;
    }
    operator = op;
    awaiting = true;
  }

  function equals() {
    if (error || operator === null || previous === null) return;
    const r = compute(previous, current, operator);
    if (r === null) return fail();
    history = `${format(previous)} ${SYMBOLS[operator]} ${format(current)} =`;
    current = toStr(r);
    previous = null;
    operator = null;
    awaiting = false;
    justEvaluated = true;
  }

  function fail() {
    resetAll();
    error = true;
  }

  function del() {
    if (error) return resetAll();
    if (justEvaluated || awaiting) return;
    current = current.slice(0, -1);
    if (current === '' || current === '-') current = '0';
  }

  // ---------- Rendering ----------
  function render() {
    const text = error ? 'Can’t divide by zero' : format(current);
    resultEl.textContent = text;
    resultEl.className =
      'result' + (error ? ' err' : text.length > 16 ? ' sm' : text.length > 10 ? ' md' : '');

    if (justEvaluated) {
      exprEl.textContent = history;
    } else if (previous !== null && operator) {
      exprEl.textContent = `${format(previous)} ${SYMBOLS[operator]}`;
    } else {
      exprEl.textContent = '';
    }

    keysEl.querySelectorAll('.op').forEach((b) =>
      b.classList.toggle('active', awaiting && !error && b.dataset.op === operator)
    );
  }

  function press(action, value) {
    switch (action) {
      case 'digit':   inputDigit(value); break;
      case 'decimal': inputDecimal(); break;
      case 'op':      chooseOperator(value); break;
      case 'equals':  equals(); break;
      case 'delete':  del(); break;
      case 'clear':   resetAll(); break;
    }
    render();
  }

  // ---------- Mouse / touch ----------
  keysEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button.key');
    if (!btn) return;
    if (btn.dataset.digit !== undefined) press('digit', btn.dataset.digit);
    else if (btn.dataset.op) press('op', btn.dataset.op);
    else press(btn.dataset.action);
  });

  // ---------- Keyboard ----------
  function flash(selector) {
    const el = keysEl.querySelector(selector);
    if (!el) return;
    el.classList.add('pressed');
    setTimeout(() => el.classList.remove('pressed'), 110);
  }

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;

    if (/^[0-9]$/.test(k)) {
      press('digit', k);
      flash(`[data-digit="${k}"]`);
    } else if (k === '.' || k === ',') {
      press('decimal');
      flash('[data-action="decimal"]');
    } else if (['+', '-', '*', '/'].includes(k) || k === 'x' || k === 'X') {
      const op = k === 'x' || k === 'X' ? '*' : k;
      press('op', op);
      flash(`[data-op="${op}"]`);
    } else if (k === 'Enter' || k === '=') {
      press('equals');
      flash('[data-action="equals"]');
    } else if (k === 'Backspace') {
      press('delete');
      flash('[data-action="delete"]');
    } else if (k === 'Escape' || k === 'Delete' || k === 'c' || k === 'C') {
      press('clear');
      flash('[data-action="clear"]');
    } else {
      return;
    }
    e.preventDefault(); // stops "/" quick-find and Enter re-clicking a focused button
  });

  render();
})();
