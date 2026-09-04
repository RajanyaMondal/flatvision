export const fetchPredictions = async (supabase) => {
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const fetchPredictionById = async (supabase, id) => {
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data;
};

export const savePrediction = async (supabase, prediction) => {
  const { data, error } = await supabase
    .from('predictions')
    .insert([prediction])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const deletePrediction = async (supabase, id) => {
  const { error } = await supabase
    .from('predictions')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  return true;
};
