import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Button,
  ControlledEmailInput,
  ControlledInput,
  ControlledPasswordInput,
  Pressable,
  Text,
  View,
} from "@/ui";

const schema = z.object({
  username: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email format"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters"),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  loading?: boolean;
};

export const LoginForm = ({
  onSubmit = () => {},
  loading = false,
}: LoginFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  return (
    <View className="flex-1 justify-center p-6">
      <Text testID="form-title" className="pb-6 text-2xl font-semibold">
        Sign In
      </Text>
      <Text testID="form-title" className="pb-6 text-3xl font-bold">
        Welcome back to {"\n"}Snaplist
      </Text>
      <ControlledEmailInput
        testID="email-input"
        control={control}
        name="username"
        label="Email"
        placeholder="Email"
      />
      <ControlledPasswordInput
        testID="password-input"
        control={control}
        name="password"
        label="Password"
        placeholder="******"
        secureTextEntry={true}
      />
      <Button
        testID="login-button"
        label="Sign In"
        onPress={handleSubmit(onSubmit)}
        className="mt-[70px]"
        loading={loading}
      />
      <Link href="/" asChild>
        <Pressable>
          <Text className="text-center text-lg">Forgot Password?</Text>
        </Pressable>
      </Link>
      <Text className="mt-[40px] text-center text-lg">
        Don't have an account?
      </Text>
      <Link href="/create-account" asChild>
        <Pressable>
          <Text className="mt-[10px] text-center text-lg  font-bold text-[#007AFF] underline">
            Sign Up
          </Text>
        </Pressable>
      </Link>
    </View>
  );
};
