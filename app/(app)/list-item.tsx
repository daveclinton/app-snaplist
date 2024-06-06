/* eslint-disable max-lines-per-function */
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet } from "react-native";

import type { FormType } from "@/components/login-form";
import {
  Button,
  ControlledNormalInput,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from "@/ui";
import * as ImagePicker from "expo-image-picker";

export default function ListItem() {
  const { handleSubmit, control } = useForm<FormType>({});
  const [image, setImage] = useState<any>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const [selectedMarketPlace, setSelectedMarketPlace] = useState();
  const [sliderValue, setSliderValue] = useState(50);
  const router = useRouter();
  const handleSliderValueChange = (value: React.SetStateAction<number>) => {
    setSliderValue(value);
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <FocusAwareStatusBar />
      <SafeAreaView>
        <View className="flex-1 px-6">
          <Text>Item Photos</Text>
          <Button label="Take Picture" variant="outline" />
          <Button label="Upload Picture" />
          <Text>Item Details</Text>
          <Button
            label="AI Suggestions"
            variant="outline"
            className="rounded-2xl"
            onPress={() => {
              router.push("/camera/camera-page");
            }}
          />
          <Text>Fill Item Details</Text>
          <ControlledNormalInput
            testID="email-input"
            control={control}
            name="username"
            label="Title"
          />
          <ControlledNormalInput
            testID="email-input"
            control={control}
            name="username"
            label="Description"
          />
          <ControlledNormalInput
            testID="email-input"
            control={control}
            name="username"
            label="Category"
          />
          <ControlledNormalInput
            testID="email-input"
            control={control}
            name="username"
            label="Condition"
          />
          <Text className="my-3">MarketPlace</Text>
          <Picker
            selectedValue={selectedMarketPlace}
            onValueChange={(itemValue) => setSelectedMarketPlace(itemValue)}
            style={styles.pickerStyle}
          >
            <Picker.Item label="Ebay" value="ebay" />
            <Picker.Item label="Facebook Market Place" value="Facebook" />
          </Picker>
          <Text className="my-3">Set Price</Text>
          <View>
            <Slider
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ width: "100%", height: 40 }}
              minimumValue={50}
              maximumValue={10000}
              minimumTrackTintColor="#2A2661"
              maximumTrackTintColor="#2A2661"
              thumbTintColor="#2A2661"
              value={sliderValue}
              onValueChange={handleSliderValueChange}
            />
            <View className="flex flex-row justify-between px-2">
              <Text>$ 50.00</Text>
              <Text>$ {sliderValue.toFixed(2)}</Text>
            </View>
          </View>
          <Button
            label="List Now"
            onPress={() => {
              handleSubmit;
            }}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pickerStyle: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 5,
    borderColor: "#D1D5DB",
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 10,
  },
});
