const xlsx = require('xlsx');

function readHeaders(filename) {
  try {
    const workbook = xlsx.readFile(`./prisma/${filename}`);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, {header: 1});
    console.log(`\n--- ${filename.toUpperCase()} HEADER ---`);
    console.log(rows[0]);
    console.log(`--- ${filename.toUpperCase()} ROW 1 ---`);
    console.log(rows[1]);
  } catch (e) {
    console.error(`Error reading ${filename}`, e.message);
  }
}

readHeaders('baseline.xlsx');
