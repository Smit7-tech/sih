/*
  # Seed Initial Data

  1. Sample Food Items
    - Common Indian foods with Ayurvedic properties
    - Categorized by food groups
    - Complete nutritional and Ayurvedic data

  2. Sample Data
    - No user-specific data (will be created through app)
    - Focus on food database population
*/

-- Insert sample food items
INSERT INTO food_items (name, category, calories, protein, carbs, fat, fiber, dosha_effect, rasa, virya, vipaka, properties, ayurvedic_note) VALUES
-- Grains
('Basmati Rice', 'Grains', 345, 7.1, 78, 0.6, 1.8, 'Tridoshic', 'Sweet', 'Cooling', 'Sweet', ARRAY['Easy to digest', 'Nourishing', 'Calming'], 'Excellent for Pitta constitution, balances all doshas when prepared properly'),
('Quinoa', 'Grains', 368, 14.1, 64.2, 6.1, 7, 'Vata+', 'Sweet, Astringent', 'Heating', 'Sweet', ARRAY['Complete protein', 'Strengthening', 'Nourishing'], 'Good for Vata, may increase Pitta if consumed in excess'),
('Brown Rice', 'Grains', 370, 7.9, 77.2, 2.9, 3.5, 'Tridoshic', 'Sweet', 'Neutral', 'Sweet', ARRAY['Fiber rich', 'Grounding', 'Nourishing'], 'More nutritious than white rice, good for all doshas'),
('Wheat Flour', 'Grains', 364, 10.3, 76.3, 1.5, 2.7, 'Kapha+', 'Sweet', 'Cooling', 'Sweet', ARRAY['Heavy', 'Nourishing', 'Building'], 'Can increase Kapha, best consumed in moderation'),

-- Legumes
('Moong Dal', 'Legumes', 347, 24.5, 59.0, 1.2, 16.3, 'Tridoshic', 'Sweet, Astringent', 'Cooling', 'Sweet', ARRAY['Easy to digest', 'Detoxifying', 'Light'], 'Best dal for all doshas, especially good for detox'),
('Chana Dal', 'Legumes', 372, 22.5, 57.2, 4.5, 12.8, 'Vata+', 'Sweet, Astringent', 'Heating', 'Sweet', ARRAY['Protein rich', 'Strengthening', 'Heavy'], 'Good for Vata, may increase Pitta and Kapha'),
('Masoor Dal', 'Legumes', 352, 25.8, 60.1, 1.1, 11.5, 'Pitta+', 'Sweet, Astringent', 'Heating', 'Sweet', ARRAY['Quick cooking', 'Light', 'Cleansing'], 'Good for Kapha, may increase Pitta'),
('Rajma', 'Legumes', 333, 22.5, 60.3, 1.4, 15.2, 'Vata+', 'Sweet, Astringent', 'Heating', 'Sweet', ARRAY['Protein rich', 'Heavy', 'Nourishing'], 'Nourishing for Vata, heavy for Kapha'),

-- Vegetables
('Spinach', 'Vegetables', 23, 2.9, 3.6, 0.4, 2.2, 'Pitta+', 'Sweet, Astringent', 'Cooling', 'Sweet', ARRAY['Blood building', 'Cooling', 'Detoxifying'], 'Excellent for Pitta, may increase Vata in excess'),
('Carrots', 'Vegetables', 41, 0.9, 9.6, 0.2, 2.8, 'Vata+', 'Sweet', 'Heating', 'Sweet', ARRAY['Eye health', 'Grounding', 'Sweet'], 'Good for Vata, sweet and nourishing'),
('Bottle Gourd', 'Vegetables', 14, 0.6, 3.4, 0.0, 0.5, 'Tridoshic', 'Sweet', 'Cooling', 'Sweet', ARRAY['Cooling', 'Light', 'Easy to digest'], 'Excellent for all doshas, especially Pitta'),
('Bitter Gourd', 'Vegetables', 17, 1.0, 3.7, 0.2, 2.8, 'Kapha+', 'Bitter', 'Cooling', 'Pungent', ARRAY['Blood purifier', 'Detoxifying', 'Light'], 'Excellent for Kapha and Pitta, reduces blood sugar'),
('Okra', 'Vegetables', 33, 1.9, 7.5, 0.2, 3.2, 'Vata+', 'Sweet', 'Cooling', 'Sweet', ARRAY['Mucilaginous', 'Soothing', 'Nourishing'], 'Good for Vata and Pitta, may increase Kapha'),

