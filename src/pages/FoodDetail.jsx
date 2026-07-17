import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMenuItemById } from '../data/menuData';

export default function FoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isRecipeSaved, toggleSaveRecipe, savedRecipes } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);

  const dish = getMenuItemById(id);

  if (!dish) {
    return (
      <div className="not-found-container">
        <h2>Dish Not Found</h2>
        <p>The dish you are looking for does not exist or has been removed.</p>
        <Link to="/" className="back-to-menu-btn">Back to Menu</Link>
      </div>
    );
  }

  const isSaved = isRecipeSaved(dish.id);

  const handleSaveClick = () => {
    if (!isSaved) {
      setIsAnimating(true);
      toggleSaveRecipe(dish.id);
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    } else {
      toggleSaveRecipe(dish.id);
    }
  };

  return (
    <div className="detail-container">
      {/* Header / Nav Bar */}
      <header className="detail-header">
        <button onClick={() => navigate(-1)} className="header-btn">
          ← Back to Menu
        </button>
        <div className="detail-header-right">
          <Link to="/saved-recipes" className="header-btn">
            Saved Recipes
          </Link>
          <button
            onClick={handleSaveClick}
            className={`detail-save-btn ${isSaved ? (isAnimating ? 'animating-saved' : 'saved') : ''}`}
          >
            {isSaved ? '✓ Saved' : 'Save Recipe'}
          </button>
        </div>
      </header>

      {/* Hero Info Section (Two Columns) */}
      <section className="detail-hero-section">
        <div className="detail-hero-left">
          <img src={dish.image} alt={dish.name} className="detail-hero-img" />
        </div>
        <div className="detail-hero-right">
          <div className="detail-badges-row">
            <span className="detail-cat-badge">{dish.category.charAt(0).toUpperCase() + dish.category.slice(1)}</span>
            <span className={`detail-diet-badge ${dish.isVeg ? 'veg' : 'non-veg'}`}>
              {dish.isVeg ? '🌿 Veg' : '🍗 Non-Veg'}
            </span>
          </div>
          <h1 className="detail-title-large">{dish.name}</h1>
          <p className="detail-servings-text">{dish.servings}</p>
          <p className="detail-description-full">{dish.fullDescription}</p>
        </div>
      </section>

      {/* Ingredients Card (Full width, dark container) */}
      <section className="detail-ingredients-card">
        <h2 className="ingredients-card-title">Ingredients</h2>
        <div className="ingredients-vertical-list">
          {dish.ingredients.map((ing, idx) => (
            <div key={idx} className="ingredient-row-item">
              <span className="ing-name">{ing.name}</span>
              <span className="ing-qty">{ing.quantity}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
