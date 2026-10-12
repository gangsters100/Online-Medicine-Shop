/**
 * data.js: Centralized mock data repository for Indian Medicine Shop
 * Adheres strictly to docs/API_CONTRACT.md and Indian pharmaceutical standards (CDSCO & Drugs & Cosmetics Act)
 */

/* ==========================================================================
   AUTHENTIC PACKAGING SVG ILLUSTRATIONS
   Crisp, self-contained SVG packaging that never fails to load or breaks.
   ========================================================================== */

const SVG_DOLO_650 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <linearGradient id="strip" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23ffffff"/>
      <stop offset="100%" stop-color="%23f0fdf4"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="%230f172a" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect x="25" y="25" width="270" height="170" rx="14" fill="url(%23strip)" stroke="%2316a34a" stroke-width="2" filter="url(%23shadow)"/>
  <rect x="25" y="25" width="270" height="34" rx="14" fill="%2316a34a"/>
  <rect x="25" y="45" width="270" height="14" fill="%2316a34a"/>
  <text x="40" y="48" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="%23ffffff" letter-spacing="1">MICRO LABS</text>
  <circle cx="270" cy="42" r="8" fill="%23ffffff"/>
  <path d="M270 37v10M265 42h10" stroke="%2316a34a" stroke-width="2.5" stroke-linecap="round"/>
  <text x="40" y="95" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="%2315803d">DOLO 650</text>
  <text x="40" y="118" font-family="system-ui, sans-serif" font-weight="600" font-size="13" fill="%23374151">Paracetamol Tablets IP 650 mg</text>
  <rect x="40" y="132" width="105" height="20" rx="4" fill="%23dcfce7"/>
  <text x="48" y="146" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="%23166534">Strip of 15 Tablets</text>
  <!-- Tablet Blister Impressions -->
  <g fill="%23ffffff" stroke="%2386efac" stroke-width="2">
    <ellipse cx="185" cy="148" rx="18" ry="12"/>
    <ellipse cx="230" cy="148" rx="18" ry="12"/>
    <ellipse cx="275" cy="148" rx="18" ry="12"/>
    <line x1="185" y1="138" x2="185" y2="158" stroke="%23bbf7d0" stroke-width="1.5"/>
    <line x1="230" y1="138" x2="230" y2="158" stroke="%23bbf7d0" stroke-width="1.5"/>
    <line x1="275" y1="138" x2="275" y2="158" stroke="%23bbf7d0" stroke-width="1.5"/>
  </g>
  <text x="40" y="178" font-family="system-ui, sans-serif" font-weight="500" font-size="11" fill="%236b7280">Fast fever relief & analgesic</text>
</svg>`;

const SVG_CROCIN_650 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <filter id="shadow2" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="%230f172a" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect x="25" y="25" width="270" height="170" rx="14" fill="%23ffffff" stroke="%23dc2626" stroke-width="2" filter="url(%23shadow2)"/>
  <path d="M25 39 C 100 25, 200 60, 295 35 L 295 25 L 25 25 Z" fill="%23dc2626"/>
  <text x="40" y="44" font-family="system-ui, sans-serif" font-weight="800" font-size="13" fill="%23ffffff">GSK GlaxoSmithKline</text>
  <circle cx="265" cy="85" r="24" fill="%23fee2e2" stroke="%23f87171" stroke-width="1.5"/>
  <text x="265" y="83" font-family="system-ui, sans-serif" font-weight="800" font-size="9" fill="%23b91c1c" text-anchor="middle">OPTIZORB</text>
  <text x="265" y="95" font-family="system-ui, sans-serif" font-weight="600" font-size="8" fill="%23b91c1c" text-anchor="middle">TECHNOLOGY</text>
  <text x="40" y="95" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="%23b91c1c">CROCIN 650</text>
  <text x="40" y="118" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="%231f2937">ADVANCE Fast Release</text>
  <text x="40" y="138" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="%234b5563">Paracetamol Tablets IP 650 mg</text>
  <rect x="40" y="152" width="125" height="22" rx="4" fill="%23fee2e2"/>
  <text x="48" y="167" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="%23991b1b">Acts in 5 Minutes</text>
  <text x="180" y="167" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="%236b7280">Strip of 15 Tablets</text>
</svg>`;

