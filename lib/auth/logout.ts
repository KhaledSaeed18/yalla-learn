import { persistor, store } from "@/redux/store";
import { clearCredentials } from "@/redux/slices/authSlice";

export const logout = async (redirectToLogin = true) => {
    try {
        store.dispatch(clearCredentials());

        await persistor.purge();

        if (redirectToLogin) {
            window.location.href = "/auth/signin";
        }
    } catch (error) {
        throw new Error(`Failed to logout: ${error}`);
    }
};