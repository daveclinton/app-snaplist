import { Link } from "expo-router";
import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import { VerificationCover } from "@/components/verification-cover";
import {
  Button,
  ControlledOTPInput,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "@/ui";

export type LoginFormProps = {
  onSubmit?: SubmitHandler<any>;
  isLoading?: boolean;
  onPress?: () => void;
};

export const VerifcationForm = ({
  onSubmit = () => {},
  isLoading = false,
  onPress = () => {},
}: LoginFormProps) => {
  const { handleSubmit, control } = useForm<any>({});
  return (
    <View className="flex-1 justify-center p-6">
      <VerificationCover />
      <Text
        testID="form-title"
        className=" mt-5 pb-6 text-center text-2xl font-semibold"
      >
        OTP Verification
      </Text>
      <Text className="ml-2 text-center text-lg">
        We Will send you a one time password on this Email
      </Text>
      <View>
        <ControlledOTPInput
          testID="password-input"
          control={control}
          name="otp"
          label="Password"
          placeholder="******"
          secureTextEntry={true}
        />
      </View>
      <SafeAreaView className="mt-6">
        <Button
          testID="login-button"
          label="Submit"
          loading={isLoading}
          onPress={handleSubmit(onSubmit)}
          className="mt-[40px]"
        />
      </SafeAreaView>
      <Pressable onPress={onPress} className="items-center">
        <Text className="text-lg ml-2  font-bold text-[#2A2661]">
          Resend OTP?
        </Text>
      </Pressable>
      <View className="mt-4 flex flex-row items-center justify-center">
        <Text>Already have an account?</Text>
        <Link href="/onboarding" asChild>
          <Pressable>
            <Text className="text-lg ml-2  font-bold text-[#007AFF] underline">
              Sign In
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};
