import React, { useState } from 'react';
import { IngredientManager } from './components/IngredientManager';
import { RecipeGenerator } from './components/RecipeGenerator';
import { ShoppingListManager } from './components/ShoppingListManager';
import { Ingredient, ShoppingItem, AppView } from './types';
import { Refrigerator, ChefHat, ShoppingCart } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.FRIDGE);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);

  const handleFindRecipes = () => {
    setCurrentView(AppView.RECIPES);
  };

  const addToShoppingList = (newItems: string[]) => {
    const itemsToAdd: ShoppingItem[] = newItems.map(name => ({
      id: Date.now().toString() + Math.random(),
      name,
      checked: false
    }));
    setShoppingList(prev => [...prev, ...itemsToAdd]);
    // Optional: Auto switch to shopping list or show toast (keeping it simple for now)
    // alert(`Đã thêm ${newItems.length} món vào danh sách đi chợ!`);
  };

  const NavButton = ({ view, icon: Icon, label }: { view: AppView, icon: any, label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`
        flex flex-col items-center justify-center w-full py-3 gap-1 transition-colors relative
        ${currentView === view ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}
      `}
    >
      <Icon size={24} strokeWidth={currentView === view ? 2.5 : 2} />
      <span className="text-xs font-medium">{label}</span>
      {currentView === view && (
        <span className="absolute top-0 w-full h-1 bg-blue-600 rounded-b-lg"></span>
      )}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans text-slate-900">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {currentView === AppView.FRIDGE && (
          <IngredientManager 
            ingredients={ingredients} 
            setIngredients={setIngredients} 
            onFindRecipes={handleFindRecipes}
          />
        )}
        {currentView === AppView.RECIPES && (
          <RecipeGenerator 
            ingredients={ingredients.map(i => i.name)} 
            addToShoppingList={addToShoppingList}
            onBack={() => setCurrentView(AppView.FRIDGE)}
          />
        )}
        {currentView === AppView.SHOPPING && (
          <ShoppingListManager 
            items={shoppingList} 
            setItems={setShoppingList} 
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 shrink-0">
        <div className="flex justify-around max-w-2xl mx-auto px-2">
          <NavButton view={AppView.FRIDGE} icon={Refrigerator} label="Tủ Lạnh" />
          <NavButton view={AppView.RECIPES} icon={ChefHat} label="Công Thức" />
          <div className="relative w-full">
            <NavButton view={AppView.SHOPPING} icon={ShoppingCart} label="Đi Chợ" />
            {shoppingList.filter(i => !i.checked).length > 0 && (
              <span className="absolute top-2 right-[calc(50%-12px)] w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {shoppingList.filter(i => !i.checked).length}
              </span>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default App;