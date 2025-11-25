import React from 'react';
import { ShoppingItem } from '../types';
import { Trash2, CheckSquare, Square, ShoppingBag } from 'lucide-react';

interface Props {
  items: ShoppingItem[];
  setItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
}

export const ShoppingListManager: React.FC<Props> = ({ items, setItems }) => {
  const toggleCheck = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };
  
  const clearAll = () => {
      if(window.confirm('Bạn chắc chắn muốn xoá hết danh sách?')) {
          setItems([]);
      }
  }

  const completedCount = items.filter(i => i.checked).length;

  return (
    <div className="h-full flex flex-col p-4 max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8 mt-4">
        <div className="bg-amber-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4 text-amber-600">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Đi Chợ</h2>
        <p className="text-slate-500">
            {items.length === 0 
                ? "Danh sách của bạn đang trống." 
                : `${items.length} món cần mua (${completedCount} đã xong)`}
        </p>
      </div>

      {items.length > 0 ? (
        <>
            <div className="flex-1 overflow-y-auto mb-6 bg-white rounded-2xl shadow-sm border border-slate-200">
                <ul className="divide-y divide-slate-100">
                {items.map(item => (
                    <li 
                        key={item.id} 
                        className={`flex items-center justify-between p-4 transition-colors ${item.checked ? 'bg-slate-50' : 'hover:bg-blue-50/50'}`}
                    >
                    <div 
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                        onClick={() => toggleCheck(item.id)}
                    >
                        <button className={`transition-colors ${item.checked ? 'text-blue-500' : 'text-slate-300'}`}>
                            {item.checked ? <CheckSquare size={24} /> : <Square size={24} />}
                        </button>
                        <span className={`text-lg ${item.checked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {item.name}
                        </span>
                    </div>
                    <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-300 hover:text-red-500 p-2 transition-colors"
                    >
                        <Trash2 size={20} />
                    </button>
                    </li>
                ))}
                </ul>
            </div>
            
            <button 
                onClick={clearAll}
                className="w-full py-3 rounded-xl border-2 border-slate-100 text-slate-500 font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors"
            >
                Xoá tất cả
            </button>
        </>
      ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <p>Chưa có món nào.</p>
            <p className="text-sm mt-2">Hãy tìm công thức và thêm nguyên liệu còn thiếu vào đây!</p>
          </div>
      )}
    </div>
  );
};