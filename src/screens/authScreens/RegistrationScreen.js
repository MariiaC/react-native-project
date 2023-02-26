import React, { useState, useEffect } from "react";
// import { StatusBar } from "expo-status-bar";
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
import Svg, { Path } from "react-native-svg";
import { authSignUpUser } from "../../../redux/auth/authOperations";
// img
import AvatarAddIcon from "../../../assets/images/add.svg";
import AvatarDeleteIcon from "../../../assets/images/close.svg";


const photoBG = require("../../../assets/images/photoBG.jpg");
const avatarPhoto = require(" ../../../assets/images/avatarPhoto.jpg");

const initialState = {
  avatar: null,
  login: "",
  email: "",
  password: "",
};

export default function RegistrationScreen({ navigation }) {
  // const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);
  const [dimensions, setDimensions] = useState(Dimensions.get("window").width);
  // const [isReady, setIsready] = useState(false);

  const [avatarUser, setAvatarUser] = useState("");
  const [isAvatarUser, setIsAvatarUser] = useState(false);

  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isFocusInputLogin, setIsFocusInputLogin] = useState(false);
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
      dimensionsHandler.remove();
    };
  }, []);

  const onPressBtnAvatar = async (event) => {
    if (isAvatarUser) {
      console.log("Deleted avatar");

      setAvatarUser("");
      setIsAvatarUser(false);
    } else {
      console.log("Added avatar");

      setAvatarUser(avatarPhoto);
      setIsAvatarUser(true);
    }
  };

  const inputHandlerLogin = (text) => {
    setstate((prevState) => ({ ...prevState, login: text }));
    console.log(text);
  };

  const inputHandlerEmail = (text) => {
    setstate((prevState) => ({ ...prevState, email: text }));
    console.log(text);
  };

  const inputHandlerPassword = (text) => {
    setstate((prevState) => ({ ...prevState, password: text }));
    console.log(text);
  };

  const onFocusInputLogin = () => {
    setIsFocusInputLogin(true);
  };

  const onBlurInputLogin = (event) => {
    setIsFocusInputLogin(false);

    setLogin(event.nativeEvent.text);
    console.log(event.nativeEvent.text);
  };

  const onFocusInputEmail = () => {
    setIsFocusInputEmail(true);
  };

  const onBlurInputEmail = (event) => {
    setIsFocusInputEmail(false);

    setEmail(event.nativeEvent.text);
    console.log(event.nativeEvent.text);
  };

  const onFocusInputPassword = () => {
    setIsFocusInputPassword(true);
  };

  const onBlurInputPassword = (event) => {
    setIsFocusInputPassword(false);

    setPassword(event.nativeEvent.text);
  };

  const hiddenPassword = () => {
    setIsHiddenPassword(!isHiddenPassword);
  };

  const onPressBtnRegister = () => {
    console.log("Registration");
    Keyboard.dismiss();
    console.log(state);
    dispatch(authSignUpUser(state));
    setState(initialState);
  };

  const onPressLinkAuth = () => {
    console.log("Go to LoginScreen");
    navigation.navigate("Login");
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
                !isLandscape
                  ? styles.register
                  : { ...styles.register, marginTop: 80 }
              }
            >
              <View style={styles.avatar}>
                
                {isAvatarUser ? (
                  <Image source={avatarPhoto} style={styles.avatarImg} />
                ) : null}
              
                <Pressable
                  style={isAvatarUser ? styles.btnAvatarX : styles.btnAvatar}
                  onPress={onPressBtnAvatar}
                >
              
                  {isAvatarUser ? (
                 
                    <AvatarDeleteIcon width={11} height={11} />
                  ) : (
                    
                    <AvatarAddIcon width={13} height={13} />
                  )}
                
                </Pressable>
              </View>
              <Text style={styles.title}>Регистрация</Text>
              <TextInput
                style={
                  isFocusInputLogin
                    ? { ...styles.input, ...onFocus }
                    : styles.input
                }
                onChangeText={inputHandlerLogin}
                autoFocus={true}
                placeholder="Логин"
                textAlign="left"
                value={state.login}
                placeholderTextColor="#BDBDBD"
                textContentType="username"
                onFocus={onFocusInputLogin}
                onBlur={onBlurInputLogin}
              />
              <TextInput
                style={
                  isFocusInputEmail
                    ? { ...styles.input, ...onFocus }
                    : styles.input
                }
                onChangeText={inputHandlerEmail}
                placeholder="Адрес электронной почты"
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
                  placeholder="Пароль"
                  textAlign="left"
                  value={state.password}
                  placeholderTextColor="#BDBDBD"
                  textContentType="password"
                  secureTextEntry={isHiddenPassword}
                  onFocus={onFocusInputPassword}
                  onBlur={onBlurInputPassword}
                />
                <Text style={styles.hiddenPassword} onPress={hiddenPassword}>
                  {isHiddenPassword ? "Показать" : "Спрятать"}
                </Text>
              </View>
              <TouchableOpacity
                style={
                  !state.login || !state.email || !state.password
                    ? { ...styles.registerBtn, backgroundColor: "#F6F6F6" }
                    : styles.registerBtn
                }
                activeOpacity={
                  !!state.login || !!state.email || !!state.password ? 0.2 : 1
                }
                onPress={
                  !state.login || !state.email || !state.password
                    ? null
                    : onPressBtnRegister
                }
              >
                <Text
                  style={
                    !state.login || !state.email || !state.password
                      ? { ...styles.registerBtnText, color: "#BDBDBD" }
                      : styles.registerBtnText
                  }
                >
                  Зарегистрироваться
                </Text>
              </TouchableOpacity>
              <Text style={styles.linkAuth}>
                Уже есть аккаунт? <Text onPress={onPressLinkAuth}>Войти</Text>
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
    fontFamily: "Roboto-Medium",
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
    bottom: 0,
  },
  register: {
    backgroundColor: "#fff",
    position: "relative",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 92,
    paddingBottom: 78,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,

    marginTop: 263,

    flex: 1,

    justifyContent: "center",
  },
  avatar: {
    height: 120,
    width: 120,
    position: "absolute",
    top: -60,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
  },
  avatarImg: {
    borderRadius: 16,
    height: "100%",
    width: "100%",
  },
  btnAvatarWrraper: {
    position: "absolute",
    right: -37,
    bottom: -12,
  },
  btnAvatar: {
    height: 25,
    width: 25,

    position: "absolute",
    right: -12,
    bottom: 13,

    backgroundColor: "#fff",
    borderWidth: 1,

    borderRadius: 12.5,
    borderColor: "#FF6C00",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnAvatarX: {
    height: 25,
    width: 25,

    position: "absolute",
    right: -12,
    bottom: 13,

    backgroundColor: "#fff",
    borderWidth: 1,

    borderRadius: 12.5,
    borderColor: "#E8E8E8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarIconWrraper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,

    backgroundColor: "transparent",
    zIndex: 10,
  },
  avatarIcon: {
    height: 13,
    width: 13,
  },
  avatarAddIcon: {
    fill: "#FF6C00",
  },
  avatarIconX: {
    height: 13,
    width: 13,
  },
  avatarAddIconX: {
    fill: "#BDBDBD",
  },
  title: {
    fontFamily: "Roboto-Medium",
    fontWeight: "500",
    fontSize: 30,
    lineHeight: 35,
    textAlign: "center",
    letterSpacing: 0.01,
    color: "#212121",

    paddingBottom: 33,
  },
  input: {
    backgroundColor: "#F6F6F6",
    fontFamily: "Roboto-Medium",
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
    // top: 16,
    fontFamily: "Roboto-Medium",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "right",
    color: "#1B4371",
  },
  registerBtn: {
    width: "100%",
    maxWidth: 350,
    paddingVertical: 16,
    backgroundColor: "#FF6C00",
    borderRadius: 100,
    marginBottom: 16,
  },
  registerBtnText: {
    fontFamily: "Roboto-Medium",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    color: "#FFFFFF",
  },
  linkAuth: {
    fontFamily: "Roboto-Medium",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    color: "#1B4371",
  },
});
