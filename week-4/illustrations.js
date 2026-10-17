/* Original schematic illustrations. They identify a type of product, not its actual packaging. */
(function () {
  'use strict';
  const ink = '#574d3d', green = '#668350', red = '#cb654c', gold = '#e3b85b';
  const leaf = (x, y, r = 0) => `<path d="M${x} ${y}q12-14 21-7q-5 14-21 7" fill="${green}" transform="rotate(${r} ${x} ${y})"/>`;
  const circle = (x,y,r,c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
  const defs = {
    butter: `<path d="M12 39l11-15h38l9 15-10 19H21z" fill="#ded4b9"/><path d="M21 39h39v19H21z" fill="#ead8a0"/><path d="M24 25h33v20H24z" fill="#f4d97f"/><path d="M24 25l8-8h31l-6 8z" fill="#fbe7a0"/><path d="M57 25l6-8v20l-6 8z" fill="#dcb65b"/><path d="M11 40l11 5m39 0l10-5" stroke="#b7a98a" fill="none"/>`,
    egg: `<path d="M13 47l8-8h39l8 8-7 14H20z" fill="#b5aa8f"/><path d="M20 44C10 35 21 16 27 16s16 19 7 28" fill="#eee1c5"/><path d="M37 44C28 35 39 13 45 13s17 22 7 31" fill="#d9b994"/><path d="M53 44c-8-8 1-25 7-25s14 17 6 25" fill="#f8edda"/><path d="M13 47h55l-7 14H20z" fill="#c5b89a"/><path d="M28 49v9m14-9v9m14-9v9" stroke="#a29880"/>`,
    milk: `<path d="M25 25l7-12h19l7 12v39H25z" fill="#f9f5e7"/><path d="M32 13l7 12h19l-7-12z" fill="#cfdecf"/><path d="M25 25h14v39H25z" fill="#e0e9dc"/><path d="M39 25h19v12H39z" fill="#7e9e8b"/><path d="M46 42c-11 13-10 19 0 19s11-6 0-19" fill="#b5cabe"/><path d="M32 13h19m-12 12v39" stroke="#a8b7a4" fill="none"/>`,
    kefir: `<path d="M31 12h19v8l6 10v31q0 5-5 5H30q-5 0-5-5V30l6-10z" fill="#f9f6e9"/><rect x="30" y="11" width="21" height="8" rx="2" fill="#698a6f"/><path d="M25 35h31v22H25z" fill="#c3d7ba"/><path d="M34 49q7-13 14-3q-5 10-14 3" fill="#718e61"/><path d="M30 28v31" stroke="#e7e4d7" stroke-width="3"/>`,
    orange: `${circle(33,44,21,'#e6a64a')}${circle(51,49,15,'#f1bf60')}<path d="M32 23l3-8" stroke="${green}" stroke-width="3"/>${leaf(34,23)}<path d="M15 43q1-11 9-15" fill="none" stroke="#f4ca79" stroke-width="3"/><path d="M44 47l16 3m-10-12l-1 24m-9-5l18-14" stroke="#f8d48e" stroke-width="2"/>`,
    apple: `<path d="M40 29C17 14 10 38 20 56s20 8 20 8s15 10 23-11S58 15 40 29" fill="#c87058"/><path d="M40 28q-3-12 3-17" stroke="#806543" stroke-width="4" fill="none"/>${leaf(42,21)}<path d="M24 34q-7 6-3 16" stroke="#e4a58d" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    pomegranate: `${circle(32,43,22,'#b96b5c')}<path d="M24 22l-2-9 8 4 5-7 5 11" fill="#9d594c"/><circle cx="51" cy="49" r="19" fill="#d8ad8d"/><circle cx="51" cy="49" r="15" fill="#eddbc0"/>${[[46,40],[55,40],[41,48],[50,48],[60,48],[45,57],[55,57]].map(([x,y])=>circle(x,y,3.3,'#b96b5c')).join('')}`,
    banana: `<path d="M17 25q14 31 48 16q-4 30-27 22Q16 56 13 31z" fill="#ecc75a"/><path d="M25 16q16 29 42 18q-4 23-25 20Q22 50 20 24z" fill="#f6da78"/><path d="M19 17l7-3m-13 13l6-2m42 14l7-4" stroke="#8a7445" stroke-width="4"/><path d="M21 33q8 20 28 22" fill="none" stroke="#d3ae44" stroke-width="1.6"/>`,
    cherry: `<path d="M26 44Q31 15 45 14q-3 12 11 29" stroke="${green}" stroke-width="3" fill="none"/>${leaf(44,17)}${circle(26,49,14,'#b96864')}${circle(55,51,14,'#d78c7b')}<path d="M18 45q2-5 6-5m24 5q2-5 6-5" stroke="#e3aaa0" stroke-width="3" stroke-linecap="round"/>`,
    blueberry: `<path d="M18 44l6-14h35l7 14-6 20H25z" fill="#c7bfac"/>${[[29,35],[43,31],[54,37],[25,47],[40,46],[55,49],[35,59],[48,59]].map(([x,y])=>circle(x,y,9,'#69728e')+`<path d="M${x-3} ${y-2}l3 2 3-2-2 4h-3z" fill="#a7adc0"/>`).join('')}`,
    strawberry: `<path d="M18 35q21-18 40 0q5 13-18 32Q14 48 18 35" fill="#cc715c"/><path d="M24 31l5-10 10 6 10-6 7 12-17 4z" fill="${green}"/><path d="M25 41l2 2m12-2l1 2m12-2l-1 2m-22 7l2 2m10 1l1 2m9-8l-1 2m-13 8l2 2" stroke="#f5d598" stroke-width="2"/>`,
    mango: `<path d="M58 20c16 13 8 34-14 43S9 52 18 35s24-28 40-15" fill="#d4a24e"/><path d="M29 37q11-15 24-14" stroke="#edc875" stroke-width="4" fill="none" stroke-linecap="round"/>${leaf(53,20,25)}<path d="M46 37l15 5-11 19-18-6z" fill="#f0be55"/><path d="M46 37l-14 18m9-16l-8 12m20-12L38 57m20-16L45 59m-8-13l16 5m-20 0l17 5" stroke="#d99f39" stroke-width="1.4"/>`,
    fruitmix: `<path d="M15 37h50q-2 29-25 29T15 37" fill="#a1b29a"/><path d="M19 34l4-16 15 4-1 15zm20 1l6-17 16 7-5 14z" fill="#e3b65c"/>${[[25,36],[40,31],[54,36]].map(([x,y])=>circle(x,y,8,'#727c97')).join('')}<path d="M17 41h46" stroke="#c7d0b6" stroke-width="3"/>`,
    tomato: `${circle(29,48,18,'#ce7256')}${circle(54,43,17,'#d88460')}${circle(44,59,12,'#c66550')}<path d="M21 29q18-10 35-4M30 29l-1 8m21-12l4 6m-15-3l4 18" stroke="${green}" stroke-width="3" fill="none"/><path d="M19 38l10 3 9-5-7 8-8 1zm27-7l8 4 8-2-6 7-8-2z" fill="${green}"/>`,
    cucumber: `<g transform="rotate(-35 40 40)"><rect x="17" y="27" width="48" height="23" rx="12" fill="#66894c"/><path d="M24 34h30m-26 9h27" stroke="#8da66a" stroke-width="2" stroke-linecap="round"/><ellipse cx="20" cy="39" rx="8" ry="12" fill="#c9d59a"/><ellipse cx="20" cy="39" rx="4" ry="8" fill="#e4e6b7"/><path d="M18 34v3m3 3v3m-3 1v2" stroke="#a5b57b"/></g>`,
    greens: `<path d="M40 63L23 27m17 36l18-37m-18 37l2-44" stroke="#8d9e59" stroke-width="3"/>${[[25,36,-30],[40,30,20],[48,42,45],[22,48,-55],[35,50,-20],[47,25,45]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="10" ry="16" transform="rotate(${r} ${x} ${y})" fill="${r>0?'#7b965d':'#5d8155'}"/>`).join('')}<path d="M28 39l12 23 5-26" stroke="#a7b67b" stroke-width="1.6" fill="none"/>`,
    avocado: `<path d="M31 15c8-10 17 1 18 12s14 20 10 32-33 14-38-1S26 27 31 15" fill="#5c7949"/><path d="M33 19c6-6 11 1 12 11s12 20 8 28-24 11-27-1 4-26 7-38" fill="#c3ce85"/>${circle(40,50,10,'#96724c')}${circle(37,47,3,'#b18d64')}`,
    carrot: `<path d="M24 30q9-8 17 1L59 65Q60 69 55 65L21 41q-5-5 3-11" fill="#d9964f"/><path d="M27 29L19 14m12 12l4-14m-12 19L10 24" stroke="${green}" stroke-width="5" stroke-linecap="round"/><path d="M29 40l7-3m3 12l5-3m3 10l4-2" stroke="#b77b3d" stroke-width="2"/>`,
    cheese: `<path d="M17 38l36-19 15 29-47 16z" fill="#eccb6c"/><path d="M17 38l4 26 47-16V34z" fill="#dfb856"/><path d="M17 38l36-19 15 15z" fill="#f2d784"/>${circle(35,47,4,'#bc963e')}${circle(56,44,3,'#bc963e')}${circle(46,29,3,'#d7b75a')}`,
    bread: `<path d="M13 48c-1-16 14-28 33-26 21 1 26 17 21 29L59 62H22z" fill="#bd8c57"/><path d="M16 44c1-12 15-20 29-19 16 0 22 9 20 20z" fill="#d7ac70"/><path d="M28 28l-7 14m21-17l-8 17m23-13l-9 14" stroke="#edcb95" stroke-width="4" stroke-linecap="round"/><path d="M20 49h40" stroke="#aa774b" fill="none"/>`,
    fish: `<path d="M15 40q21-27 42-7l12-13v39L57 46Q34 68 15 40" fill="#90aaa3"/><path d="M24 40q15-13 28-4m-24 9q12 9 22 1" stroke="#bdccc1" stroke-width="2" fill="none"/>${circle(25,36,2.5,ink)}<path d="M35 24l7-9 6 13m-9 28l6 9 7-15" fill="#7b9890"/>`,
    meat: `<path d="M20 24c15-16 45-7 47 13 2 13-17 13-20 25s-27 10-30-4S9 34 20 24" fill="#d28e7c"/><path d="M24 29c12-12 33-6 36 8s-16 10-19 21-19 4-20-6-5-15 3-23" fill="#b66f61"/><path d="M30 25q6 13 21 18m-27 6q8-2 15 7" stroke="#e5b9a7" stroke-width="4" fill="none"/>`,
    water: `<path d="M32 12h17v11l6 9v29q0 5-5 5H31q-5 0-5-5V32l6-9z" fill="#c7dedc"/><rect x="31" y="11" width="19" height="8" rx="2" fill="#6e9e9c"/><path d="M27 36q10-5 27 0v22H27z" fill="#9bc4c6"/><path d="M33 28v30" stroke="#e5f0e9" stroke-width="3" stroke-linecap="round"/><path d="M28 45h25m-25 8h25" stroke="#c5dedb" stroke-width="1.5"/>`,
    chocolate: `<g transform="rotate(14 40 40)"><rect x="21" y="12" width="39" height="57" rx="4" fill="#8a6046"/><path d="M22 44h37v24H22z" fill="#b5ab8d"/><path d="M21 44l9-4 10 5 10-4 10 4v7H21z" fill="#d9d3be"/><path d="M27 18h11v10H27zm17 0h10v10H44zm-17 15h11v8H27zm17 0h10v8H44z" fill="#a27b57"/></g>`,
    pizza: `${circle(40,41,27,'#cc9d63')}${circle(40,40,23,'#e9c678')}${[[31,29],[50,33],[31,49],[50,53]].map(([x,y])=>circle(x,y,5,'#bc6f53')).join('')}<path d="M40 17v47M17 40h46m-40-17l34 34m0-34L23 57" stroke="#c3a064" stroke-width="1.5"/><path d="M43 25l5 4m-24 9l5 3m10 13l4 4m8-17l5 3" stroke="${green}" stroke-width="3"/>`,
    pancakes: `<ellipse cx="40" cy="52" rx="29" ry="15" fill="#d8d5c5"/>${[[28,46],[48,47],[40,34]].map(([x,y])=>`<ellipse cx="${x}" cy="${y+3}" rx="13" ry="8" fill="#bd915b"/><ellipse cx="${x}" cy="${y}" rx="13" ry="8" fill="#dfbb7d"/>`).join('')}<path d="M35 32q7-9 14 1-7 7-14-1" fill="#fcf4df"/>${circle(58,53,4,'#a66769')}`,
    soup: `<ellipse cx="39" cy="34" rx="27" ry="13" fill="#c5cabb"/><path d="M12 35q2 31 27 31t27-31" fill="#a8b5a1"/><ellipse cx="39" cy="34" rx="23" ry="10" fill="#deb578"/><path d="M25 35q7-8 13-1t16-1" stroke="#f4dab0" stroke-width="2" fill="none"/><path d="M27 16q-4-5 0-10m12 11q-4-5 0-10" stroke="#c7bb9f" stroke-width="2" fill="none"/>`,
    meal: `<ellipse cx="40" cy="43" rx="30" ry="25" fill="#d7d7c5"/><ellipse cx="40" cy="41" rx="25" ry="20" fill="#f8f2e1"/><path d="M25 42q5-18 18-12t2 24-20-12" fill="#d9b574"/><path d="M48 31l10 7-4 16-10-4z" fill="#8a9b64"/>${circle(24,48,5,'#c98260')}${circle(33,55,4,'#c98260')}`,
    medicine: `<rect x="16" y="27" width="48" height="35" rx="6" fill="#d8dfca"/><path d="M29 27v-8h22v8" stroke="#91a486" stroke-width="5" fill="none"/><path d="M35 34h10v7h7v10h-7v7H35v-7h-7V41h7z" fill="#7d9877"/>`,
    cleaning: `<path d="M31 16h19v12l9 9v26H23V37l8-9z" fill="#b2c8b1"/><path d="M30 13h25l7 6-3 5-10-5H30z" fill="#7b987c"/><path d="M25 42h32v16H25z" fill="#e9e4cc"/><path d="M40 44q-13 10 0 13 13-3 0-13" fill="#91af86"/><path d="M65 31v8m-4-4h8M13 43v8m-4-4h8" stroke="#c5ac6e" stroke-width="2"/>`,
    paper: `<path d="M23 29v31q0 8 18 8t18-8V29" fill="#e5dec7"/><ellipse cx="41" cy="29" rx="18" ry="10" fill="#f4efdf"/><ellipse cx="41" cy="29" rx="6" ry="4" fill="#b7a98b"/><path d="M59 33l8 9v23H51V43" fill="#f6f0de"/><path d="M28 40v18" stroke="#f6f0de" stroke-width="3"/>`,
    battery: `<g transform="rotate(20 40 40)"><rect x="25" y="17" width="30" height="49" rx="5" fill="#7c8d7b"/><rect x="34" y="11" width="12" height="7" rx="2" fill="#a6ad9b"/><path d="M25 32h30v16H25z" fill="#d9c99c"/><path d="M40 35v10m-5-5h10" stroke="#7a745a" stroke-width="2"/></g>`,
    juice: `<path d="M24 24l7-11h20l8 11v42H24z" fill="#e4bd70"/><path d="M31 13l7 11h21l-8-11z" fill="#f1d39a"/><path d="M24 34h35v24H24z" fill="#efe3bf"/>${circle(42,46,9,'#d89e4d')}${leaf(44,37,0)}<path d="M51 11v-5" stroke="#8a9a71" stroke-width="3"/>`,
    coffee: `<path d="M19 29h37v26q0 12-18 12T19 55z" fill="#c2b28e"/><path d="M57 34h5q14 9 0 22h-7" stroke="#a99877" stroke-width="5" fill="none"/><ellipse cx="38" cy="29" rx="19" ry="8" fill="#eadcc0"/><ellipse cx="38" cy="29" rx="15" ry="5" fill="#79604a"/><path d="M29 17q-5-6 0-11m14 11q-5-6 0-11" stroke="#bfb29b" stroke-width="2" fill="none"/>`,
    snack: `<path d="M23 14h34l5 51H18z" fill="#d7bd85"/><path d="M23 14l5 5 5-5 5 5 5-5 5 5 9-5m-39 51l6-5 6 5 6-5 6 5 6-5 8 5" stroke="#b79d68" fill="none"/><ellipse cx="35" cy="37" rx="10" ry="15" transform="rotate(25 35 37)" fill="#eed392"/><ellipse cx="47" cy="48" rx="9" ry="13" transform="rotate(-20 47 48)" fill="#e5c273"/>`,
    delivery: `<path d="M15 29h32v28H15z" fill="#c8ac76"/><path d="M47 36h11l11 12v9H47z" fill="#9daa89"/><path d="M52 40h6l6 7H52z" fill="#e9e6ce"/>${circle(27,58,7,'#706953')}${circle(58,58,7,'#706953')}${circle(27,58,3,'#d1c5a8')}${circle(58,58,3,'#d1c5a8')}<path d="M22 24h18M9 38h10M7 47h12" stroke="#ac9670" stroke-width="2"/>`,
    box: `<path d="M13 31l28-15 27 14-26 16z" fill="#d4bc8c"/><path d="M13 31v28l29 14V46z" fill="#bba06f"/><path d="M42 46l26-16v28L42 73z" fill="#cab182"/><path d="M29 22l27 15v10l-9 5V42L20 27" fill="#e7d9b3"/>`,
    basket: `<path d="M13 35h54l-7 30H21z" fill="#c8b08a"/><path d="M25 35l12-20m17 20L43 15" stroke="#9b845e" stroke-width="5" stroke-linecap="round"/><path d="M27 43v14m13-14v14m13-14v14" stroke="#eee1bd" stroke-width="3" stroke-linecap="round"/>`
  };
  const rules = [
    [/масло.*слив|сладко-слив/, 'butter'],[/сырник/, 'pancakes'],[/гранат/, 'pomegranate'],[/черешн|вишн/, 'cherry'],[/голубик|ежевик|черник/, 'blueberry'],[/клубник|земляник|малин/, 'strawberry'],[/апельсин|мандарин|грейпфрут|лимон|лайм/, 'orange'],[/яблок|груш/, 'apple'],[/банан/, 'banana'],[/манго|персик|абрикос|нектарин/, 'mango'],
    [/помидор|томат|черри/, 'tomato'],[/огур|кабач|цукини/, 'cucumber'],[/авокад/, 'avocado'],[/морков|тыкв/, 'carrot'],[/шпинат|руккол|салат|капуст|петруш|броккол|кейл|порей/, 'greens'],
    [/кефир|ряженк|йогур|сметан|творог/, 'kefir'],[/молоко|сливки/, 'milk'],[/яйц/, 'egg'],[/сыр /, 'cheese'],[/хлеб|батон|багет|булк|чиабатт|лепеш/, 'bread'],[/форел|лосос|рыб|сельд|кревет|семг/, 'fish'],[/мяс|фарш|филе|бекон|колбас|сосиск|куриц|индейк/, 'meat'],
    [/вода /, 'water'],[/шоколад|конфет|батончик/, 'chocolate'],[/пицц/, 'pizza'],[/суп|бульон|борщ/, 'soup'],[/кофе|американо|латте/, 'coffee'],[/сок|нектар|напиток|лимонад|морс|смузи|чай|квас/, 'juice'],[/чипс|попкорн|крекер|орех|семеч|начос|сухар/, 'snack'],[/батаре/, 'battery'],[/бумаг|салфет|полотенц/, 'paper']
  ];
  const cache = Object.create(null);
  function kind(name, category) {
    const n = String(name || '').toLowerCase().replaceAll('ё','е');
    const c = String(category || '').toLowerCase();
    if (c === 'аптека') return 'medicine';
    if (n === 'доставка') return 'delivery';
    if (n === 'упаковка') return 'box';
    if (c === 'товары для дома') {
      if (/батаре/.test(n)) return 'battery';
      if (/бумаг|салфет|полотенц/.test(n)) return 'paper';
      return 'cleaning';
    }
    // Match the dish before its ingredients.
    if (/^(шоколад|конфет|батончик)/.test(n)) return 'chocolate';
    if (/пицц/.test(n)) return 'pizza';
    if (/сырник/.test(n)) return 'pancakes';
    if (/фруктовый микс/.test(n)) return 'fruitmix';
    if (/суп|борщ/.test(n)) return 'soup';
    if (c === 'готовая еда') return 'meal';
    if (c === 'напитки') return /кофе|американо|латте/.test(n) ? 'coffee' : 'juice';
    for (const [pattern, key] of rules) if (pattern.test(n)) return key;
    if (c === 'фрукты') return 'apple';
    if (c === 'овощи') return 'greens';
    if (c === 'сладости') return 'chocolate';
    if (c === 'снеки') return 'snack';
    if (c === 'вода') return 'water';
    if (c === 'напитки') return 'juice';
    return 'basket';
  }
  window.productArt = function (name, category) {
    const key = kind(name, category);
    if (!cache[key]) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="15" fill="#f3f0e5"/><ellipse cx="40" cy="67" rx="25" ry="4" fill="#e7e2d3"/>${defs[key]}</svg>`;
      cache[key] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }
    return cache[key];
  };
})();