-- Fruits
('Mango', 'Fruits', 60, 0.8, 15.0, 0.4, 1.6, 'Pitta+', 'Sweet', 'Cooling', 'Sweet', ARRAY['Nourishing', 'Juicy', 'Cooling'], 'King of fruits, cooling and nourishing, good for Vata and Pitta'),
('Apple', 'Fruits', 52, 0.3, 13.8, 0.2, 2.4, 'Vata+', 'Sweet, Astringent', 'Cooling', 'Sweet', ARRAY['Cleansing', 'Astringent', 'Light'], 'Good for all doshas, especially Pitta and Kapha'),
('Banana', 'Fruits', 89, 1.1, 22.8, 0.3, 2.6, 'Vata+', 'Sweet', 'Cooling', 'Sweet', ARRAY['Quick energy', 'Heavy', 'Nourishing'], 'Excellent for Vata, may increase Kapha'),
('Pomegranate', 'Fruits', 83, 1.7, 18.7, 1.2, 4.0, 'Pitta+', 'Sweet, Astringent', 'Cooling', 'Sweet', ARRAY['Blood building', 'Cooling', 'Astringent'], 'Excellent for Pitta, good for blood health'),

-- Spices
('Turmeric', 'Spices', 312, 9.7, 67.1, 3.2, 22.7, 'Kapha+', 'Bitter, Pungent', 'Heating', 'Pungent', ARRAY['Anti-inflammatory', 'Digestive', 'Blood purifier'], 'Golden spice, reduces Kapha, increases Pitta in excess'),
('Ginger', 'Spices', 80, 1.8, 17.8, 0.8, 2.0, 'Vata+', 'Pungent', 'Heating', 'Sweet', ARRAY['Digestive fire enhancer', 'Anti-nausea', 'Warming'], 'Universal digestive aid, use moderately in Pitta'),
('Cumin', 'Spices', 375, 17.8, 44.2, 22.3, 10.5, 'Vata+', 'Pungent, Bitter', 'Cooling', 'Pungent', ARRAY['Digestive', 'Cooling', 'Carminative'], 'Excellent digestive spice, cooling despite pungent taste'),
('Coriander', 'Spices', 298, 12.4, 54.9, 17.8, 41.9, 'Tridoshic', 'Pungent, Bitter', 'Cooling', 'Sweet', ARRAY['Cooling', 'Digestive', 'Detoxifying'], 'Balances all doshas, cooling and digestive'),
('Cardamom', 'Spices', 311, 10.8, 68.5, 6.7, 28.0, 'Vata+', 'Pungent, Sweet', 'Cooling', 'Sweet', ARRAY['Aromatic', 'Digestive', 'Refreshing'], 'Queen of spices, good for digestion and breath'),
('Cinnamon', 'Spices', 247, 4.0, 80.6, 1.2, 53.1, 'Vata+', 'Pungent, Sweet', 'Heating', 'Sweet', ARRAY['Warming', 'Digestive', 'Sweet'], 'Warming spice, good for Vata and Kapha'),

