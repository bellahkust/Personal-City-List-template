const parseRow = (line) => {
  const cells = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const next = line[index + 1];
    if (character === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      cells.push(cell);
      cell = '';
    } else {
      cell += character;
    }
  }

  cells.push(cell);
  return cells;
};

export const parsePlacesCsv = (csv) => {
  const rows = csv.replace(/^\uFEFF/, '').split(/\r?\n/).filter((row) => row.trim());
  if (rows.length < 2) return [];

  const headers = parseRow(rows[0]).map((header) => header.trim());
  return rows.slice(1).map((row) => {
    const values = parseRow(row);
    const record = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
    return {
      category: record.category,
      title: record.title,
      titleZh: record.title_zh,
      titleEn: record.title_en,
      area: record.area,
      rating: record.rating ? Number(record.rating) : null,
      note: record.note,
      url: record.url,
    };
  }).filter((place) => place.category && place.title && place.url);
};
