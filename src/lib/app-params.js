// Parâmetros de runtime do app (token de sessão e id do app).
// Antes dependia de `getAccessToken` do @base44/sdk; agora lê direto do localStorage.
// TODO: se o backend real guardar o token em outro lugar (cookie httpOnly, Supabase, Clerk...),
// ajuste `getStoredToken` abaixo.

const isNode = typeof window === 'undefined';

const TOKEN_KEYS = ['token', 'access_token'];

const isClearAccessTokenRequested = () =>
	!isNode && new URLSearchParams(window.location.search).get("clear_access_token") === 'true';

const clearStoredAccessToken = () => {
	TOKEN_KEYS.forEach((key) => window.localStorage.removeItem(key));
}

const getStoredToken = () => {
	if (isNode) return null;
	for (const key of TOKEN_KEYS) {
		const value = window.localStorage.getItem(key);
		if (value) return value;
	}
	return null;
}

const getAppParams = () => {
	if (isClearAccessTokenRequested()) {
		clearStoredAccessToken();
	}
	return {
		appId: import.meta.env.VITE_APP_ID,
		token: getStoredToken(),
	}
}


export const appParams = {
	...getAppParams()
}
