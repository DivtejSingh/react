import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getFromLocalStorage } from "./utils/LocalStorageUtills";

const savedLanguage = getFromLocalStorage("lang") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        addMeal: "Add Meal",
        selectLang: "Select the language:",
        enterMealNameInput: "Enter Meal Name",
        addMealBtn: "Add Meal",
        allMealTitle: "All Meals",
        addCategory: "Add Category",
        selectMealType: "Select The Meal",
        chooseMeal: "Choose Meal",
        categoryName: "Category Name",
        allCategory: "All Categories",
      },
    },
    he: {
      translation: {
        addMeal: "הוסף ארוחה",
        selectLang: "בחר את השפה:",
        enterMealNameInput: "הזן את שם הארוחה",
        addMealBtn: "הוסף ארוחה",
        allMealTitle: "כל הארוחות",
        addCategory: "הוסף קטגוריה",
        selectMealType: "בחר את הארוחה",
        chooseMeal: "בחר ארוחה",
        categoryName: "שם קטגוריה",
        allCategory: "כל הקטגוריות",
      },
    },
    ru: {
      translation: {
        addMeal: "Добавить еду",
        selectLang: "Выберите язык:",
        enterMealNameInput: "Введите название блюда",
        addMealBtn: "Добавить еду",
        allMealTitle: "Все блюда",
        addCategory: "Добавить категорию",
        selectMealType: "Выберите еду",
        chooseMeal: "Выбрать питание",
        categoryName: "Название категории",
        allCategory: "Все категории",
      },
    },
  },
  lng: savedLanguage, // Set the initial language from localStorage
  fallbackLng: savedLanguage,
  interpolation: {
    escapeValue: false, // React already safes from XSS
  },
});

export default i18n;
