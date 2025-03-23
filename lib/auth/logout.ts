import { clearCredentials } from "@/redux/slices/authSlice";
import { toast } from "sonner";

let storeModule: any = null;

const getStore = async () => {
    if (!storeModule) {
        storeModule = await import("@/redux/store");
    }
    return storeModule;
};

export const logout = async (redirectToLogin = true, session = false) => {
    try {
        const { store, persistor } = await getStore();

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
        console.error("Logout error:", error);
        throw new Error(`Failed to logout: ${error}`);
    }
};