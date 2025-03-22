import { persistor, store } from "@/redux/store";
import { clearCredentials } from "@/redux/slices/authSlice";
import { toast } from "sonner";

export const logout = async (redirectToLogin = true, session = false) => {
    try {
        store.dispatch(clearCredentials());

        await persistor.purge();

        if (session) {
            toast.error("Session expired", {
                description: "Please login again.",
                duration: 5000,
            });
        } else {
            toast.success("Logged out successfully", {
                description: "You have been logged out.",
            });
        }

        if (redirectToLogin) {
            window.location.href = "/auth/signin";
        }
    } catch (error) {
        throw new Error(`Failed to logout: ${error}`);
    }
};