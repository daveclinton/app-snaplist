import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  useResendOtp,
  useVerifyOTP,
} from "@/api/authentication/use-verify-otp";
import { useSoftKeyboardEffect } from "@/core/keyboard";
import { FocusAwareStatusBar, showErrorMessage } from "@/ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VerifcationForm } from "@/components/otp-form";
import Loader from "@/components/Loader";

export default function VerificationPage() {
  const router = useRouter();
  const { mutate: verifyAccount, isPending } = useVerifyOTP();
  const { mutate: resendOtp, isPending: resendingOtp } = useResendOtp();
  useSoftKeyboardEffect();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem("userEmail");
        if (savedEmail) {
          setEmail(savedEmail);
        }
      } catch (error) {
        console.error("Error retrieving email from async storage:", error);
      }
    };

    fetchEmail();
  }, []);

  const onSubmit = async (data: any) => {
    verifyAccount(
      { ...data, email },
      {
        onSuccess: () => {
          router.push("/onboarding");
        },
        onError: () => {
          showErrorMessage("Error confirming OTP");
        },
      }
    );
  };

  const resendOTP = async () => {
    resendOtp(
      { email },
      {
        onError: () => {
          showErrorMessage("Error resending OTP");
        },
      }
    );
  };

  return (
    <>
      <FocusAwareStatusBar />
      {resendingOtp && <Loader />}
      <VerifcationForm
        onSubmit={onSubmit}
        isLoading={isPending}
        onPress={resendOTP}
      />
    </>
  );
}
