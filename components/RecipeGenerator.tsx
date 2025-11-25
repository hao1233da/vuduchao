import React, { useEffect, useState, useRef } from 'react';
import { Recipe, ShoppingItem } from '../types';
import { generateRecipesFromIngredients } from '../services/geminiService';
import { Clock, BarChart, ChevronDown, ChevronUp, ShoppingCart, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  ingredients: string[];
  addToShoppingList: (items: string[]) => void;
  onBack: () => void;
}

export const RecipeGenerator: React.FC<Props> = ({ ingredients, addToShoppingList, onBack }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);
  
  // Ref to ensure we only fetch once per mount
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;
      
      setLoading(true);
      setError(null);
      try {
        const data = await generateRecipesFromIngredients(ingredients);
        setRecipes(data);
      } catch (err: any) {
        setError(err.message || "Có lỗi xảy ra.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [ingredients]);

  const toggleExpand = (id: string) => {
    setExpandedRecipe(prev => prev === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="relative mb-6">
             <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
             <div className="relative bg-white p-4 rounded-full shadow-lg border border-blue-100">
                <Loader2 size={48} className="text-blue-600 animate-spin" />
             </div>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Đang suy nghĩ món ngon...</h3>
        <p className="text-slate-500 max-w-xs mx-auto">Đầu bếp AI đang xem xét nguyên liệu và tìm kiếm công thức phù hợp nhất cho bạn.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="bg-red-50 p-4 rounded-full text-red-500 mb-4">
            <AlertCircle size={48} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Úi, có chút trục trặc!</h3>
        <p className="text-slate-500 mb-6">{error}</p>
        <button 
            onClick={onBack}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
            Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 max-w-3xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-slate-800">
          &larr; Quay lại tủ lạnh
        </button>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="text-yellow-500" size={20}/>
            Gợi ý cho bạn
        </h2>
      </div>

      <div className="space-y-6">
        {recipes.map((recipe, index) => (
          <div key={recipe.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
            {/* Card Header */}
            <div className="relative h-48 bg-slate-200 overflow-hidden">
                <img 
                    src={`https://picsum.photos/seed/${recipe.id}/800/400`} 
                    alt={recipe.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                    {recipe.calories} kcal
                </div>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-slate-900 leading-tight">{recipe.name}</h3>
              </div>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{recipe.description}</p>

              <div className="flex items-center gap-4 text-xs text-slate-600 font-medium mb-4">
                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                  <Clock size={14} className="text-blue-500" />
                  {recipe.cookingTime}
                </div>
                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                  <BarChart size={14} className="text-emerald-500" />
                  {recipe.difficulty}
                </div>
              </div>

              {/* Missing Ingredients Section - Always visible if there are missing items */}
              {recipe.missingIngredients.length > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                     <ShoppingCart size={12} /> Cần mua thêm:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recipe.missingIngredients.map((item, idx) => (
                        <span key={idx} className="text-xs text-amber-900 bg-amber-100/50 px-2 py-1 rounded-md border border-amber-200/50">
                            {item}
                        </span>
                    ))}
                  </div>
                  <button
                    onClick={() => addToShoppingList(recipe.missingIngredients)}
                    className="w-full mt-3 bg-white border border-amber-200 text-amber-700 text-xs font-bold py-2 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    + Thêm vào danh sách đi chợ
                  </button>
                </div>
              )}

              <button
                onClick={() => toggleExpand(recipe.id)}
                className="w-full flex items-center justify-center gap-1 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors py-2 border-t border-slate-50 mt-2"
              >
                {expandedRecipe === recipe.id ? (
                    <>Thu gọn <ChevronUp size={16} /></>
                ) : (
                    <>Xem hướng dẫn <ChevronDown size={16} /></>
                )}
              </button>
            </div>

            {/* Expanded Content: Steps */}
            {expandedRecipe === recipe.id && (
              <div className="bg-slate-50 p-5 border-t border-slate-200 animate-fade-in">
                 <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">Nguyên liệu cần:</h4>
                 <ul className="list-disc list-inside text-sm text-slate-600 mb-6 space-y-1">
                    {recipe.usedIngredients.map((ing, i) => <li key={`used-${i}`} className="text-emerald-700 font-medium">{ing} (Có sẵn)</li>)}
                    {recipe.missingIngredients.map((ing, i) => <li key={`missing-${i}`} className="text-slate-500">{ing}</li>)}
                 </ul>

                 <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">Cách làm:</h4>
                 <div className="space-y-4">
                    {recipe.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5">
                                {idx + 1}
                            </span>
                            <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
                        </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};