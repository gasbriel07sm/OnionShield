document.querySelectorAll('.core-feature-question').forEach(btn => {
  btn.addEventListener('click', function() {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.core-feature-question').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.parentElement.querySelector('.core-feature-answer').style.display = 'none';
    });
    if (!expanded) {
      this.setAttribute('aria-expanded', 'true');
      this.parentElement.querySelector('.core-feature-answer').style.display = 'block';
    }
  });
});