export const fetchAnalyticsData = async (supabase) => {
  const { data, error } = await supabase
    .from('predictions')
    .select('*');
    
  if (error) throw error;
  
  if (!data || data.length === 0) {
    return {
      totalPredictions: 0,
      avgPrice: 0,
      highestPrice: 0,
      lowestPrice: 0,
      priceHistory: [],
      bhkDistribution: [],
      facingDistribution: []
    };
  }
  
  const totalPredictions = data.length;
  const prices = data.map(p => Number(p.predicted_price));
  const avgPrice = prices.reduce((a, b) => a + b, 0) / totalPredictions;
  const highestPrice = Math.max(...prices);
  const lowestPrice = Math.min(...prices);
  
  // Predict history (sorted by date)
  const priceHistory = [...data]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map(p => ({
      date: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Number(p.predicted_price) / 100000 // In Lakhs
    }));
    
  // BHK distribution
  const bhkCounts = data.reduce((acc, p) => {
    const bhk = p.input_features.Bedrooms;
    acc[bhk] = (acc[bhk] || 0) + 1;
    return acc;
  }, {});
  
  const bhkDistribution = Object.entries(bhkCounts).map(([bhk, count]) => ({
    name: `${bhk} BHK`,
    value: count
  }));
  
  // Facing distribution
  const facingCounts = data.reduce((acc, p) => {
    const facing = p.input_features.Facing;
    acc[facing] = (acc[facing] || 0) + 1;
    return acc;
  }, {});
  
  const facingDistribution = Object.entries(facingCounts).map(([facing, count]) => ({
    name: facing,
    value: count
  }));

  return {
    totalPredictions,
    avgPrice,
    highestPrice,
    lowestPrice,
    priceHistory,
    bhkDistribution,
    facingDistribution
  };
};
