export { cn } from "cn"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX ?? "/api/v1";

export const getUrl = (path: string) => {
	// Remove any duplicate slashes in the path to avoid issues with the backend
	const cleanPath = `${API_PREFIX}${path}`.replace(/\/+/g, "/");
	return `${API_URL}${cleanPath}`;
};
