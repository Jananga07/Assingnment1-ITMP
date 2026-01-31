
const { test, expect } = require('@playwright/test');

test.describe('SwiftTranslator Singlish → Sinhala', () => {

  const baseURL = 'https://www.swifttranslator.com/'; 


  async function convertInput(page, inputText) {
    await page.goto(baseURL);

    // Fill the Singlish input box
    await page.fill(
      'textarea[placeholder="Input Your Singlish Text Here."]',
      inputText
    );

    // Wait for output div to appear and have text
    const outputLocator = page.locator('div.whitespace-pre-wrap.overflow-y-auto.bg-slate-50');
    await outputLocator.waitFor({ state: 'visible', timeout: 5000 });
    await expect(outputLocator).not.toHaveText('', { timeout: 5000 });

    // Get the Sinhala text
    const actual = await outputLocator.textContent();
    return actual.trim();
  }

  //Positive Functional (24 cases) 
  const positiveCases = [
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
  ];

  for (const tc of positiveCases) {
    test(`${tc.id} Positive Functional`, async ({ page }) => {
      const actual = await convertInput(page, tc.input);
      expect(actual).toBe(tc.expected);
    });
  }

const negativeCases = [
  { id: 'Neg_Fun_0001', input: 'mamagedharaawa', expected: 'මම ගෙදර යනවා' }, // empty input
  { id: 'Neg_Fun_0002', input: 'matapanabonnona', expected: 'මට පාන බොන්න ඕනේ' }, // gibberish
  { id: 'Neg_Fun_0003', input: 'hetapiyy', expected: 'හෙට අපි යනවා' }, // typo
  { id: 'Neg_Fun_0004', input: 'oyaaenndvadha?', expected: 'ඔයා එනවද?' }, // extra chars
  { id: 'Neg_Fun_0005', input: 'elamachan!!!supiriii', expected: 'එල මචං සුපිරි' },
  { id: 'Neg_Fun_0006', input: 'ad0000 vaedak karapan', expected: 'අඩෝ වැඩක් කරපන්' },
  { id: 'Neg_Fun_0007', input: 'dhaen api vaeda !! office personal prashna', expected: 'දැන් අපි වැඩ කරපු කාලය අතර office සහ personal ප්‍රශ්න ගොඩක් තිබුණ නිසා අපි decision එකකට එන්න බැරි උනා' },
  { id: 'Neg_Fun_0008', input: 'mama yanna\n\noya?', expected: 'මම ගෙදර යනවා.\n\nඔයා එන්නේ කවද්ද?' },
  { id: 'Neg_Fun_0009', input: 'WhatsApp link ekak Teams meeting ekata', expected: 'Teams meeting එකේ URL එක WhatsApp කරලා එවන්න' },
  { id: 'Neg_Fun_0010', input: 'QR payment scan ekak', expected: 'QR code එක scan කරලා payment එක complete කරන්න' },
];

for (const tc of negativeCases) {
  test(`${tc.id} Negative Functional (Incorrect Inputs)`, async ({ page }) => {
    const actual = await convertInput(page, tc.input);
    console.log(`TC ID: ${tc.id} | Input: "${tc.input}" | Output: "${actual}"`);
    await page.screenshot({ path: `screenshots/${tc.id}.png` });

    // Output exists
    expect(actual.length).toBeGreaterThan(0);

    // Output contains Sinhala characters
    expect(actual).toMatch(/[\u0D80-\u0DFF]/);

    // Negative case: ensure it does NOT match the expected "correct" value
    expect(actual).not.toBe(tc.expected); 
  });
}


  test('Pos_UI_0001 Real-time Sinhala output updates while typing', async ({ page }) => {
    const input = 'mama gedhara yanavaa';
    await page.goto(baseURL);

    // Fill input
    await page.fill(
      'textarea[placeholder="Input Your Singlish Text Here."]',
      input
    );

    // Wait for output to update dynamically
    const outputLocator = page.locator('div.whitespace-pre-wrap.overflow-y-auto.bg-slate-50');
    await outputLocator.waitFor({ state: 'visible', timeout: 5000 });
    await expect(outputLocator).not.toHaveText('', { timeout: 5000 });

    const output = await outputLocator.textContent();

    // Expected value is correct Sinhala
    expect(output.trim()).toBe('මම ගෙදර යනවා');
  });

});