const SVG_COMBIFLAM = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <filter id="shadow3" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="%230f172a" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect x="25" y="25" width="270" height="170" rx="14" fill="%23ffffff" stroke="%239333ea" stroke-width="2" filter="url(%23shadow3)"/>
  <rect x="25" y="25" width="270" height="34" rx="14" fill="%239333ea"/>
  <rect x="25" y="45" width="270" height="14" fill="%239333ea"/>
  <text x="40" y="48" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="%23ffffff">SANOFI INDIA</text>
  <text x="40" y="98" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="%237e22ce">COMBIFLAM</text>
  <text x="40" y="122" font-family="system-ui, sans-serif" font-weight="600" font-size="13" fill="%23374151">Ibuprofen & Paracetamol Tablets</text>
  <text x="40" y="142" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="%236b7280">Ibuprofen 400mg + Paracetamol 325mg</text>
  <rect x="40" y="156" width="120" height="22" rx="4" fill="%23f3e8ff"/>
  <text x="48" y="171" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="%236b21a8">Strip of 20 Tablets</text>
  <!-- Flame Icon -->
  <path d="M260 160 c-8 0 -15 -6 -15 -14 c0 -10 12 -22 15 -25 c3 3 15 15 15 25 c0 8 -7 14 -15 14 z" fill="%23f97316"/>
</svg>`;

const SVG_AUGMENTIN = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <filter id="shadow4" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="%230f172a" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect x="25" y="25" width="270" height="170" rx="14" fill="%23ffffff" stroke="%230284c7" stroke-width="2" filter="url(%23shadow4)"/>
  <!-- Red Schedule H1 Warning Band (Indian Regulatory) -->
  <rect x="25" y="25" width="270" height="24" rx="14" fill="%23dc2626"/>
  <rect x="25" y="37" width="270" height="12" fill="%23dc2626"/>
  <text x="35" y="39" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="%23ffffff" letter-spacing="0.5">SCHEDULE H1 PRESCRIPTION DRUG - CAUTION</text>
  <text x="40" y="80" font-family="system-ui, sans-serif" font-weight="800" font-size="12" fill="%230369a1">GSK PHARMA</text>
  <text x="40" y="106" font-family="system-ui, sans-serif" font-weight="900" font-size="24" fill="%230284c7">AUGMENTIN 625 DUO</text>
  <text x="40" y="128" font-family="system-ui, sans-serif" font-weight="600" font-size="12" fill="%23374151">Amoxycillin & Potassium Clavulanate IP</text>
  <text x="40" y="146" font-family="system-ui, sans-serif" font-weight="500" font-size="11" fill="%236b7280">500mg Amoxycillin + 125mg Clavulanic Acid</text>
  <rect x="40" y="158" width="130" height="20" rx="4" fill="%23e0f2fe"/>
  <text x="48" y="172" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="%230369a1">Strip of 10 Tablets</text>
  <rect x="180" y="158" width="85" height="20" rx="4" fill="%23fee2e2"/>
  <text x="188" y="172" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="%23b91c1c">Rx Required</text>
</svg>`;

const SVG_BECOSULES = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <filter id="shadow5" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="%230f172a" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect x="25" y="25" width="270" height="170" rx="14" fill="%23fef08a" stroke="%23ca8a04" stroke-width="2" filter="url(%23shadow5)"/>
  <rect x="25" y="25" width="270" height="34" rx="14" fill="%23ca8a04"/>
  <rect x="25" y="45" width="270" height="14" fill="%23ca8a04"/>
  <text x="40" y="48" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="%23ffffff">PFIZER HEALTHCARE</text>
  <text x="40" y="96" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="%23854d0e">BECOSULES Z</text>
  <text x="40" y="120" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="%23713f12">Vitamin B-Complex + C + Zinc</text>
  <text x="40" y="140" font-family="system-ui, sans-serif" font-weight="500" font-size="11" fill="%23854d0e">Immunity booster & energy vitalizer</text>
  <!-- Capsule Icon -->
  <g transform="translate(230, 80)">
    <rect x="0" y="0" width="36" height="16" rx="8" fill="%23e11d48"/>
    <rect x="18" y="0" width="18" height="16" rx="8" fill="%230f172a"/>
  </g>
  <rect x="40" y="154" width="135" height="22" rx="4" fill="%23fef9c3"/>
  <text x="48" y="169" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="%23854d0e">Strip of 20 Capsules</text>
</svg>`;

const SVG_LIMCEE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <filter id="shadow6" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="%230f172a" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect x="25" y="25" width="270" height="170" rx="14" fill="%23ffffff" stroke="%23ea580c" stroke-width="2" filter="url(%23shadow6)"/>
  <rect x="25" y="25" width="270" height="34" rx="14" fill="%23ea580c"/>
  <rect x="25" y="45" width="270" height="14" fill="%23ea580c"/>
  <text x="40" y="48" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="%23ffffff">ABBOTT INDIA</text>
  <circle cx="260" cy="110" r="26" fill="%23ffedd5" stroke="%23fb923c" stroke-width="2"/>
  <text x="260" y="115" font-family="system-ui, sans-serif" font-weight="900" font-size="16" fill="%23ea580c" text-anchor="middle">🍊 500</text>
  <text x="40" y="96" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="%23c2410c">LIMCEE 500mg</text>
  <text x="40" y="120" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="%23374151">Vitamin C Chewable Tablets IP</text>
  <text x="40" y="140" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="%23ea580c">Tangy Orange Flavour</text>
  <rect x="40" y="154" width="140" height="22" rx="4" fill="%23ffedd5"/>
  <text x="48" y="169" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="%239a3412">Strip of 15 Chewables</text>
</svg>`;