-- Oils
('Coconut Oil', 'Oils', 862, 0, 0, 100, 0, 'Pitta+', 'Sweet', 'Cooling', 'Sweet', ARRAY['Moisturizing', 'Cooling', 'Antimicrobial'], 'Excellent for Pitta, good for all doshas in moderation'),
('Sesame Oil', 'Oils', 884, 0, 0, 100, 0, 'Vata+', 'Sweet', 'Heating', 'Sweet', ARRAY['Warming', 'Nourishing', 'Heavy'], 'Best oil for Vata, warming and nourishing'),
('Ghee', 'Oils', 900, 0, 0, 100, 0, 'Tridoshic', 'Sweet', 'Cooling', 'Sweet', ARRAY['Nourishing', 'Digestive', 'Sacred'], 'Golden elixir, balances all doshas, enhances digestion'),
('Mustard Oil', 'Oils', 884, 0, 0, 100, 0, 'Kapha+', 'Pungent', 'Heating', 'Pungent', ARRAY['Warming', 'Stimulating', 'Penetrating'], 'Good for Kapha, too heating for Pitta'),

-- Nuts and Seeds
('Almonds', 'Nuts', 576, 21.2, 21.7, 49.4, 12.5, 'Vata+', 'Sweet', 'Heating', 'Sweet', ARRAY['Nourishing', 'Brain tonic', 'Strengthening'], 'Excellent for Vata, soak overnight for better digestion'),
('Walnuts', 'Nuts', 654, 15.2, 13.7, 65.2, 6.7, 'Vata+', 'Sweet, Astringent', 'Heating', 'Sweet', ARRAY['Brain food', 'Oily', 'Nourishing'], 'Good for Vata, may increase Pitta and Kapha'),
('Pumpkin Seeds', 'Seeds', 559, 30.2, 10.7, 49.1, 6.0, 'Vata+', 'Sweet', 'Heating', 'Sweet', ARRAY['Protein rich', 'Mineral rich', 'Nourishing'], 'Good source of minerals, nourishing for Vata'),
('Sunflower Seeds', 'Seeds', 584, 20.8, 20.0, 51.5, 8.6, 'Vata+', 'Sweet', 'Heating', 'Sweet', ARRAY['Vitamin E rich', 'Nourishing', 'Oily'], 'Good for Vata, rich in healthy fats'),

-- Dairy
('Milk', 'Dairy', 42, 3.4, 5.0, 1.0, 0, 'Vata+', 'Sweet', 'Cooling', 'Sweet', ARRAY['Nourishing', 'Building', 'Calming'], 'Excellent for Vata and Pitta, may increase Kapha'),
('Yogurt', 'Dairy', 59, 10.0, 3.6, 0.4, 0, 'Kapha+', 'Sweet, Sour', 'Heating', 'Sour', ARRAY['Probiotic', 'Heavy', 'Sour'], 'Good for digestion but increases Kapha, avoid at night'),
('Paneer', 'Dairy', 265, 11.1, 1.2, 20.8, 0, 'Kapha+', 'Sweet', 'Cooling', 'Sweet', ARRAY['Protein rich', 'Heavy', 'Building'], 'Good protein source, may increase Kapha'),

-- Beverages/Herbs
('Green Tea', 'Beverages', 1, 0, 0, 0, 0, 'Kapha+', 'Bitter, Astringent', 'Cooling', 'Pungent', ARRAY['Antioxidant', 'Light', 'Stimulating'], 'Good for Kapha, may increase Vata in excess'),
('Tulsi', 'Herbs', 22, 3.2, 2.6, 0.5, 1.6, 'Vata+', 'Pungent, Bitter', 'Heating', 'Pungent', ARRAY['Adaptogenic', 'Sacred', 'Respiratory'], 'Holy basil, excellent for stress and immunity'),
('Ashwagandha', 'Herbs', 245, 3.3, 49.9, 0.3, 32.3, 'Vata+', 'Bitter, Astringent', 'Heating', 'Sweet', ARRAY['Adaptogenic', 'Strengthening', 'Calming'], 'Excellent rasayana, reduces stress and builds strength');