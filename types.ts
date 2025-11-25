export interface Ingredient {
  id: string;
  name: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  cookingTime: string;
  difficulty: string;
  calories: string;
  usedIngredients: string[];
  missingIngredients: string[];
  steps: string[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
}

export enum AppView {
  FRIDGE = 'FRIDGE',
  RECIPES = 'RECIPES',
  SHOPPING = 'SHOPPING'
}