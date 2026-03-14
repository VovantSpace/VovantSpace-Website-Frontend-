import { useState } from "react";
import api from "@/utils/api";

type ChangePasswordPayload = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

type ChangePasswordResponse = {
    success: boolean;
    message: string;
};

export function useChangePassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const changePassword = async ({
                                      currentPassword,
                                      newPassword,
                                      confirmPassword,
                                  }: ChangePasswordPayload): Promise<ChangePasswordResponse | null> => {
        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const { data } = await api.patch<ChangePasswordResponse>(
                "/user/change-password",
                {
                    currentPassword,
                    newPassword,
                    confirmPassword,
                }
            );

            setSuccessMessage(data.message || "Password updated successfully");
            return data;
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to change password";

            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        changePassword,
        isLoading,
        error,
        successMessage,
        setError,
        setSuccessMessage,
    };
}