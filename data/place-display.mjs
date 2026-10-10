const hasChinese = (value) => /[\u3400-\u9fff]/u.test(value ?? '');

export const getPlaceTitleParts = ({ title = '', titleZh = '', titleEn = '' }) => {
  const chinese = titleZh || (hasChinese(title) ? title : '');
  const english = titleEn || (!hasChinese(title) ? title : '');

  if (chinese && english) return { primary: chinese, secondary: english };
  return { primary: title || chinese || english, secondary: '' };
};

export const getPlaceRatingPresentation = (rating) => {
  const numericRating = Number(rating);
  if (!Number.isFinite(numericRating) || numericRating <= 0 || numericRating > 5) {
    return { value: null, stars: '☆☆☆☆☆', label: '尚未评分' };
  }
  const wholeStars = Math.floor(numericRating);
  const emptyStars = 5 - wholeStars;
  return {
    value: numericRating,
    stars: '★'.repeat(wholeStars) + '☆'.repeat(emptyStars),
    label: '',
  };
};
