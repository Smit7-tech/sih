import { useState, useEffect } from 'react';
import { supabase, FoodItem } from '../lib/supabase';

export function useFoodDatabase() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        setError(error.message);
      } else {
        setFoodItems(data || []);
      }
    } catch (err) {
      setError('Failed to fetch food items');
    } finally {
      setLoading(false);
    }
  };

  const addFoodItem = async (foodItem: Omit<FoodItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .insert(foodItem)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setFoodItems(prev => [...prev, data]);
      return { data, error: null };
    } catch (err) {
      const error = err as Error;
      return { data: null, error: error.message };
    }
  };

  const updateFoodItem = async (id: string, updates: Partial<FoodItem>) => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setFoodItems(prev => prev.map(item => item.id === id ? data : item));
      return { data, error: null };
    } catch (err) {
      const error = err as Error;
      return { data: null, error: error.message };
    }
  };

  const deleteFoodItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('food_items')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setFoodItems(prev => prev.filter(item => item.id !== id));
      return { error: null };
    } catch (err) {
      const error = err as Error;
      return { error: error.message };
    }
  };

  const searchFoodItems = (query: string, category?: string, doshaEffect?: string) => {
    return foodItems.filter(item => {
      const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !category || category === 'All' || item.category === category;
      const matchesDosha = !doshaEffect || doshaEffect === 'All' || item.dosha_effect === doshaEffect;
      
      return matchesQuery && matchesCategory && matchesDosha;
    });
  };

  return {
    foodItems,
    loading,
    error,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    searchFoodItems,
    refetch: fetchFoodItems,
  };
}