const SVG_VOLINI = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <filter id="shadow7" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="%230f172a" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect x="25" y="25" width="270" height="170" rx="14" fill="%23ffffff" stroke="%230284c7" stroke-width="2" filter="url(%23shadow7)"/>
  <rect x="25" y="25" width="270" height="34" rx="14" fill="%230284c7"/>
  <rect x="25" y="45" width="270" height="14" fill="%230284c7"/>
  <text x="40" y="48" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="%23ffffff">SUN PHARMA</text>
  <text x="40" y="96" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="%230369a1">VOLINI GEL</text>
  <text x="40" y="120" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="%23ea580c">Instant Pain Relief Gel (75g)</text>
  <text x="40" y="140" font-family="system-ui, sans-serif" font-weight="500" font-size="11" fill="%234b5563">Diclofenac + Methyl Salicylate + Menthol</text>
  <!-- Tube graphic -->
  <path d="M210 162 L275 142 L280 152 L215 172 Z" fill="%230284c7"/>
  <circle cx="212" cy="167" r="5" fill="%23ea580c"/>
  <rect x="40" y="154" width="130" height="22" rx="4" fill="%23e0f2fe"/>
  <text x="48" y="169" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="%230369a1">Deep Joint & Back Relief</text>
</svg>`;

const SVG_BETADINE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <filter id="shadow8" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="%230f172a" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect x="25" y="25" width="270" height="170" rx="14" fill="%23ffffff" stroke="%23ca8a04" stroke-width="2" filter="url(%23shadow8)"/>
  <rect x="25" y="25" width="270" height="34" rx="14" fill="%23854d0e"/>
  <rect x="25" y="45" width="270" height="14" fill="%23854d0e"/>
  <text x="40" y="48" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="%23ffffff">WIN-MEDICARE</text>
  <text x="40" y="96" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="%23854d0e">BETADINE 10%</text>
  <text x="40" y="120" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="%23374151">Povidone-Iodine Ointment IP 10%</text>
  <text x="40" y="140" font-family="system-ui, sans-serif" font-weight="500" font-size="11" fill="%236b7280">Antiseptic & Microbicidal for Wounds (20g)</text>
  <rect x="40" y="154" width="130" height="22" rx="4" fill="%23fef9c3"/>
  <text x="48" y="169" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="%23854d0e">First Aid Antiseptic</text>
</svg>`;

const SVG_HONITUS = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <filter id="shadow9" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="%230f172a" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect x="25" y="25" width="270" height="170" rx="14" fill="%23fffbeb" stroke="%23b45309" stroke-width="2" filter="url(%23shadow9)"/>
  <rect x="25" y="25" width="270" height="34" rx="14" fill="%2315803d"/>
  <rect x="25" y="45" width="270" height="14" fill="%2315803d"/>
  <text x="40" y="48" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="%23ffffff">DABUR AYURVEDA</text>
  <text x="40" y="96" font-family="system-ui, sans-serif" font-weight="900" font-size="26" fill="%23b45309">Dabur HONITUS</text>
  <text x="40" y="120" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="%2315803d">100% Ayurvedic Cough Syrup</text>
  <text x="40" y="140" font-family="system-ui, sans-serif" font-weight="500" font-size="11" fill="%2378350f">Enriched with Tulsi, Mulethi & Honey (100ml)</text>
  <rect x="40" y="154" width="135" height="22" rx="4" fill="%23dcfce7"/>
  <text x="48" y="169" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="%23166534">Non-Drowsy Formula</text>
</svg>`;

const SVG_ACCUCHEK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <filter id="shadow10" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="%230f172a" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect x="25" y="25" width="270" height="170" rx="14" fill="%23ffffff" stroke="%230f172a" stroke-width="2" filter="url(%23shadow10)"/>
  <rect x="25" y="25" width="270" height="34" rx="14" fill="%230f172a"/>
  <rect x="25" y="45" width="270" height="14" fill="%230f172a"/>
  <text x="40" y="48" font-family="system-ui, sans-serif" font-weight="800" font-size="13" fill="%23ffffff">ROCHE DIABETES CARE</text>
  <!-- Meter graphic -->
  <rect x="220" y="80" width="60" height="95" rx="10" fill="%231e293b"/>
  <rect x="228" y="90" width="44" height="32" rx="4" fill="%2384cc16"/>
  <text x="250" y="112" font-family="monospace" font-weight="900" font-size="14" fill="%23000000" text-anchor="middle">104</text>
  <circle cx="250" cy="148" r="8" fill="%23475569"/>
  <text x="40" y="94" font-family="system-ui, sans-serif" font-weight="900" font-size="22" fill="%230f172a">ACCU-CHEK Active</text>
  <text x="40" y="118" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="%230284c7">Blood Glucose Monitor Kit</text>
  <text x="40" y="136" font-family="system-ui, sans-serif" font-weight="500" font-size="11" fill="%2364748b">Meter + 10 Strips + Lancing Device</text>
  <rect x="40" y="152" width="130" height="22" rx="4" fill="%23f1f5f9"/>
  <text x="48" y="167" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="%230f172a">ISO 15197:2013 Accurate</text>
</svg>`;

