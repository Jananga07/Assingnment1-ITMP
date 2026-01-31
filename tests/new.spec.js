const { test, expect } = require('@playwright/test');

test.describe('SwiftTranslator Singlish → Sinhala (from Excel) - V3', () => {
  const baseURL = 'https://www.swifttranslator.com/';

  function normalizeSinhala(input) {
    if (input === null || input === undefined) return '';
    let s = String(input);

    
    s = s.normalize('NFC').replace(/[\u200B-\u200D\uFEFF]/g, '');

    
    s = s.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    
    s = s.replace(/[\t\f\v ]+/g, ' ');
    s = s.replace(/ *\n */g, '\n');
    s = s.replace(/\n{3,}/g, '\n\n');

   
    s = s
      .replace(/ \./g, '.')
      .replace(/ \?/g, '?')
      .replace(/ \!/g, '!')
      .replace(/ ,/g, ',')
      .replace(/ ;/g, ';')
      .replace(/ :/g, ':');

    // Normalize number + 'ක්'
    s = s.replace(/(\d)\s*ක්/g, '$1ක්');

    // Lowercase latin letters to avoid Zoom/zoom etc.
    s = s.replace(/[A-Z]/g, (c) => c.toLowerCase());

    // Trim and remove trailing sentence punctuation
    s = s.trim().replace(/[.!?]+$/g, '');

    // Canonicalize some common Sinhala variants
    s = s
      .replace(/පුලුවන්ද/g, 'පුළුවන්ද')
      .replace(/පුලුවන්/g, 'පුළුවන්')
      .replace(/පුලුවන/g, 'පුළුවන')
      .replace(/ඔයාගෙ/g, 'ඔයාගේ')
      .replace(/ඔයාලගෙ/g, 'ඔයාලගේ')
      .replace(/ඊයෙ/g, 'ඊයේ')
      .replace(/හොද/g, 'හොඳ')
      .replace(/\bනෑ\b/g, 'නැහැ')
      .replace(/\bනැ\b/g, 'නැහැ');

    // Final collapse spaces
    s = s.replace(/[ ]{2,}/g, ' ').trim();

    return s;
  }

  async function waitForStableText(locator, timeoutMs = 15000, stableMs = 500) {
    const start = Date.now();
    let last = null;
    let lastChange = Date.now();

    while (Date.now() - start < timeoutMs) {
      const t = (await locator.textContent()) ?? '';
      const cur = t.trim();

      if (cur !== last) {
        last = cur;
        lastChange = Date.now();
      } else {
        if (cur && Date.now() - lastChange >= stableMs) return cur;
      }

      await locator.page().waitForTimeout(120);
    }

    return ((await locator.textContent()) ?? '').trim();
  }

  async function convertInput(page, inputText) {
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

    const inputLocator = page.locator('textarea[placeholder="Input Your Singlish Text Here."]');
    await inputLocator.waitFor({ state: 'visible', timeout: 15000 });

    await inputLocator.fill('');
    await inputLocator.fill(inputText);

    const outputLocator = page.locator('div.whitespace-pre-wrap.overflow-y-auto.bg-slate-50');
    await outputLocator.waitFor({ state: 'visible', timeout: 15000 });

    await expect(outputLocator).not.toHaveText('', { timeout: 15000 });

    const stableRaw = await waitForStableText(outputLocator, 15000, 500);
    return stableRaw;
  }

  //  Total 35: Pos 24 + Neg 10 + UI Pos 1
  const cases = [
    //  POS 24 
    { id: 'Pos_Fun_0001', input: 'mama gedhara yanavaa', expected: 'මම ගෙදර යනවා' },
    { id: 'Pos_Fun_0002', input: 'api kaeema kanna yanavaa saha passe chithrapatayak balamu', expected: 'අපි කෑම කන්න යනවා සහ පස්සෙ චිත්‍රපටයක් බලමු' },
    { id: 'Pos_Fun_0003', input: 'oya envaa nam mama balan innavaa', expected: 'ඔය එන්වා නම් මම බලන් ඉන්නවා' },
    { id: 'Pos_Fun_0004', input: 'oyaa kavadhdha enne?', expected: 'ඔයා කවද්ද එන්නෙ?' },
    { id: 'Pos_Fun_0005', input: 'issarahata yanna', expected: 'ඉස්සරහට යන්න' },
    { id: 'Pos_Fun_0006', input: 'mama ehema karanne naehae', expected: 'මම එහෙම කරන්නේ නැහැ' },
    { id: 'Pos_Fun_0007', input: 'karuNaakaralaa mata podi udhavvak karanna puLuvandha?', expected: 'කරුණාකරලා මට පොඩි උදව්වක් කරන්න පුළුවන්ද?' },
    { id: 'Pos_Fun_0008', input: 'ehema karapan', expected: 'එහෙම කරපන්' },
    { id: 'Pos_Fun_0009', input: 'mama iyee gedhara giyaa', expected: 'මම ඉයේ ගෙදර ගියා' },
    { id: 'Pos_Fun_0010', input: 'api heta gedhara yamu', expected: 'අපි හෙට ගෙදර යමු' },
    { id: 'Pos_Fun_0011', input: 'hari hari lassanayi', expected: 'හරි හරි ලස්සනයි' },
    { id: 'Pos_Fun_0012', input: 'Zoom meeting ekak thiyennee heta', expected: 'Zoom meeting එකක් තියෙන්නේ හෙට' },
    { id: 'Pos_Fun_0013', input: 'aayuboovan!', expected: 'ආයුබෝවන්!' },
    { id: 'Pos_Fun_0014', input: 'mata nidhimathayi', expected: 'මට නිදිමතයි' },
    { id: 'Pos_Fun_0015', input: 'puluvannam mata eeka evanna', expected: 'පුලුවන්නම් මට ඒක එවන්න' },
    { id: 'Pos_Fun_0016', input: 'oyaalaa enavadha?', expected: 'ඔයාලා එනවද?' },
    { id: 'Pos_Fun_0017', input: 'api Kandy valata yamu', expected: 'අපි Kandy වලට යමු' },
    { id: 'Pos_Fun_0018', input: 'mata OTP eka evanna', expected: 'මට OTP එක එවන්න' },
    { id: 'Pos_Fun_0019', input: 'meeka hariyata vaeda karanavaadha?', expected: 'මේක හරියට වැඩ කරනවාද?' },
    { id: 'Pos_Fun_0020', input: 'Rs. 5343 gannavaa', expected: 'Rs. 5343 ගන්නවා' },
    { id: 'Pos_Fun_0021', input: '7.30 AM ta meeting ekak thiyenavaa', expected: '7.30 AM ට meeting එකක් තියෙනවා' },
    { id: 'Pos_Fun_0022', input: 'milk ml 500 ganna', expected: 'milk ml 500 ගන්න' },
    { id: 'Pos_Fun_0023', input: 'mama gedhara yanavaaoyaa enavadha?', expected: 'මම ගෙදර යනවාඔයා එනවද?' },
    { id: 'Pos_Fun_0024', input: 'ela machan api passe kathaa karamu', expected: 'එල මචන් අපි පස්සෙ කතා කරමු' },
    
    //Negative Functional 10 
  { id: 'Neg_Fun_0001', input: 'hetaapiyana aa...', expected: 'හෙටාපියනවා' }, // empty input
  { id: 'Neg_Fun_0002', input: 'mama office yanna kalin check karanna oonee the document status and approval flow...', expected: ' මම office යන්න කලින් check කරන්න ඕනේ තෙ document status and approval ෆ්ලොරන්සw' }, // gibberish
  { id: 'Neg_Fun_0003', input: 'mama iiyee office giyaa saha adha dhaen vaeda karanavaa namuth heta vacation ganna inne', expected: ' මම ඊයේ office ගියා සහ අද දැන් වැඩ කරනවා නමුත් හෙට vacation ගන්න ඉන්නෙන්' }, // typo
  { id: 'Neg_Fun_0004', input: ' hari hari hari lassanai!', expected: 'හරි හරි හරි හරි ලස්සනෛ' }, // extra chars
  { id: 'Neg_Fun_0005', input: 'oyaa enne!!! ,mama balagena inne??', expected: 'ඔයා එන්නෙ!!! මම බලගෙන ඉන්නේ??' },
  { id: 'Neg_Fun_0006', input: 'mama gedharayanavaa', expected: 'මම ගෙදර යනවා' },
  { id: 'Neg_Fun_0007', input: ' mata items 10 20 30 ganna,, oonee', expected: ' මට items 10 20 30 ගන්න ඕනේ' },
  { id: 'Neg_Fun_0008', input: ' ado machan ela kir,i wadak wenne nae bn', expected: ' ado මචන් එල කිරි wඅඩක් wඑන්නෙ නැ බ්න්' },
  { id: 'Neg_Fun_0009', input: ' mama heta enne n434a', expected: '  මම හෙට එන්නෙ න' },
  { id: 'Neg_Fun_0010', input: 'QR payment scan ekak', expected: 'QR code එක scan කරලා payment එක complete කරන්න' },

    //  UI POS 1 
    { id: 'Pos_UI_0035', input: 'Mama pansal yanavaa. ', expected: 'Sinhala output should update automatically while typing and display: මම පන්සල් යනවා. ' }
  ];

  for (const tc of cases) {
    if (tc.id.startsWith('Pos_UI_')) {
      test(`${tc.id} UI - realtime output updates`, async ({ page }) => {
        await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

        const inputLocator = page.locator('textarea[placeholder="Input Your Singlish Text Here."]');
        await inputLocator.waitFor({ state: 'visible', timeout: 15000 });

        await inputLocator.fill('');
        await inputLocator.type(tc.input, { delay: 40 });

        const outputLocator = page.locator('div.whitespace-pre-wrap.overflow-y-auto.bg-slate-50');
        await outputLocator.waitFor({ state: 'visible', timeout: 15000 });

        await expect(outputLocator).not.toHaveText('', { timeout: 15000 });
        const stableRaw = await waitForStableText(outputLocator, 15000, 500);

        const actual = normalizeSinhala(stableRaw);

        const m = String(tc.expected).match(/display\s*:\s*(.*)$/i);
        const expectedSinhala = normalizeSinhala(m ? m[1] : tc.expected);

        expect(actual).toBe(expectedSinhala);
      });

      continue;
    }

    test(`${tc.id} ${tc.id.startsWith('Pos_') ? 'Positive' : 'Negative'} Functional`, async ({ page }) => {
      const actualRaw = await convertInput(page, tc.input);
      const actual = normalizeSinhala(actualRaw);
      const expected = normalizeSinhala(tc.expected);

      try {
        
        expect(actual).toBe(expected);
      } catch (e) {
        console.log(`\n[${tc.id}] INPUT   : ${tc.input}`);
        console.log(`[${tc.id}] EXPECTED: ${tc.expected}`);
        console.log(`[${tc.id}] ACTUAL  : ${actualRaw}`);
        throw e;
      }
    });
  }
   
});