function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

function filterCollegesByLocationAndBudget(colleges, options = {}) {
  const { userLat, userLng, maxDistanceKm, maxBudget, typeFilter } = options;

  return colleges
    .map(college => {
      let distance = null;
      if (userLat && userLng && college.latitude && college.longitude) {
        distance = calculateDistanceKm(userLat, userLng, college.latitude, college.longitude);
      }
      return { ...college, distanceKm: distance };
    })
    .filter(college => {
      if (maxDistanceKm && !isNaN(maxDistanceKm) && college.distanceKm !== null && college.distanceKm > maxDistanceKm) return false;
      if (maxBudget && !isNaN(maxBudget) && college.tuition_min > maxBudget) return false;
      if (typeFilter && typeFilter !== 'All' && college.type !== typeFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.distanceKm !== null && b.distanceKm !== null) return a.distanceKm - b.distanceKm;
      return a.ranking - b.ranking;
    });
}

module.exports = { calculateDistanceKm, filterCollegesByLocationAndBudget };
