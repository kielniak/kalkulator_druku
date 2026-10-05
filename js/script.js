// skrót do pobierania elementu i liczby z pola
const $ = (id) => document.getElementById(id);
const num = (id) => parseFloat($(id).value) || 0;

// formatowanie ceny: 12,34 zł
function pln(value) {
  return value.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' });
}

function calculate() {
  const weight = num('weight');
  const hours = num('hours') + num('minutes') / 60;

  const filament = (weight / 1000) * num('filamentPrice');
  const power = hours * (num('power') / 1000) * num('kwh');

  const wearPerHour = num('life') > 0 ? num('printerPrice') / num('life') : 0;
  const wear = hours * wearPerHour;

  const subtotal = filament + power + wear;
  const failure = subtotal * (num('failure') / 100);
  const margin = (subtotal + failure) * (num('margin') / 100);
  const total = subtotal + failure + margin;

  $('rFilament').textContent = pln(filament);
  $('rPower').textContent = pln(power);
  $('rWear').textContent = pln(wear);
  $('rFailure').textContent = pln(failure);
  $('rMargin').textContent = pln(margin);
  $('rTotal').textContent = pln(total);
}

// wybór filamentu ustawia jego domyślną cenę
$('filament').addEventListener('change', () => {
  $('filamentPrice').value = $('filament').value;
  calculate();
});

// wybór drukarki ustawia moc, cenę i żywotność
$('printer').addEventListener('change', () => {
  const [power, price, life] = $('printer').value.split('|');
  $('power').value = power;
  $('printerPrice').value = price;
  $('life').value = life;
  calculate();
});

// przeliczaj przy każdej zmianie w formularzu
$('form').addEventListener('input', calculate);

calculate();