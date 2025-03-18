import { persistor, store } from "@/redux/store";
import { clearCredentials } from "@/redux/slices/authSlice";
import { toast } from "sonner";

export const logout = async (redirectToLogin = true) => {
    try {
        store.dispatch(clearCredentials());

        await persistor.purge();

        toast.success("Logged out successfully", {
            description: "You have been logged out.",
        });

        if (redirectToLogin) {
            window.location.href = "/auth/signin";
        }
    } catch (error) {
        throw new Error(`Failed to logout: ${error}`);
    }
};