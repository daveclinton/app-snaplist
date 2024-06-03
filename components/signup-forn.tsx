import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { SvgProps } from "react-native-svg";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";
import * as z from "zod";

import {
  Button,
  ControlledConfirmPasswordInput,
  ControlledEmailInput,
  ControlledPasswordInput,
  Pressable,
  Text,
  View,
} from "@/ui";

export const PasswordInfo = ({ color = "#838589", ...props }: SvgProps) => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" {...props}>
    <G clipPath="url(#clip0)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 0C5.62 0 4.26 .41 3.11 1.18C1.96 1.95 1.06 3.04 .533 4.32C.003 5.6-.136 7.01.135 8.37C.405 9.72 1.07 10.97 2.05 11.95C3.03 12.93 4.27 13.59 5.63 13.87C7 14.14 8.4 14 9.68 13.47C10.96 12.94 12.05 12.04 12.82 10.89C13.59 9.74 14 8.38 14 7C14 5.14 13.26 3.36 11.95 2.05C10.64 .74 8.86 0 7 0ZM7 12.83C5.85 12.83 4.72 12.49 3.76 11.85C2.8 11.21 2.05 10.3 1.61 9.23C1.17 8.17 1.05 7 1.28 5.86C1.5 4.73 2.06 3.69 2.88 2.88C3.69 2.06 4.73 1.5 5.86 1.28C7 1.05 8.17 1.17 9.23 1.61C10.3 2.05 11.21 2.8 11.85 3.76C12.49 4.72 12.83 5.85 12.83 7C12.83 8.55 12.22 10.03 11.12 11.12C10.03 12.22 8.55 12.83 7 12.83ZM7 5.83H6.42C6.26 5.83 6.11 5.89 6 6C5.89 6.11 5.83 6.26 5.83 6.42C5.83 6.57 5.89 6.72 6 6.83C6.11 6.94 6.26 7 6.42 7H7V10.5C7 10.65 7.06 10.8 7.17 10.91C7.28 11.02 7.43 11.08 7.58 11.08C7.74 11.08 7.89 11.02 8 10.91C8.11 10.8 8.17 10.65 8.17 10.5V7C8.17 6.69 8.04 6.39 7.82 6.18C7.61 5.96 7.31 5.83 7 5.83ZM7.88 3.79C7.88 4.27 7.48 4.67 7 4.67C6.52 4.67 6.13 4.27 6.13 3.79C6.13 3.31 6.52 2.92 7 2.92C7.48 2.92 7.88 3.31 7.88 3.79Z"
        fill={color}
      />
    </G>
    <Defs>
      <ClipPath id="clip0">
        <Rect width={14} height={14} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

const schema = z
  .object({
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  isLoading?: boolean;
};

export const SignUpForm = ({
  onSubmit = () => {},
  isLoading = false,
}: LoginFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  return (
    <View className="flex-1 justify-center p-6">
      <Text testID="form-title" className="pb-6 text-2xl font-semibold">
        Sign Up
      </Text>
      <ControlledEmailInput
        testID="email-input"
        control={control}
        name="email"
        label="Email"
        placeholder="Email"
        error={errors.email?.message}
      />
      <ControlledPasswordInput
        testID="password-input"
        control={control}
        name="password"
        label="Password"
        placeholder="******"
        secureTextEntry={true}
        error={errors.password?.message}
      />
      <View className="my-4 flex flex-row items-center">
        <PasswordInfo />
        <Text className="ml-2">Password should be 6 characters</Text>
      </View>
      <ControlledConfirmPasswordInput
        testID="confirm-password-input"
        control={control}
        name="confirmPassword"
        label="Confirm Password"
        placeholder="******"
        secureTextEntry={true}
        error={errors.confirmPassword?.message}
      />
      {errors.confirmPassword && (
        <Text className="text-red-500">{errors.confirmPassword.message}</Text>
      )}
      <Button
        testID="login-button"
        label="Confirm"
        loading={isLoading}
        onPress={handleSubmit(onSubmit)}
        className="mt-[40px]"
      />
      <View className="mt-8 flex flex-row items-center justify-center">
        <Text>Already have an account?</Text>
        <Link href="/onboarding" asChild>
          <Pressable>
            <Text className="text-lg ml-2 font-bold text-[#007AFF] underline">
              Sign In
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};
