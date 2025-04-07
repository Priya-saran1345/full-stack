import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
interface DecodedToken {
  id?: string;
}
export const getUserId = (): string | null => {
const token = Cookies.get("authToken");
if (!token) {
    console.warn("No auth token found in cookies.");
    return null;
}
try {
    const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
    console.log('user is ', decoded)
    return decoded.id ?? null; // Ensure it safely returns `null` if `id` is missing
} catch (error) {
    console.error("Error decoding token:", error);
    return null;
}
};