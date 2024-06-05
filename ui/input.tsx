import * as React from "react";
import type {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { useController } from "react-hook-form";
import type { TextInputProps } from "react-native";
import {
  I18nManager,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { TextInput as NTextInput } from "react-native";
import type { SvgProps } from "react-native-svg";
import Svg, {
  ClipPath,
  Defs,
  G,
  Path as SvgPath,
  Rect,
} from "react-native-svg";
import { tv } from "tailwind-variants";
import colors from "./colors";

const PasswordSvg = ({ color = "#838589", ...props }: SvgProps) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <G clipPath="url(#clip0)">
      <SvgPath
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2.213c5.16 0 8.1 3.531 9.392 5.636.4.646.612 1.391.612 2.15 0 .76-.212 1.505-.612 2.151-1.292 2.105-4.192 5.637-9.392 5.637-5.16 0-8.1-3.531-9.392-5.637-.4-.646-.612-1.391-.612-2.15 0-.76.212-1.505.612-2.151C1.9 5.744 4.84 2.213 10 2.213zm0 13.9c4.349 0 6.862-3.037 7.972-4.842.237-.384.362-.827.362-1.283 0-.455-.125-.898-.362-1.283-1.11-1.805-3.622-4.922-7.972-4.922-4.349 0-6.861 3.046-7.971 4.846-.237.384-.362.827-.362 1.283 0 .455.125.898.362 1.283 1.11 1.805 3.622 4.922 7.972 4.922zm-2.315-5.535c.685-.458 1.49-.702 2.315-.702 1.105.003 2.164.442 2.945 1.221.782.781 1.221 1.84 1.222 3 0 .824-.244 1.63-.702 2.315-.458.685-1.108 1.219-1.869 1.534-.762.315-1.609.397-2.417.236-.808-.16-1.55-.557-2.133-1.14-.583-.583-.98-1.326-1.14-2.133-.16-.808.022-1.654.335-2.417.314-.761.849-1.411 1.534-1.869zm1.528 5.525c.411.275.893.422 1.393.422.663 0 1.299-.264 1.768-.732.469-.468.732-1.104.732-1.768 0-.5-.148-.982-.422-1.39-.274-.41-.665-.731-1.122-.919-.457-.188-.96-.138-1.445.03-.485.168-.93.405-1.279.765-.349.36-.55.805-.64 1.284-.09.48-.04.965.175 1.422.215.457.534.847.935 1.108z"
        fill={color}
      />
    </G>
    <Defs>
      <ClipPath id="clip0">
        <Rect width={20} height={20} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

const inputTv = tv({
  slots: {
    container: "mb-2 h-[42px]",
    label: "text-grey-100  text-lg mb-1",
    input:
      "mt-0 border-[0.3px] font-jakarta text-base leading-5 font-[500] px-4 py-3 rounded-xl border-[0.5px] border-neutral-300 bg-[#FAFAFA]",
  },

  variants: {
    focused: {
      true: {
        input: "border-neutral-400",
      },
    },
    error: {
      true: {
        input: "border-danger-600",
        label: "text-danger-600 dark:text-danger-600",
      },
    },
    disabled: {
      true: {
        input: "bg-neutral-200",
      },
    },
  },
  defaultVariants: {
    focused: false,
    error: false,
    disabled: false,
  },
});

export interface NInputProps extends TextInputProps {
  label?: string;
  disabled?: boolean;
  error?: string;
}

type TRule = Omit<
  RegisterOptions,
  "valueAsNumber" | "valueAsDate" | "setValueAs"
>;

export type RuleType<T> = { [name in keyof T]: TRule };
export type InputControllerType<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: TRule;
  label?: string;
};

interface ControlledInputProps<T extends FieldValues>
  extends NInputProps,
    InputControllerType<T> {}

export const Input = React.forwardRef<TextInput, NInputProps>((props, ref) => {
  const { label, error, testID, ...inputProps } = props;
  const [isFocussed, setIsFocussed] = React.useState(false);
  const onBlur = React.useCallback(() => setIsFocussed(false), []);
  const onFocus = React.useCallback(() => setIsFocussed(true), []);

  const styles = React.useMemo(
    () =>
      inputTv({
        error: Boolean(error),
        focused: isFocussed,
        disabled: Boolean(props.disabled),
      }),
    [error, isFocussed, props.disabled]
  );

  return (
    <View className={styles.container()}>
      {label && (
        <Text
          testID={testID ? `${testID}-label` : undefined}
          className={styles.label()}
        >
          {label}
        </Text>
      )}
      <NTextInput
        testID={testID}
        ref={ref}
        placeholderTextColor={colors.neutral[400]}
        className={styles.input()}
        onBlur={onBlur}
        onFocus={onFocus}
        {...inputProps}
        style={StyleSheet.flatten([
          { writingDirection: I18nManager.isRTL ? "rtl" : "ltr" },
          inputProps.style,
        ])}
      />
      {error && (
        <Text
          testID={testID ? `${testID}-error` : undefined}
          className="text-sm text-danger-400"
        >
          {error}
        </Text>
      )}
    </View>
  );
});

// only used with react-hook-form
export function ControlledInput<T extends FieldValues>(
  props: ControlledInputProps<T>
) {
  const { name, control, rules, ...inputProps } = props;

  const { field, fieldState } = useController({ control, name, rules });
  return (
    <Input
      ref={field.ref}
      autoCapitalize="none"
      onChangeText={field.onChange}
      value={(field.value as string) || ""}
      {...inputProps}
      error={fieldState.error?.message}
    />
  );
}

export function ControlledPasswordInput<T extends FieldValues>(
  props: ControlledInputProps<T>
) {
  const { name, control, rules, label = "Password" } = props;

  const { field } = useController({ control, name, rules });
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  return (
    <>
      <Text className="text-grey-100 my-2 text-lg">{label}</Text>
      <View className="flex flex-row items-center rounded-xl border-[0.5px] h-[42px] border-neutral-300 bg-[#FAFAFA] px-2.5">
        <TextInput
          className="h-[50px] flex-1"
          secureTextEntry={!passwordVisible}
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={field.onChange}
          value={(field.value as string) || ""}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <PasswordSvg />
        </TouchableOpacity>
      </View>
    </>
  );
}

export function ControlledConfirmPasswordInput<T extends FieldValues>(
  props: ControlledInputProps<T>
) {
  const { name, control, rules, label = "Password" } = props;

  const { field } = useController({ control, name, rules });
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  return (
    <>
      <Text className="text-grey-100 my-2 text-lg">{label}</Text>
      <View className="flex flex-row items-center rounded-xl border-[0.5px] h-[42px] border-neutral-300 bg-[#FAFAFA] px-2.5">
        <TextInput
          className="h-[50px] flex-1"
          secureTextEntry={!passwordVisible}
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={field.onChange}
          value={(field.value as string) || ""}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <PasswordSvg />
        </TouchableOpacity>
      </View>
    </>
  );
}

export function ControlledNormalInput<T extends FieldValues>(
  props: ControlledInputProps<T>
) {
  const { name, control, rules, label } = props;

  const { field } = useController({ control, name, rules });

  return (
    <>
      <View className="mt-3 flex flex-row items-center rounded-xl border-[0.5px] h-[42px] border-neutral-300 bg-[#FAFAFA] px-2.5">
        <Text className="text-grey-100 mb-1 text-lg">{label}</Text>
        <TextInput
          className="h-[50px] flex-1"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={field.onChange}
          value={(field.value as string) || ""}
        />
      </View>
    </>
  );
}

export function ControlledOTPInput<T extends FieldValues>(
  props: ControlledInputProps<T>
) {
  const { name, control, rules } = props;
  const { field } = useController({ control, name, rules });
  const inputRefs = React.useRef<(TextInput | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const handleChangeText = (text: string, index: number) => {
    const otpValue = field.value || "";
    const newValue =
      otpValue.substring(0, index) + text + otpValue.substring(index + 1);
    field.onChange(newValue);

    if (text !== "") {
      const nextIndex = index + 1;
      if (nextIndex < inputRefs.current.length) {
        inputRefs.current[nextIndex]?.focus();
      }
    }
  };

  return (
    <View className="mt-5 flex-row justify-center">
      {Array.from({ length: 6 }, (_, index) => (
        <View
          key={index}
          className="mx-1 h-12 w-12 mr-2 items-center justify-center rounded-full border border-[#2A2661]"
        >
          <TextInput
            className="text-center text-xl"
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={(text) => handleChangeText(text, index)}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            value={(field.value || "")[index] || ""}
          />
        </View>
      ))}
    </View>
  );
}
export function ControlledEmailInput<T extends FieldValues>(
  props: ControlledInputProps<T>
) {
  const { name, control, rules, label = "Email" } = props;

  const { field } = useController({ control, name, rules });

  return (
    <>
      <Text className="text-grey-100 my-2 text-lg">{label}</Text>
      <View className="flex flex-row items-center rounded-xl border-[0.5px] h-[42px] border-neutral-300 bg-[#FAFAFA] px-2.5">
        <TextInput
          className="h-[50px] flex-1"
          placeholder="Email"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          onChangeText={field.onChange}
          value={(field.value as string) || ""}
        />
      </View>
    </>
  );
}
