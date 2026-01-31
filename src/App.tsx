import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import ProductList from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import EntranceTicket from '@/pages/EntranceTicket';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Cart from '@/pages/Cart';
import StageTicket from '@/pages/StageTicket';
import Checkout from '@/pages/Checkout';
import EventPage from '@/pages/Event';
import FashionPage from '@/pages/Fashion';
import BeautyPage from '@/pages/Beauty';
import SparkClubPage from '@/pages/SparkClub';
import RootLayout from '@/components/layout/RootLayout';
import PaymentPage from '@/pages/PaymentPage';
import BookingSuccessPage from '@/pages/BookingSuccessPage';
// Add more imports as we create pages

function App() {
  return (
    <Router>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/tickets/entrance" element={<EntranceTicket />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/tickets/stage/:slug" element={<StageTicket />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment/:id" element={<PaymentPage />} />
          <Route path="/booking-success" element={<BookingSuccessPage />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/fashion" element={<FashionPage />} />
          <Route path="/beauty" element={<BeautyPage />} />
          <Route path="/spark-club" element={<SparkClubPage />} />
          {/* Add more routes here */}
        </Routes>
      </RootLayout>
    </Router>
  );
}

export default App;