const SVG_TELMA_40 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <filter id="shadow11" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="%230f172a" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect x="25" y="25" width="270" height="170" rx="14" fill="%23ffffff" stroke="%23be123c" stroke-width="2" filter="url(%23shadow11)"/>
  <rect x="25" y="25" width="270" height="24" rx="14" fill="%23dc2626"/>
  <rect x="25" y="37" width="270" height="12" fill="%23dc2626"/>
  <text x="35" y="39" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="%23ffffff">SCHEDULE H PRESCRIPTION DRUG</text>
  <text x="40" y="80" font-family="system-ui, sans-serif" font-weight="800" font-size="12" fill="%23be123c">GLENMARK PHARMA</text>
  <text x="40" y="106" font-family="system-ui, sans-serif" font-weight="900" font-size="26" fill="%239f1239">TELMA 40</text>
  <text x="40" y="128" font-family="system-ui, sans-serif" font-weight="600" font-size="13" fill="%23374151">Telmisartan Tablets IP 40 mg</text>
  <text x="40" y="146" font-family="system-ui, sans-serif" font-weight="500" font-size="11" fill="%236b7280">Hypertension & Blood Pressure Control</text>
  <rect x="40" y="158" width="125" height="20" rx="4" fill="%23ffe4e6"/>
  <text x="48" y="172" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="%23be123c">Strip of 15 Tablets</text>
</svg>`;

const SVG_PAN_D = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <filter id="shadow12" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="%230f172a" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect x="25" y="25" width="270" height="170" rx="14" fill="%23ffffff" stroke="%23b91c1c" stroke-width="2" filter="url(%23shadow12)"/>
  <rect x="25" y="25" width="270" height="24" rx="14" fill="%23dc2626"/>
  <rect x="25" y="37" width="270" height="12" fill="%23dc2626"/>
  <text x="35" y="39" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="%23ffffff">SCHEDULE H PRESCRIPTION DRUG</text>
  <text x="40" y="80" font-family="system-ui, sans-serif" font-weight="800" font-size="12" fill="%23b91c1c">ALKEM LABORATORIES</text>
  <text x="40" y="106" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="%23b91c1c">PAN-D</text>
  <text x="40" y="128" font-family="system-ui, sans-serif" font-weight="600" font-size="13" fill="%23374151">Pantoprazole & Domperidone SR</text>
  <text x="40" y="146" font-family="system-ui, sans-serif" font-weight="500" font-size="11" fill="%236b7280">Fast Acidity, Gas & Reflux Relief</text>
  <rect x="40" y="158" width="130" height="20" rx="4" fill="%23fee2e2"/>
  <text x="48" y="172" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="%23b91c1c">Strip of 15 Capsules</text>
</svg>`;

const SVG_GLYCOMET = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <filter id="shadow13" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="%230f172a" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect x="25" y="25" width="270" height="170" rx="14" fill="%23ffffff" stroke="%231d4ed8" stroke-width="2" filter="url(%23shadow13)"/>
  <rect x="25" y="25" width="270" height="24" rx="14" fill="%23dc2626"/>
  <rect x="25" y="37" width="270" height="12" fill="%23dc2626"/>
  <text x="35" y="39" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="%23ffffff">SCHEDULE H PRESCRIPTION DRUG</text>
  <text x="40" y="80" font-family="system-ui, sans-serif" font-weight="800" font-size="12" fill="%231d4ed8">USV PRIVATE LTD</text>
  <text x="40" y="106" font-family="system-ui, sans-serif" font-weight="900" font-size="24" fill="%231e40af">GLYCOMET 500 SR</text>
  <text x="40" y="128" font-family="system-ui, sans-serif" font-weight="600" font-size="13" fill="%23374151">Metformin Hydrochloride IP 500mg</text>
  <text x="40" y="146" font-family="system-ui, sans-serif" font-weight="500" font-size="11" fill="%236b7280">Sustained Release Type 2 Diabetes Care</text>
  <rect x="40" y="158" width="125" height="20" rx="4" fill="%23dbeafe"/>
  <text x="48" y="172" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="%231d4ed8">Strip of 20 Tablets</text>
