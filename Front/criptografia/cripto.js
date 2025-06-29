document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', function() {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    // Fecha todos
    document.querySelectorAll('.faq-question').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.parentElement.querySelector('.faq-answer').style.display = 'none';
    });
    // Abre se estava fechado
    if (!expanded) {
      this.setAttribute('aria-expanded', 'true');
      this.parentElement.querySelector('.faq-answer').style.display = 'block';
    }
  });
});

document.querySelectorAll('.solution-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const card = this.closest('.solution-card');
    // Fecha outros cards abertos
    document.querySelectorAll('.solution-card.expanded').forEach(openCard => {
      if (openCard !== card) openCard.classList.remove('expanded');
    });
    // Alterna o card clicado
    card.classList.toggle('expanded');
  });
});