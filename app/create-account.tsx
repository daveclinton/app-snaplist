import { useRouter } from "expo-router";
import React from "react";

import { useSignUp } from "@/api/authentication/use-create-account";
import { SignUpForm } from "@/components/signup-forn";
import { FocusAwareStatusBar, showErrorMessage } from "@/ui";
import { useSoftKeyboardEffect } from "@/core/keyboard";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();
  const { mutate: createAccount, isPending } = useSignUp();

  useSoftKeyboardEffect();

  const onSubmit = async (data: { email: string; password: string }) => {
    createAccount(data, {
      onSuccess: async () => {
        try {
          await AsyncStorage.setItem("userEmail", data.email);
          router.push("/otp-verification");
        } catch (error) {
          console.error("Error saving email to async storage:", error);
        }
      },
      onError: () => {
        showErrorMessage("Error Creating Account");
      },
    });
  };
  return (
    <>
      <FocusAwareStatusBar />
      <SignUpForm onSubmit={onSubmit} isLoading={isPending} />
    </>
  );
}
