import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Inventory from './pages/Inventory';

function App() {
  return (
    <BrowserRouter>
      <ProductProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inventory" element={<Inventory />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ProductProvider>
    </BrowserRouter>
  );
}

export default App;