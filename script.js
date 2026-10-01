const header = document.querySelector('.header');
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

function syncHeader() {
  header.classList.toggle('scrolled', window.scrollY > 24);
}
syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('#nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.faq-item button').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    document.querySelectorAll('.faq-item').forEach(other => {
      if (other !== item) other.classList.remove('open');
    });
    item.classList.toggle('open');
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const solarForm = document.getElementById('solarForm');
const resultCard = document.getElementById('resultCard');

const money = value => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0
}).format(value);

solarForm.addEventListener('submit', event => {
  event.preventDefault();

  const bill = Number(document.getElementById('bill').value);
  const profile = document.getElementById('profile').value;
  const name = document.getElementById('name').value.trim();

  if (!bill || bill < 150 || !name) return;

  // Simulação comercial demonstrativa, sem substituir dimensionamento técnico.
  const usableBill = Math.max(0, bill - 60);
  const monthlySaving = usableBill * 0.88;
  const estimatedConsumption = bill / 0.92;
  const systemSize = Math.max(1.5, estimatedConsumption / 125);
  const generation = systemSize * 124;

  document.getElementById('resultName').textContent = name.split(' ')[0];
  document.getElementById('monthlySaving').textContent = money(monthlySaving);
  document.getElementById('annualSaving').textContent = money(monthlySaving * 12);
  document.getElementById('systemSize').textContent = systemSize.toFixed(1).replace('.', ',') + ' kWp';
  document.getElementById('generation').textContent = Math.round(generation).toLocaleString('pt-BR') + ' kWh/mês';

  const message = [
    'Olá! Fiz uma simulação no site da Solare Energia.',
    '',
    'Nome: ' + name,
    'Perfil: ' + profile,
    'Conta média: ' + money(bill),
    'Economia mensal estimada: ' + money(monthlySaving),
    'Sistema aproximado: ' + systemSize.toFixed(1).replace('.', ',') + ' kWp',
    'Geração estimada: ' + Math.round(generation).toLocaleString('pt-BR') + ' kWh/mês',
    '',
    'Gostaria de receber uma análise mais detalhada.'
  ].join('\n');

  document.getElementById('whatsappResult').href =
    'https://wa.me/5562998230185?text=' + encodeURIComponent(message);

  resultCard.hidden = false;
  requestAnimationFrame(() => {
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
