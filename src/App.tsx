import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar';
import { HomePage } from './pages/HomePage';
import { ListingsPage } from './pages/ListingsPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { DashboardPage } from './pages/DashboardPage';
import { useAuthCrypto } from './store/auth.store';
import { Toaster, toast } from 'sonner'

const AppContent: React.FC = () => {
  // const [walletConnected, setWalletConnected] = useState(false);
  const [favorites, setFavorites] = useState(['1', '4']);
  const navigate = useNavigate();

  const { loginWallet, allowed, error } = useAuthCrypto()

  const handleConnectWallet = () => {
    // Mock wallet connection with animation
    // setTimeout(() => {
    //   setWalletConnected(!walletConnected);
    // }, 1000);
    if(error){
      toast.error("No detected Metamask installed, plis, install metamask to interactive to propchain")
    }
    loginWallet();
  };

  const handleToggleFavorite = (propertyId: string) => {
    setFavorites(prev => 
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <>
      <Navbar 
        onConnectWallet={handleConnectWallet}
        walletConnected={ allowed }
      />
      
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          } 
        />
        <Route 
          path="/listings" 
          element={
            <ListingsPage 
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          } 
        />
        <Route 
          path="/property/:id" 
          element={<PropertyDetailPage onToggleFavorite={handleToggleFavorite} />} 
        />
        <Route 
          path="/favorites" 
          element={
            <FavoritesPage 
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onPropertyClick={handlePropertyClick}
            />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <DashboardPage 
              walletConnected={allowed}
              onConnectWallet={handleConnectWallet}
            />
          } 
        />
      </Routes>
      <Toaster closeButton={true} duration={3000} position='top-center'/>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;