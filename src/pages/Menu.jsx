import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { filterMenuItems } from '../data/menuData';

export default function Menu() {
  const { user, logout, savedRecipes } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFilter = searchParams.get('category') || 'all';
  const dietFilter = searchParams.get('diet') || 'all';
  const nameFilter = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(nameFilter);

  useEffect(() => {
    setSearchInput(nameFilter);
  }, [nameFilter]);

  const dishes = filterMenuItems({
    category: categoryFilter,
    diet: dietFilter,
    name: nameFilter
  });

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams(searchParams);
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    setSearchParams(params);
  };

  const handleDietChange = (diet) => {
    const params = new URLSearchParams(searchParams);
    if (diet === 'all') {
      params.delete('diet');
    } else {
      params.set('diet', diet);
    }
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (!searchInput.trim()) {
      params.delete('search');
    } else {
      params.set('search', searchInput.trim());
    }
    setSearchParams(params);
  };

  const savedCount = savedRecipes.length;

  return (
    <div className="menu-container">
      {/* Header */}
      <header className="menu-header">
        <div className="header-left">
          <h1 className="header-title">Party Menu</h1>
          {user && <p className="welcome-msg">Welcome, {user.name}</p>}
        </div>
        <div className="header-right">
          <Link to="/saved-recipes" className="header-btn saved-btn">
            Saved Recipes
            {savedCount > 0 && <span className="count-badge">{savedCount}</span>}
          </Link>
          <button onClick={logout} className="header-btn logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* Filter Section */}
      <section className="filter-card">
        {/* Category Row */}
        <div className="filter-group">
          <span className="filter-label">CATEGORY</span>
          <div className="chips-container">
            {['all', 'starter', 'main', 'sides', 'desert'].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`chip ${categoryFilter === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Diet Row */}
        <div className="filter-group">
          <span className="filter-label">DIET</span>
          <div className="chips-container">
            <button
              type="button"
              className={`chip ${dietFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleDietChange('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`chip ${dietFilter === 'veg' ? 'active' : ''}`}
              onClick={() => handleDietChange('veg')}
            >
              <span className="leaf-icon">🌿</span> Veg
            </button>
            <button
              type="button"
              className={`chip ${dietFilter === 'nonveg' ? 'active' : ''}`}
              onClick={() => handleDietChange('nonveg')}
            >
              <span className="meat-icon">🍗</span> Non-Veg
            </button>
          </div>
        </div>

        {/* Search Row */}
        <form onSubmit={handleSearchSubmit} className="search-row">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name (e.g. chicken)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
      </section>

      {/* Display Count */}
      <div className="results-count">
        {dishes.length} {dishes.length === 1 ? 'item' : 'items'} found
      </div>

      {/* Menu Grid */}
      {dishes.length > 0 ? (
        <div className="menu-grid">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="food-card"
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
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          No dishes found. Try different filters.
        </div>
      )}
    </div>
  );
}
