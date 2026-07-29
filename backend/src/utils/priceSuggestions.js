const PRICE_SUGGESTIONS = {
  "Cover Art": {
    core: 25,
    signature: 35,
    premium: 55,
  },

  Banner: {
    core: 15,
    signature: 20,
    premium: 35,
  },

  Flyer: {
    core: 20,
    signature: 30,
    premium: 45,
  },

  Animación: {
    core: 40,
    signature: 70,
    premium: 100,
  },
};

function getSuggestedPrice(categoryName, artworkLevel) {
  if (!categoryName || !artworkLevel) return null;

  return (
    PRICE_SUGGESTIONS[categoryName]?.[artworkLevel.toLowerCase()] ?? null
  );
}

module.exports = {
  PRICE_SUGGESTIONS,
  getSuggestedPrice,
};