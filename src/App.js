import React, { useState } from "react";
import { StatusBar, Image } from "react-native";
import { ThemeProvider } from "styled-components/native"; //consumer - > provider
import { theme } from "./theme";
import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import Navigation from "./navigations";
import { images } from "./utils/images";

const cacheImages = (images) => {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
};

const cacheFonts = (fonts) => {
  return fonts.map((font) => Font.loadAsync(font));
};

const App = () => {
  //화면에 뜨지않아도 미리미리 이미지와 폰트를 불러옴 화면에 조금더 느리지않게 부드럽게 적용하기위한 방법
  const [isReady, setIsReady] = useState(false);

  const _loadAsset = async () => {
    const imageAsset = cacheImages([
      require("../assets/splash.png"),
      ...Object.values(images),
    ]);
    const fontAsset = cacheFonts([]);

    await Promise.all([...imageAsset, ...fontAsset]);
  };

  return isReady ? (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle="light-content"></StatusBar>
      <Navigation />
    </ThemeProvider>
  ) : (
    <AppLoading
      startAsync={_loadAsset}
      onFinish={() => setIsReady(true)}
      onError={console.warn}
    />
  );
};

export default App;
