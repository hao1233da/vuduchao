import React, { useState, KeyboardEvent } from 'react';
import { Plus, X, Refrigerator, ArrowRight } from 'lucide-react';
import { Ingredient } from '../types';

interface Props {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  onFindRecipes: () => void;
}

export const IngredientManager: React.FC<Props> = ({ ingredients, setIngredients, onFindRecipes }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      const newIngredient: Ingredient = {
        id: Date.now().toString() + Math.random().toString(),
        name: inputValue.trim()
      };
      setIngredients(prev => [...prev, newIngredient]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const removeIngredient = (id: string) => {
    setIngredients(prev => prev.filter(i => i.id !== id));
  };

  const suggestions = ["Trứng", "Cà chua", "Thịt bò", "Hành tây", "Đậu hũ", "Sữa tươi", "Cà rốt"];

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 animate-fade-in">
      <div className="text-center mb-8 mt-4">
        <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4 text-blue-600">
          <Refrigerator size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Tủ lạnh có gì?</h2>
        <p className="text-slate-500">Nhập nguyên liệu bạn đang có để nhận gợi ý món ngon.</p>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex gap-2 mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ví dụ: 2 quả trứng, hành lá..."
          className="flex-1 p-3 outline-none text-slate-700 placeholder:text-slate-400 bg-transparent"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors flex items-center justify-center min-w-[3rem]"
        >
          <Plus size={24} />
        </button>
      </div>

      {ingredients.length === 0 && (
        <div className="mb-8">
            <p className="text-sm text-slate-400 mb-3 font-medium uppercase tracking-wider">Gợi ý nhanh:</p>
            <div className="flex flex-wrap gap-2">
                {suggestions.map(s => (
                    <button
                        key={s}
                        onClick={() => {
                            const newIngredient: Ingredient = {
                                id: Date.now().toString() + Math.random().toString(),
                                name: s
                            };
                            setIngredients(prev => [...prev, newIngredient]);
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-sm transition-colors"
                    >
                        + {s}
                    </button>
                ))}
            </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto mb-6">
        {ingredients.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ingredients.map(ing => (
              <div key={ing.id} className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl flex items-center justify-between group border border-emerald-100">
                <span className="font-medium truncate">{ing.name}</span>
                <button
                  onClick={() => removeIngredient(ing.id)}
                  className="text-emerald-400 hover:text-emerald-600 p-1 opacity-60 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onFindRecipes}
        disabled={ingredients.length === 0}
        className={`
            w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-[0.98]
            ${ingredients.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-200/50'
            }
        `}
      >
        <span>Tìm công thức</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
};