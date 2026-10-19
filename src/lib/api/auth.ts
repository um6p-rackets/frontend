import { getUrl } from "../utils";

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
	// login
	login: async (payload: { email: string; password: string; rememberMe?: boolean }) => {
		const res = await fetch(getUrl("/auth/login"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
			credentials: "include",
		});
		return handleResponse(res);
	},

	// register
	register: async (payload: { email: string; password: string }) => {
		const res = await fetch(getUrl("/auth/register"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
			credentials: "include",
		});
		return handleResponse(res);
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
		return res.ok;
	},

	// forgot password
	forgotPassword: async (payload: { email: string }) => {
		const res = await fetch(getUrl("/auth/forget-password"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		return handleResponse(res);
	},

	// reset password
	resetPassword: async (payload: { token: string; newPassword: string }) => {
		const res = await fetch(getUrl("/auth/reset-password"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			// FIX 3 (Part A): Map "newPassword" to "password" as the backend expects
			body: JSON.stringify({
				token: payload.token,
				password: payload.newPassword,
			}),
		});
		return handleResponse(res);
	},

	// oauth login
	oauthLogin: () => {
		// fetch dosent work here because it will be blocked by CORS, so we redirect the user to the backend endpoint
		window.location.href = getUrl("/auth/google/login");
	},
};