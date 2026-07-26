import { lazy, Suspense, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import PageLoader from './components/common/PageLoader.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';
import SkipLink from './components/common/SkipLink.jsx';
import ProtectedRoute from './components/account/ProtectedRoute.jsx';
import PublicOnlyRoute from './components/account/PublicOnlyRoute.jsx';
import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute.jsx';
import { AdminAuthProvider } from './admin/hooks/useAdminAuth.js';
import AdminLayout from './admin/layouts/AdminLayout.jsx';
import AccountLayout from './layouts/AccountLayout.jsx';
import StoreLayout from './layouts/StoreLayout.jsx';
import { getCurrentCustomer, refreshCustomerSession } from './services/authService.js';
import { clearAuthUser, selectAuth, setAuthStatus, setAuthUser } from './store/slices/authSlice.js';
import { fetchBackendCart, switchToGuestCart } from './store/slices/cartSlice.js';
import { fetchPublicCategories, selectCategoryStatus } from './store/slices/categorySlice.js';
import { CHECKOUT_LOGIN_MESSAGE } from './utils/authRedirect.js';
import { loadCartState } from './utils/storage.js';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const ShopPage = lazy(() => import('./pages/ShopPage.jsx'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage.jsx'));
const SearchPage = lazy(() => import('./pages/SearchPage.jsx'));
const WishlistPage = lazy(() => import('./pages/WishlistPage.jsx'));
const CartPage = lazy(() => import('./pages/CartPage.jsx'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage.jsx'));
const AccountDashboardPage = lazy(() => import('./pages/AccountDashboardPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const OrdersPage = lazy(() => import('./pages/OrdersPage.jsx'));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage.jsx'));
const AddressesPage = lazy(() => import('./pages/AddressesPage.jsx'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage.jsx'));
const AccountWishlistPage = lazy(() => import('./pages/AccountWishlistPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const FaqPage = lazy(() => import('./pages/FaqPage.jsx'));
const ShippingPolicyPage = lazy(() => import('./pages/ShippingPolicyPage.jsx'));
const ReturnPolicyPage = lazy(() => import('./pages/ReturnPolicyPage.jsx'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage.jsx'));
const TermsPage = lazy(() => import('./pages/TermsPage.jsx'));
const SizeGuidePage = lazy(() => import('./pages/SizeGuidePage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const AdminLoginPage = lazy(() => import('./admin/pages/AdminLoginPage.jsx'));
const AdminDashboardPage = lazy(() => import('./admin/pages/AdminDashboardPage.jsx'));
const CategoryListPage = lazy(() => import('./admin/pages/CategoryListPage.jsx'));
const CategoryCreatePage = lazy(() => import('./admin/pages/CategoryCreatePage.jsx'));
const CategoryEditPage = lazy(() => import('./admin/pages/CategoryEditPage.jsx'));
const ProductListPage = lazy(() => import('./admin/pages/ProductListPage.jsx'));
const ProductCreatePage = lazy(() => import('./admin/pages/ProductCreatePage.jsx'));
const ProductEditPage = lazy(() => import('./admin/pages/ProductEditPage.jsx'));
const AdminOrdersPage = lazy(() => import('./admin/pages/AdminOrdersPage.jsx'));
const AdminOrderDetailsPage = lazy(() => import('./admin/pages/AdminOrderDetailsPage.jsx'));
const AdminForbiddenPage = lazy(() => import('./admin/pages/AdminForbiddenPage.jsx'));

function App() {
  const dispatch = useDispatch();
  const categoryStatus = useSelector(selectCategoryStatus);
  const auth = useSelector(selectAuth);
  const authInitializationStarted = useRef(false);

  useEffect(() => {
    if (categoryStatus === 'idle') {
      dispatch(fetchPublicCategories());
    }
  }, [categoryStatus, dispatch]);

  useEffect(() => {
    if (authInitializationStarted.current) {
      return;
    }

    authInitializationStarted.current = true;

    async function initializeCustomer() {
      let finalAuthStatus = 'failed';

      dispatch(setAuthStatus('loading'));

      try {
        await refreshCustomerSession();
        const user = await getCurrentCustomer();
        dispatch(setAuthUser(user));
        finalAuthStatus = 'succeeded';

        // Cart data loads independently and never blocks the account icon or navigation.
        void dispatch(fetchBackendCart());
      } catch {
        dispatch(clearAuthUser());
        dispatch(switchToGuestCart(loadCartState()));
      } finally {
        dispatch(setAuthStatus(finalAuthStatus));
      }
    }

    void initializeCustomer();
  }, [auth.isAuthenticated, dispatch]);

  return (
    <>
      <Helmet>
        <title>Amorah </title>
        <meta
          name="description"
          content="Amorah  a premium women's clothing e-commerce experience."
        />
      </Helmet>
      <SkipLink />
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<StoreLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:categorySlug" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductDetailsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute loginMessage={CHECKOUT_LOGIN_MESSAGE}>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-success/:orderNumber"
              element={
                <ProtectedRoute>
                  <OrderSuccessPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
            <Route path="/signup" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
            <Route path="/register" element={<Navigate to="/signup" replace />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
            <Route path="/return-policy" element={<ReturnPolicyPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-and-conditions" element={<TermsPage />} />
            <Route path="/terms" element={<Navigate to="/terms-and-conditions" replace />} />
            <Route path="/size-guide" element={<SizeGuidePage />} />
          </Route>

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AccountDashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:orderNumber" element={<OrderDetailsPage />} />
            <Route path="addresses" element={<AddressesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="wishlist" element={<AccountWishlistPage />} />
          </Route>

          <Route
            path="/admin/login"
            element={
              <AdminAuthProvider>
                <PublicOnlyRoute><AdminLoginPage /></PublicOnlyRoute>
              </AdminAuthProvider>
            }
          />
          <Route
            path="/admin/forbidden"
            element={
              <AdminAuthProvider>
                <AdminForbiddenPage />
              </AdminAuthProvider>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminAuthProvider>
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              </AdminAuthProvider>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="categories" element={<CategoryListPage />} />
            <Route path="categories/new" element={<CategoryCreatePage />} />
            <Route path="categories/:categoryId/edit" element={<CategoryEditPage />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="products/new" element={<ProductCreatePage />} />
            <Route path="products/:productId" element={<ProductEditPage />} />
            <Route path="products/:productId/edit" element={<ProductEditPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:orderId" element={<AdminOrderDetailsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
