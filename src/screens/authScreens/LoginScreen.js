import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  Button,
} from "react-native";

import { useDispatch } from "react-redux";
import { authSignInUser } from "../../../redux/auth/authOperations";
// import { useState, useEffect } from "react";
// import { StatusBar } from "expo-status-bar";

const photoBG = require("../../../assets/images/photoBG.jpg");

const initialState = {
  email: "",
  password: "",
};

export default function LoginScreen({ navigation }) {
  // const [keyboardShow, setKeyboardShow] = useState(false);
  // const [isReady, setIsready] = useState(false);
  const [state, setState] = useState(initialState);
  const [dimensions, setDimensions] = useState(Dimensions.get("window").width);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFocusInputEmail, setIsFocusInputEmail] = useState(false);
  const [isFocusInputPassword, setIsFocusInputPassword] = useState(false);
  const [isHiddenPassword, setIsHiddenPassword] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width;
      const height = Dimensions.get("window").height;

      width > height ? setDimensions(width) : setDimensions(height);
      width > height ? setIsLandscape(true) : setIsLandscape(false);
    };
    const dimensionsHandler = Dimensions.addEventListener("change", onChange);
    return () => {
      // Dimensions.removeEventListener("change", onChange);
      dimensionsHandler.remove();
    };
  }, []);

  // const handleSubmit = () => {
  //   setIsShowKeyboard(false);
  //   Keyboard.dismiss();
  //   // console.log(state);
  //   dispatch(authSignInUser(state));
  //   setState(initialState);
  // };

  // const keyboardHide = () => {
  //   Keyboard.dismiss();
  //   setIsShowKeyboard(false);
  // };

  const inputHandlerEmail = (text) => {
    setState((prevState) => ({ ...prevState, email: text }));
    console.log(email);
  };

  const inputHandlerPassword = (text) => {
    setState((prevState) => ({ ...prevState, password: text }));
    console.log(password);
  };

  const onFocusInputEmail = () => {
    setIsFocusInputEmail(true);
  };

  const onBlurInputEmail = (event) => {
    setIsFocusInputEmail(false);

    setEmail(event.nativeEvent.text);
    // console.log(event.nativeEvent.text);
  };

  const onFocusInputPassword = () => {
    setIsFocusInputPassword(true);
  };

  const onBlurInputPassword = (event) => {
    setIsFocusInputPassword(false);

    setPassword(event.nativeEvent.text);
    // console.log(event.nativeEvent.text);
  };

  const hiddenPassword = () => {
    setIsHiddenPassword(!isHiddenPassword);
  };

  const onPressBtnLogin = () => {
    Keyboard.dismiss();
    console.log(state);
    dispatch(authSignInUser(state));
    setState(initialState);
  };

  const onPressLinkRegistration = () => {
    navigation.navigate("Registration");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <Image
          source={photoBG}
          style={
            !isLandscape ? styles.photoBG : { ...styles.photoBG, width: dimensions }
          }
        />

        <KeyboardAvoidingView
          style={styles.wrraper}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <ScrollView>
            <Pressable
              style={
                !isLandscape ? styles.login : { ...styles.login, marginTop: 80 }
              }
            >
              <Text style={styles.title}>LOGIN</Text>
              <TextInput
                style={
                  isFocusInputEmail
                    ? { ...styles.input, ...onFocus }
                    : styles.input
                }
                onChangeText={inputHandlerEmail}
                placeholder="Email address"
                textAlign="left"
                value={state.email}
                placeholderTextColor="#BDBDBD"
                textContentType="emailAddress"
                onFocus={onFocusInputEmail}
                onBlur={onBlurInputEmail}
              />
              <View style={styles.wrraperPassword}>
                <TextInput
                  style={
                    isFocusInputPassword
                      ? { ...styles.input, ...styles.password, ...onFocus }
                      : { ...styles.input, ...styles.password }
                  }
                  onChangeText={inputHandlerPassword}
                  placeholder="Password"
                  textAlign="left"
                  value={state.password}
                  placeholderTextColor="#BDBDBD"
                  textContentType="password"
                  secureTextEntry={isHiddenPassword}
                  onFocus={onFocusInputPassword}
                  onBlur={onBlurInputPassword}
                />
                <Text style={styles.hiddenPassword} onPress={hiddenPassword}>
                  {isHiddenPassword ? "Show" : "Hide"}
                </Text>
              </View>
              <TouchableOpacity
                style={
                  !state.email || !state.password
                    ? { ...styles.loginBtn, backgroundColor: "#F6F6F6" }
                    : styles.loginBtn
                }
                activeOpacity={!!state.email || !!state.password ? 0.2 : 1}
                onPress={
                  !state.email || !state.password ? null : onPressBtnLogin
                }
              >
                <Text
                  style={
                    !state.email || !state.password
                      ? { ...styles.loginBtnText, color: "#BDBDBD" }
                      : styles.loginBtnText
                  }
                >
                  Login
                </Text>
              </TouchableOpacity>
              <Text style={styles.linkRegistration}>
                No account yet?{" "}
                <Text onPress={onPressLinkRegistration}>
                  Register
                </Text>
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        fontFamily: 'Roboto-Medium',
    },
    wrraper: {
        flex: 1,
    },
    photoBG: {
        flex: 1,
        resizeMode: "cover",
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    },
    login: {
      flex: 1,
        backgroundColor: "#fff",
        position: "relative",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 32,
        paddingBottom: 144,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
     
        marginTop: 323,
      

    },
    title: {
        fontFamily: 'Roboto-Medium',
        fontWeight: "500",
        fontSize: 30,
        lineHeight: 35,
        textAlign: "center",
        letterSpacing: 0.01,
        color: "#212121",
        // paddingTop: 92,
        paddingBottom: 33
    },
    input: {
        backgroundColor: "#F6F6F6",
        fontFamily: 'Roboto-Medium',
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 19,
        color: "#BDBDBD",
        padding: 16,
        borderWidth: 1,
        borderColor: "#E8E8E8",
        borderRadius: 8,
        width: "100%",
        maxWidth: 350,
        marginBottom: 16,
    },
    wrraperPassword: {
        width: "100%",
        maxWidth: 350,
        position: "relative",
    },
    password: {
        position: "relative",
        paddingRight: 87,
        marginBottom: 43,
    },
    hiddenPassword: {
        position: "absolute",
        padding: 16,
        right: 0,
        fontFamily: 'Roboto-Medium',
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 19,
        textAlign: "right",
        color: "#1B4371",
    },
    loginBtn: {
        width: "100%",
        maxWidth: 350,
        paddingVertical: 16,
        backgroundColor: "#FF6C00",
        borderRadius: 100,
        marginBottom: 16,
    },
    loginBtnText: {
        fontFamily: 'Roboto-Medium',
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 19,
        textAlign: "center",
        color: "#FFFFFF",
    },
    linkRegistration: {
        fontFamily: 'Roboto-Medium',
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 19,
        textAlign: "center",
        color: "#1B4371",
        
    }
});