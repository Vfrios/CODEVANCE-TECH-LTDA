import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import PageNotFound from '@/components/common/PageNotFound';
import ScrollToTop from '@/components/common/ScrollToTop';
import {
  useAuth,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  OAuthConsent,
  UserNotRegisteredError,
} from '@/features/auth';
// Add page imports here
import Home from '@/pages/Home';

// Aguarda o estado de auth / configurações públicas antes de renderizar as páginas do site.
const AuthGate = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  return <Outlet />;
};

export default function AppRouter() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Rotas de autenticação: públicas, ficam FORA do AuthGate para não gerar loop de redirecionamento */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/oauth/consent" element={<OAuthConsent />} />

        <Route element={<AuthGate />}>
          {/* Add your page Route elements here */}
          <Route path="/" element={<Home />} />
          {/* Para páginas que exigem login, agrupe-as com <Route element={<ProtectedRoute unauthenticatedElement={<Login />} />}> */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}
