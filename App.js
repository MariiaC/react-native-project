import React, { useCallback } from "react";

// import { NavigationContainer } from '@react-navigation/native';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-redux';

import Main from './Main';
import { store } from './src/redux/store';

export default function App() {
   
    const [fontsLoaded] = useFonts({
        'Roboto-Regular': require("./assets/fonts/Roboto-Regular.ttf"),
        'Roboto-Medium': require("./assets/fonts/Roboto/Roboto-Medium.ttf"),
        'Roboto-Bold': require("./assets/fonts/Roboto/Roboto-Bold.ttf"),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);
  
  // console.log(onLayoutRootView)

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Provider store={store}>
            <Main />
        </Provider>
    );
}