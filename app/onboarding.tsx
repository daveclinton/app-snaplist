import { useRouter } from "expo-router";
import React from "react";

import { useLogin } from "@/api/authentication/use-login";
import { LoginForm } from "@/components/login-form";
import { useSoftKeyboardEffect } from "@/core/keyboard";
import { FocusAwareStatusBar, showErrorMessage } from "@/ui";

export default function Login() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  useSoftKeyboardEffect();

  const onSubmit = async (data: { username: string; password: string }) => {
    login(data, {
      onSuccess: () => {
        router.push("/connect-market");
      },
      onError: () => {
        showErrorMessage("Error");
      },
    });
  };
  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} loading={isPending} />
    </>
  );
}