</svg>`;

const SVG_GELUSIL = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <filter id="shadow14" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="%230f172a" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect x="25" y="25" width="270" height="170" rx="14" fill="%23f0fdf4" stroke="%23059669" stroke-width="2" filter="url(%23shadow14)"/>
  <rect x="25" y="25" width="270" height="34" rx="14" fill="%23059669"/>
  <rect x="25" y="45" width="270" height="14" fill="%23059669"/>
  <text x="40" y="48" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="%23ffffff">PFIZER INDIA</text>
  <text x="40" y="96" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="%23047857">GELUSIL MPS</text>
  <text x="40" y="120" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="%23065f46">Antacid & Anti-Gas Liquid (200ml)</text>
  <text x="40" y="140" font-family="system-ui, sans-serif" font-weight="500" font-size="11" fill="%23047857">Refreshing Mint Flavour • Sugar Free</text>
  <rect x="40" y="154" width="130" height="22" rx="4" fill="%23d1fae5"/>
  <text x="48" y="169" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="%23065f46">Instant Acidity Relief</text>
</svg>`;

const SVG_ALLEGRA = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <filter id="shadow15" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="%230f172a" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect x="25" y="25" width="270" height="170" rx="14" fill="%23ffffff" stroke="%234338ca" stroke-width="2" filter="url(%23shadow15)"/>
  <rect x="25" y="25" width="270" height="34" rx="14" fill="%234338ca"/>
  <rect x="25" y="45" width="270" height="14" fill="%234338ca"/>
  <text x="40" y="48" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="%23ffffff">SANOFI INDIA</text>
  <text x="40" y="96" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="%233730a3">ALLEGRA 120</text>
  <text x="40" y="120" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="%23312e81">Fexofenadine Hydrochloride 120 mg</text>
  <text x="40" y="140" font-family="system-ui, sans-serif" font-weight="500" font-size="11" fill="%234338ca">Non-Drowsy 24-Hour Allergy & Pollen Relief</text>
  <rect x="40" y="154" width="130" height="22" rx="4" fill="%23e0e7ff"/>
  <text x="48" y="169" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="%233730a3">Strip of 10 Tablets</text>
</svg>`;

const SVG_LIV52 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <filter id="shadow16" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="%230f172a" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect x="25" y="25" width="270" height="170" rx="14" fill="%23f0fdf4" stroke="%2315803d" stroke-width="2" filter="url(%23shadow16)"/>
  <rect x="25" y="25" width="270" height="34" rx="14" fill="%2315803d"/>
  <rect x="25" y="45" width="270" height="14" fill="%2315803d"/>
  <text x="40" y="48" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="%23ffffff">HIMALAYA WELLNESS</text>
  <text x="40" y="96" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="%23166534">LIV.52 DS</text>
  <text x="40" y="120" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="%2314532d">Ayurvedic Hepato-Protective Formula</text>
  <text x="40" y="140" font-family="system-ui, sans-serif" font-weight="500" font-size="11" fill="%23166534">Double Strength Liver & Appetite Care</text>
  <rect x="40" y="154" width="130" height="22" rx="4" fill="%23dcfce7"/>
  <text x="48" y="169" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="%23166534">Bottle of 60 Tablets</text>
</svg>`;

/* ==========================================================================
   POPULAR CATEGORIES IN THE INDIAN PHARMACY MARKET
   ========================================================================== */
