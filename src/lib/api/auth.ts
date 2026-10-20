import { useAuth } from "@/store/auth";
import { getUrl } from "../utils";
import { forgotPasswordPayload, loginPayload, registerPayload, resetPasswordPayload } from "@/types";

async function handleResponse(res: Response) {
	// For redirects
	if (res.redirected && res.ok) {
		return { success: true };
	}
	// Real reponses with JSON data
	if (!res.ok) {
		const errorData = await res.json().catch(() => null);
		const message = Array.isArray(errorData?.message)
			? errorData.message.join(", ")
			: errorData?.message ?? "Authentication failed";
		throw new Error(message);
	}

	const text = await res.text();
	return text ? JSON.parse(text) : {};
}

export const AuthApi = {

	// register
	register: async (payload: registerPayload) => {
		const res = await fetch(getUrl("/auth/register"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
			credentials: "include",
		});
		const data = await handleResponse(res);
    	if (data.user) {
            localStorage.setItem('is_authenticated', 'true');
            useAuth.getState().setAuth(data.user); 
        }
    	return data;
	},

	// login
	login: async (payload: loginPayload) => {
		const res = await fetch(getUrl("/auth/login"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
			credentials: "include",
		});
		const data = await handleResponse(res);
    	if (data.user) {
            localStorage.setItem('is_authenticated', 'true');
            useAuth.getState().setAuth(data.user); 
        }
    	return data;
	},

	// refresh token
	refreshToken: async () => {
		const res = await fetch(getUrl("/auth/refresh"), {
			method: "POST",
			credentials: "include",
		});
		return handleResponse(res);
	},

	// logout
	logout: async () => {
		const res = await fetch(getUrl("/auth/logout"), {
			method: "POST",
			credentials: "include",
		});
		localStorage.removeItem('is_authenticated');
		// useAuth.getState().logout();
		return res.ok;
	},

	// forgot password
	forgotPassword: async (payload: forgotPasswordPayload) => {
		const res = await fetch(getUrl("/auth/forget-password"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		return handleResponse(res);
	},

	// reset password
	resetPassword: async (payload: resetPasswordPayload) => {
		const res = await fetch(getUrl("/auth/reset-password"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				token: payload.token,
				password: payload.newPassword,
			}),
		});
		return handleResponse(res);
	},

	// oauth login
	oauthLogin: () => {
		const returnTo = window.location.pathname + window.location.search;
		// Land the user rigtht after the oauth login to the page they were on before
		window.location.href = getUrl("/auth/google/login") + "?returnTo=" + encodeURIComponent(returnTo);
	},

	// get current user
	getMe: async () => {
		const res = await fetch(getUrl("/auth/me"), { credentials: "include" });

		if (res.status === 401) {
            localStorage.removeItem('is_authenticated');
            return null;
        }

		const data = await handleResponse(res);
		return data.user;
	},
};
