const categoryLabels = Object.freeze({
  food: ['食餐好嘢', 'Eat Well'],
  drinks: ['飲杯先講', 'Drink Well'],
  alone: ['發下吽豆', 'Stay Alone'],
});

export const matchesHongKongCategory = (value, key) =>
  (categoryLabels[key] ?? []).includes(String(value ?? '').trim());