export const mockCategories = [
  {
    id: "fever-pain",
    name: "Fever & Pain Relief",
    description: "Paracetamol, Ibuprofen, headache & bodyache relief",
    icon: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    itemCount: 42,
    badge: "Top Need"
  },
  {
    id: "cough-cold",
    name: "Cough, Cold & Allergy",
    description: "Honitus, Allegra, decongestants & steam capsules",
    icon: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>`,
    itemCount: 38,
    badge: "Seasonal"
  },
  {
    id: "vitamins-immunity",
    name: "Vitamins & Immunity",
    description: "Becosules, Limcee, Zinc, Vitamin D3 & multivitamin syrups",
    icon: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`,
    itemCount: 65,
    badge: "Best Value"
  },
  {
    id: "diabetes",
    name: "Diabetes Care",
    description: "Glycomet, Accu-Chek glucometers, strips & lancets",
    icon: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="m19 12-7-9-7 9c0 3.87 3.13 7 7 7s7-3.13 7-7Z"/></svg>`,
    itemCount: 28,
    badge: "Chronic Care"
  },
  {
    id: "cardiac-bp",
    name: "Cardiac & Blood Pressure",
    description: "Telma, Atorva, blood pressure monitors (Schedule H)",
    icon: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    itemCount: 34,
    badge: "Rx Mandated"
  },
  {
    id: "stomach-digestion",
    name: "Stomach & Digestion",
    description: "Pan-D, Gelusil, Pudin Hara, Digene & gut probiotics",
    icon: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    itemCount: 30,
    badge: "Daily Care"
  },
  {
    id: "first-aid",
    name: "First Aid & Pain Sprays",
    description: "Betadine, Volini gel, Band-Aids, Dettol & cotton",
    icon: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>`,
    itemCount: 25,
    badge: "Essential"
  },
  {
    id: "ayurveda",
    name: "Ayurveda & Herbal Care",
    description: "Dabur, Himalaya, Baidyanath, Chyawanprash & Giloy",
    icon: `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
    itemCount: 45,
    badge: "Natural"
  }
];

/* ==========================================================================
   AUTHENTIC INDIAN MEDICINES CATALOG (PRICES IN INR ₹)
   Adheres strictly to docs/API_CONTRACT.md schema
   ========================================================================== */
export const mockMedicines = [
  {
    id: 1,
    name: "Dolo 650mg Tablets",
    brand: "Micro Labs",
    price: 30.50,
    originalPrice: 34.00,
    category: "Fever & Pain Relief",
    prescriptionRequired: false,
    description: "India's trusted fever and mild-to-moderate pain reliever. Contains Paracetamol IP 650mg for fast symptom relief.",
    imageUrl: SVG_DOLO_650,
    stockQuantity: 450,
    rating: 4.9,
    reviewsCount: 1420,
    dosage: "Strip of 15 Tablets",
    featured: true,
    inStock: true
  },
  {
    id: 2,
    name: "Crocin 650 Advance",
    brand: "GlaxoSmithKline (GSK)",
    price: 32.00,
    originalPrice: 36.50,
    category: "Fever & Pain Relief",
    prescriptionRequired: false,
    description: "Fast-acting fever reducer with Optizorb technology. Begins releasing medicine in as little as 5 minutes.",
    imageUrl: SVG_CROCIN_650,
    stockQuantity: 320,
    rating: 4.8,
    reviewsCount: 980,
    dosage: "Strip of 15 Tablets",
    featured: true,
    inStock: true
  },
  {
    id: 3,
    name: "Combiflam Tablets",
    brand: "Sanofi India",
    price: 42.50,
    originalPrice: 48.00,
    category: "Fever & Pain Relief",
    prescriptionRequired: false,
    description: "Dual-action combination of Ibuprofen (400mg) and Paracetamol (325mg) for relief from muscle aches, joint pain, and dental pain.",
    imageUrl: SVG_COMBIFLAM,
    stockQuantity: 280,
    rating: 4.7,
    reviewsCount: 650,
    dosage: "Strip of 20 Tablets",
    featured: true,
    inStock: true
  },
  {
    id: 4,
    name: "Augmentin 625 Duo Tablets",
    brand: "GlaxoSmithKline (GSK)",
    price: 201.00,
    originalPrice: 223.50,
    category: "Cough, Cold & Allergy",
    prescriptionRequired: true,
    isScheduleH1: true,
    description: "Broad-spectrum antibacterial medication containing Amoxycillin (500mg) + Clavulanic Acid (125mg). Valid doctor prescription required.",
    imageUrl: SVG_AUGMENTIN,
    stockQuantity: 110,
    rating: 4.9,
    reviewsCount: 380,
    dosage: "Strip of 10 Tablets (Schedule H1)",
    featured: false,
    inStock: true
  },
  {
    id: 5,
    name: "Becosules Z Capsules",
    brand: "Pfizer India",
    price: 45.00,
    originalPrice: 52.00,
    category: "Vitamins & Immunity",
    prescriptionRequired: false,
    description: "Comprehensive Vitamin B-Complex forte enriched with Vitamin C and elemental Zinc to boost daily energy and fight mouth ulcers.",
    imageUrl: SVG_BECOSULES,
    stockQuantity: 500,
    rating: 4.9,
    reviewsCount: 1850,
    dosage: "Strip of 20 Capsules",
    featured: true,
    inStock: true
  },
  {
    id: 6,
    name: "Limcee 500mg Chewable Tablets",
    brand: "Abbott Healthcare",
    price: 24.50,
    originalPrice: 28.00,
    category: "Vitamins & Immunity",
    prescriptionRequired: false,
    description: "Daily immunity booster with Vitamin C (Ascorbic Acid 500mg) in a delicious tangy orange chewable tablet.",
    imageUrl: SVG_LIMCEE,
    stockQuantity: 620,
    rating: 4.8,
    reviewsCount: 1240,
    dosage: "Strip of 15 Chewable Tablets",
    featured: true,
    inStock: true
  },
  {
    id: 7,
    name: "Volini Pain Relief Gel",
    brand: "Sun Pharma",
    price: 135.00,
    originalPrice: 150.00,
    category: "First Aid & Pain Sprays",
    prescriptionRequired: false,
    description: "India's No. 1 pain relief gel scientifically formulated with micro-particles for deep penetration against backache, neck pain & sprains.",
    imageUrl: SVG_VOLINI,
    stockQuantity: 310,
    rating: 4.8,
    reviewsCount: 890,
    dosage: "75g Tube",
    featured: true,
    inStock: true
  },
  {
    id: 8,
    name: "Betadine 10% Antiseptic Ointment",
    brand: "Win-Medicare",
    price: 110.00,
    originalPrice: 125.00,
    category: "First Aid & Pain Sprays",
    prescriptionRequired: false,
    description: "Povidone-Iodine IP 10% w/w water-soluble microbicidal ointment for prevention and treatment of skin infections in minor cuts and burns.",
    imageUrl: SVG_BETADINE,
    stockQuantity: 215,
    rating: 4.9,
    reviewsCount: 710,
    dosage: "20g Tube",
    featured: false,
    inStock: true
  },
  {
    id: 9,
    name: "Dabur Honitus Herbal Cough Syrup",
    brand: "Dabur India",
    price: 105.00,
    originalPrice: 118.00,
    category: "Ayurveda & Herbal Care",
    prescriptionRequired: false,
    isAyurvedic: true,
    description: "100% Ayurvedic, non-drowsy cough syrup clinically proven to provide relief from throat irritation and dry cough with Tulsi and Honey.",
    imageUrl: SVG_HONITUS,
    stockQuantity: 240,
    rating: 4.7,
    reviewsCount: 920,
    dosage: "100ml Bottle (100% Ayurvedic)",
    featured: true,
    inStock: true
  },
  {
    id: 10,
    name: "Accu-Chek Active Blood Glucose Monitor Kit",
    brand: "Roche Diabetes Care India",
    price: 1399.00,
    originalPrice: 1599.00,
    category: "Diabetes Care",
    prescriptionRequired: false,
    description: "Accurate, hassle-free wireless blood sugar monitoring device kit with 10 test strips, painless Softclix lancing device, and lifetime warranty.",
    imageUrl: SVG_ACCUCHEK,
    stockQuantity: 75,
    rating: 4.9,
    reviewsCount: 1640,
    dosage: "Starter Kit + 10 Free Strips",
    featured: true,
    inStock: true
  },
  {
    id: 11,
    name: "Telma 40mg Tablets",
    brand: "Glenmark Pharmaceuticals",
    price: 215.00,
    originalPrice: 242.00,
    category: "Cardiac & Blood Pressure",
    prescriptionRequired: true,
    isScheduleH: true,
    description: "Telmisartan IP 40mg prescribed for essential hypertension and long-term cardiovascular health. Schedule H prescription drug.",
    imageUrl: SVG_TELMA_40,
    stockQuantity: 190,
    rating: 4.8,
    reviewsCount: 410,
    dosage: "Strip of 15 Tablets (Schedule H)",
    featured: false,
    inStock: true
  },
  {
    id: 12,
    name: "Pan-D Capsules",
    brand: "Alkem Laboratories",
    price: 185.00,
    originalPrice: 210.00,
    category: "Stomach & Digestion",
    prescriptionRequired: true,
    isScheduleH: true,
    description: "Pantoprazole (40mg) and Domperidone (30mg) sustained-release formulation for gastroesophageal reflux (GERD) and severe acidity.",
    imageUrl: SVG_PAN_D,
    stockQuantity: 260,
    rating: 4.8,
    reviewsCount: 880,
    dosage: "Strip of 15 Capsules (Schedule H)",
    featured: true,
    inStock: true
  },
  {
    id: 13,
    name: "Glycomet 500mg SR Tablets",
    brand: "USV Private Ltd",
    price: 44.00,
    originalPrice: 50.00,
    category: "Diabetes Care",
    prescriptionRequired: true,
    isScheduleH: true,
    description: "Metformin Hydrochloride IP 500mg sustained release for blood glucose management in type 2 diabetes. Schedule H prescription drug.",
    imageUrl: SVG_GLYCOMET,
    stockQuantity: 340,
    rating: 4.7,
    reviewsCount: 520,
    dosage: "Strip of 20 Tablets (Schedule H)",
    featured: false,
    inStock: true
  },
  {
    id: 14,
    name: "Gelusil MPS Antacid Liquid",
    brand: "Pfizer India",
    price: 125.00,
    originalPrice: 140.00,
    category: "Stomach & Digestion",
    prescriptionRequired: false,
    description: "Trusted antacid liquid with Aluminium Hydroxide + Magnesium Hydroxide in delicious mint flavour. Sugar-free and safe for diabetics.",
    imageUrl: SVG_GELUSIL,
    stockQuantity: 280,
    rating: 4.7,
    reviewsCount: 670,
    dosage: "200ml Bottle (Mint, Sugar-Free)",
    featured: true,
    inStock: true
  },
  {
    id: 15,
    name: "Allegra 120mg Tablets",
    brand: "Sanofi India",
    price: 198.00,
    originalPrice: 220.00,
    category: "Cough, Cold & Allergy",
    prescriptionRequired: false,
    description: "Fexofenadine HCl 120mg non-drowsy 24-hour antihistamine providing rapid relief from seasonal allergies, sneezing, and runny nose.",
    imageUrl: SVG_ALLEGRA,
    stockQuantity: 175,
    rating: 4.8,
    reviewsCount: 490,
    dosage: "Strip of 10 Tablets",
    featured: false,
    inStock: true
  },
  {
    id: 16,
    name: "Himalaya Liv.52 DS Tablets",
    brand: "Himalaya Wellness",
    price: 170.00,
    originalPrice: 190.00,
    category: "Ayurveda & Herbal Care",
    prescriptionRequired: false,
    isAyurvedic: true,
    description: "Double strength Ayurvedic hepatoprotective formulation supporting optimal liver function, metabolic efficiency, and healthy appetite.",
    imageUrl: SVG_LIV52,
    stockQuantity: 310,
    rating: 4.9,
    reviewsCount: 1120,
    dosage: "Bottle of 60 Tablets (Ayurvedic)",
    featured: true,
    inStock: true
  }
];

/* ==========================================================================
   TRUST VALUE PROPOSITIONS TAILORED FOR INDIAN HEALTHCARE
   ========================================================================== */
export const mockTrustFeatures = [
  {
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    title: "100% Genuine Indian Pharma",
    description: "Sourced directly from authorized distributors of Micro Labs, GSK, Sun Pharma, Cipla & Abbott."
  },
  {
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`,
    title: "Express Delivery (25,000+ PIN Codes)",
    description: "Fast doorstep delivery across Mumbai, Delhi-NCR, Bengaluru, Pune, Hyderabad, and tier 2/3 towns."
  },
  {
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    title: "PCI Registered Pharmacists",
    description: "Every Schedule H & H1 prescription is verified by Pharmacy Council of India certified pharmacists."
  },
  {
    icon: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
    title: "UPI, RuPay & Cash on Delivery",
    description: "Pay securely via Google Pay, PhonePe, Paytm, RuPay cards, NetBanking, or COD at doorstep."
  }
];

