import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('party_menu_token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('party_menu_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [savedRecipes, setSavedRecipes] = useState(() => {
    const saved = localStorage.getItem('party_menu_saved_recipes');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('https://serverless-api-teal.vercel.app/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        const userToken = data.data.token;
        const userData = data.data.user;
        setToken(userToken);
        setUser(userData);
        localStorage.setItem('party_menu_token', userToken);
        localStorage.setItem('party_menu_user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (err) {
      return { success: false, message: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('party_menu_token');
    localStorage.removeItem('party_menu_user');
  };

  const toggleSaveRecipe = (recipeId) => {
    const id = parseInt(recipeId, 10);
    setSavedRecipes((prev) => {
      let updated;
      if (prev.includes(id)) {
        updated = prev.filter(rId => rId !== id);
      } else {
        updated = [...prev, id];
      }
      localStorage.setItem('party_menu_saved_recipes', JSON.stringify(updated));
      return updated;
    });
  };

  const removeSavedRecipe = (recipeId) => {
    const id = parseInt(recipeId, 10);
    setSavedRecipes((prev) => {
      const updated = prev.filter(rId => rId !== id);
      localStorage.setItem('party_menu_saved_recipes', JSON.stringify(updated));
      return updated;
    });
  };

  const isRecipeSaved = (recipeId) => {
    return savedRecipes.includes(parseInt(recipeId, 10));
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{
      token,
      user,
      isAuthenticated,
      savedRecipes,
      toggleSaveRecipe,
      removeSavedRecipe,
      isRecipeSaved,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
