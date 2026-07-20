import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import CartDrawer from '../components/cart/CartDrawer.jsx';
import AnnouncementBar from '../components/layout/AnnouncementBar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Header from '../components/layout/Header.jsx';
import MobileMenu from '../components/layout/MobileMenu.jsx';
import SearchDrawer from '../components/layout/SearchDrawer.jsx';
import { selectCartItemCount } from '../store/slices/cartSlice.js';
import { closeDrawer, openDrawer, selectDrawerState } from '../store/slices/uiSlice.js';
import { selectWishlistCount } from '../store/slices/wishlistSlice.js';

function StoreLayout() {
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartItemCount);
  const wishlistCount = useSelector(selectWishlistCount);
  const isSearchOpen = useSelector(selectDrawerState('search'));
  const isMobileMenuOpen = useSelector(selectDrawerState('mobileMenu'));
  const isCartOpen = useSelector(selectDrawerState('cart'));

  const openSearch = useCallback(() => dispatch(openDrawer('search')), [dispatch]);
  const closeSearch = useCallback(() => dispatch(closeDrawer('search')), [dispatch]);
  const openMobileMenu = useCallback(() => dispatch(openDrawer('mobileMenu')), [dispatch]);
  const closeMobileMenu = useCallback(() => dispatch(closeDrawer('mobileMenu')), [dispatch]);
  const openCart = useCallback(() => dispatch(openDrawer('cart')), [dispatch]);
  const closeCart = useCallback(() => dispatch(closeDrawer('cart')), [dispatch]);

  return (
    <div className="min-h-screen bg-amorah-ivory text-amorah-black">
      <AnnouncementBar />
      <Header
        onSearchOpen={openSearch}
        onMobileMenuOpen={openMobileMenu}
        onCartOpen={openCart}
        wishlistCount={wishlistCount}
        cartCount={cartCount}
      />
      <div id="main-content" tabIndex={-1}>
        <Outlet />
      </div>
      <Footer />
      <SearchDrawer open={isSearchOpen} onClose={closeSearch} />
      <MobileMenu open={isMobileMenuOpen} onClose={closeMobileMenu} />
      <CartDrawer open={isCartOpen} onClose={closeCart} />
    </div>
  );
}

export default StoreLayout;