/* ==========================================================================
   INDIAN DOCTOR & PATIENT TESTIMONIALS
   ========================================================================== */
export const mockTestimonials = [
  {
    id: 1,
    name: "Dr. Rajesh Kulkarni",
    role: "MBBS, MD (General Physician, Pune)",
    comment: "As a practicing physician, I frequently recommend MediCare Plus to my patients. Their strict adherence to Schedule H prescription verification and cold-chain medicine storage is commendable.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Verified Patient, Bengaluru",
    comment: "Ordered Dolo 650 and Becosules at 11 PM and it arrived in 40 minutes! Ordering monthly chronic medicines for my parents with UPI payment has been completely seamless.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "Regular Customer, Ahmedabad",
    comment: "The prescription upload feature is very straightforward. Pharmacist verified my father's Telma and Glycomet within 10 minutes and offered genuine discounts over local chemist prices.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  }
];

/* ==========================================================================
   INDIAN PHARMACEUTICAL & REGULATORY FAQS
   ========================================================================== */
export const mockFaqs = [
  {
    question: "How do I order medicines that require a doctor's prescription (Schedule H / H1)?",
    answer: "As per the Drugs & Cosmetics Act and Pharmacy Council of India guidelines, medicines marked with 'Schedule H' or 'Rx Required' require a valid prescription from a Registered Medical Practitioner (RMP). You can upload a photo or PDF scan of your prescription using the 'Upload Rx' button. Our registered pharmacist reviews and validates it before dispensing."
  },
  {
    question: "Are these authentic branded medicines manufactured in India?",
    answer: "Yes, 100%. We source medicines directly from certified pharmaceutical companies and authorized C&F distributors including Micro Labs, GSK, Sun Pharma, Abbott, Alkem, and Cipla. All medicines feature verifiable batch numbers, manufacturing dates, and holograms."
  },
  {
    question: "What payment modes are supported? Is Cash on Delivery (COD) available?",
    answer: "We support all major Indian payment gateways: UPI (Google Pay, PhonePe, Paytm, BHIM), RuPay and Visa/Mastercard credit/debit cards, Net Banking across all nationalized and private banks, and Cash on Delivery (COD) across 25,000+ PIN codes."
  },
  {
    question: "What is your delivery timeframe and free delivery threshold in India?",
    answer: "Orders above ₹499 qualify for Free Standard Delivery across India. Express 30 to 90 minute delivery is available in major metro cities (Mumbai, Delhi-NCR, Bengaluru, Pune, Hyderabad, Chennai, Kolkata)."
  }
];
