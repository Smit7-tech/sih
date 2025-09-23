import React, { useState } from 'react';
import { Search, Plus, Edit3, Trash2, Filter } from 'lucide-react';
import Sidebar from './Sidebar';
import { useFoodDatabase } from '../hooks/useFoodDatabase';

type CurrentPage = 'login' | 'dashboard' | 'patient-profile' | 'food-database' | 'diet-builder' | 'reports' | 'mobile-patient';

interface FoodDatabaseProps {
  onNavigate: (page: CurrentPage) => void;
}

const FoodDatabase: React.FC<FoodDatabaseProps> = ({ onNavigate }) => {
  const { foodItems, loading, addFoodItem, updateFoodItem, deleteFoodItem, searchFoodItems } = useFoodDatabase();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDosha, setSelectedDosha] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);

  const categories = ['All', 'Grains', 'Legumes', 'Vegetables', 'Fruits', 'Spices', 'Oils', 'Nuts', 'Dairy', 'Beverages', 'Herbs'];
  const doshaEffects = ['All', 'Tridoshic', 'Vata+', 'Pitta+', 'Kapha+'];

  const filteredItems = searchFoodItems(searchQuery, selectedCategory, selectedDosha);

  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Grains',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    dosha_effect: 'Tridoshic',
    rasa: '',
    virya: 'Neutral',
    vipaka: '',
    properties: [],
    ayurvedic_note: '',
    is_active: true
  });

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await addFoodItem(newItem);
    if (!error) {
      setShowAddForm(false);
      setNewItem({
        name: '',
        category: 'Grains',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        dosha_effect: 'Tridoshic',
        rasa: '',
        virya: 'Neutral',
        vipaka: '',
        properties: [],
        ayurvedic_note: '',
        is_active: true
      });
    }
  };

  return (
    <div className="flex">
      <Sidebar 
        currentPage="food-database" 
        onNavigate={onNavigate} 
        onLogout={() => onNavigate('login')} 
      />
      
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Food Database</h1>
              <p className="text-gray-600">Ayurvedic food items with nutritional and dosha information</p>
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              Add Food Item
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedDosha}
              onChange={(e) => setSelectedDosha(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {doshaEffects.map(dosha => (
                <option key={dosha} value={dosha}>{dosha}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-6 overflow-y-auto bg-stone-50">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading food database...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.dosha_effect === 'Tridoshic' ? 'bg-green-100 text-green-700' :
                      item.dosha_effect === 'Vata+' ? 'bg-purple-100 text-purple-700' :
                      item.dosha_effect === 'Pitta+' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.dosha_effect}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Calories</span>
                      <span className="font-medium">{item.calories}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Protein</span>
                      <span className="font-medium">{item.protein}g</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Carbs</span>
                      <span className="font-medium">{item.carbs}g</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fat</span>
                      <span className="font-medium">{item.fat}g</span>
                    </div>
                  </div>

                  {item.ayurvedic_note && (
                    <div className="p-3 bg-amber-50 rounded-lg mb-4">
                      <p className="text-xs text-amber-700">{item.ayurvedic_note}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {item.rasa && <span>Rasa: {item.rasa}</span>}
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteFoodItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Food Item Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Add New Food Item</h3>
                <form onSubmit={handleAddItem} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={newItem.category}
                        onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        {categories.slice(1).map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                      <input
                        type="number"
                        value={newItem.calories}
                        onChange={(e) => setNewItem({...newItem, calories: parseFloat(e.target.value)})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newItem.protein}
                        onChange={(e) => setNewItem({...newItem, protein: parseFloat(e.target.value)})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newItem.carbs}
                        onChange={(e) => setNewItem({...newItem, carbs: parseFloat(e.target.value)})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fat (g)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newItem.fat}
                        onChange={(e) => setNewItem({...newItem, fat: parseFloat(e.target.value)})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dosha Effect</label>
                    <select
                      value={newItem.dosha_effect}
                      onChange={(e) => setNewItem({...newItem, dosha_effect: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      {doshaEffects.slice(1).map(dosha => (
                        <option key={dosha} value={dosha}>{dosha}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ayurvedic Note</label>
                    <textarea
                      value={newItem.ayurvedic_note}
                      onChange={(e) => setNewItem({...newItem, ayurvedic_note: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      rows={3}
                      placeholder="Ayurvedic properties and benefits..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Add Food Item
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FoodDatabase;