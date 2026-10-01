// ============================================================================
// TODO: SUBSTITUIR POR AUTENTICAÇÃO REAL (Supabase / Clerk / Firebase / API própria)
//
// Este arquivo é o ÚNICO ponto que substitui o antigo `base44.auth.*` e
// `base44.app.*`. Ele expõe a mesma interface que o resto do app já usa, mas
// NÃO autentica ninguém: cada operação de login/cadastro rejeita com um erro
// claro. Para trocar de provedor, reimplemente os métodos abaixo (mantendo
// nomes e retornos) e nenhum outro arquivo precisará mudar.
// ============================================================================

const NOT_CONFIGURED =
  'Autenticação ainda não configurada. Substitua src/services/auth-mock.js por um backend real.';

const TOKEN_KEYS = ['token', 'access_token'];

const notConfigured = (status = 501) => {
  const error = new Error(NOT_CONFIGURED);
  error.status = status;
  return error;
};

const clearTokens = () => TOKEN_KEYS.forEach((key) => window.localStorage.removeItem(key));

export const authMock = {
  // Retorna o usuário logado. Sem backend, sempre 401.
  me: async () => {
    throw notConfigured(401);
  },

  logout: (redirectUrl) => {
    clearTokens();
    if (redirectUrl) window.location.href = redirectUrl;
  },

  redirectToLogin: (returnTo = window.location.href) => {
    const target = new URL(returnTo, window.location.origin);
    const path = target.pathname + target.search;
    window.location.href = '/login' + (path !== '/' ? `?returnTo=${encodeURIComponent(path)}` : '');
  },

  loginViaEmailPassword: async () => {
    throw notConfigured();
  },

  loginWithProvider: () => {
    throw notConfigured();
  },

  register: async () => {
    throw notConfigured();
  },

  verifyOtp: async () => {
    throw notConfigured();
  },

  resendOtp: async () => {
    throw notConfigured();
  },

  resetPasswordRequest: async () => {
    throw notConfigured();
  },

  resetPassword: async () => {
    throw notConfigured();
  },

  setToken: (token) => {
    window.localStorage.setItem('token', token);
  },
};

// Substitui `base44.app.getPublicSettings()` usado pelo AuthContext.
export const appMock = {
  getPublicSettings: async () => ({ id: 'local', public_settings: {} }),
};
