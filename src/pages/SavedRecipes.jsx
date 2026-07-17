import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMenuItemById } from '../data/menuData';

export default function SavedRecipes() {
  const { savedRecipes, removeSavedRecipe } = useAuth();
  const navigate = useNavigate();

  const savedDishes = savedRecipes
    .map((id) => getMenuItemById(id))
    .filter(Boolean);

  const handleRemove = (e, id) => {
    e.stopPropagation();
    removeSavedRecipe(id);
  };

  return (
    <div className="saved-container">
      {/* Header */}
      <header className="saved-header">
        <div>
          <h1 className="saved-title">Saved Recipes</h1>
          <p className="saved-subtitle">
            {savedDishes.length} {savedDishes.length === 1 ? 'recipe' : 'recipes'} saved
          </p>
        </div>
        <Link to="/" className="header-btn">
          Back to Menu
        </Link>
      </header>

      {/* Content */}
      {savedDishes.length > 0 ? (
        <div className="menu-grid">
          {savedDishes.map((dish) => (
            <div
              key={dish.id}
              className="food-card saved-card"
              onClick={() => navigate(`/menu/${dish.id}`)}
            >
              <div className="card-image-wrapper">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="card-image"
                  loading="lazy"
                />
                <span className={`diet-badge ${dish.isVeg ? 'veg' : 'non-veg'}`}>
                  {dish.isVeg ? 'VEG' : 'NON-VEG'}
                </span>
              </div>
              <div className="card-body">
                <span className="card-category">{dish.category.toUpperCase()}</span>
                <h3 className="card-title">{dish.name}</h3>
                <p className="card-description">{dish.description}</p>
                <p className="card-servings">{dish.servings}</p>
                
                <button
                  type="button"
                  className="remove-btn"
                  onClick={(e) => handleRemove(e, dish.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p className="empty-text">No saved recipes yet.</p>
          <Link to="/" className="browse-link">
            Browse the menu
          </Link>
        </div>
      )}
    </div>
  );
}
