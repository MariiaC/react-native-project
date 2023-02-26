import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Camera, CameraType } from "expo-camera";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Location from "expo-location";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Keyboard,
  ScrollView,
  Pressable,
} from "react-native";
import db from "../../../firebase/config";
import * as MediaLibrary from "expo-media-library";
import { db, storage } from "../../../firebase/config";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

// images
import CameraIcon from "../../../assets/images/camera.svg";
import CameraWhiteIcon from "../../../assets/images/camera_white.svg";
import MapPinIcon from "../../../assets/images/map_pin.svg";
import TrashIcon from "../../../assets/images/trash.svg";
import TrashIconActive from "../../../assets/images/trash_active.svg";

const postPhoto = require("../../../assets/images/wood.jpg");

const CreatePostsScreen = ({ navigation, route }) => {
  const [snap, setSnap] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [photo, setPhoto] = useState(null);

  const [title, setIsTitle] = useState("");
  const [address, setIsAddress] = useState("");
  const [isFocusInputTitle, setIsFocusInputTitle] = useState(false);
  const [isFocusInputAddress, setIsFocusInputAdress] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const userId = useSelector((state) => state.authSlice.userId);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
      }

      let location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setLocation(coords);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: {
        display: "none",
      },
    });
    return () =>
      navigation.setOptions({
        tabBarStyle: {
          height: 58,
          paddingTop: 9,
          paddingBottom: 9,
        },
      });
  }, [navigation]);

  useEffect(() => {
    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height;

    width > height ? setIsLandscape(true) : setIsLandscape(false);
  }, []);

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width;
      const height = Dimensions.get("window").height;

      width > height ? setIsLandscape(true) : setIsLandscape(false);
    };

    const dimensionsHandler = Dimensions.addEventListener("change", onChange);

    return () => {
      dimensionsHandler.remove();
    };
  }, []);

  let text = "Waiting..";

  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const uploadPhotoToServer = async () => {
    try {
      const response = await fetch(photo);

      const file = await response.blob();

      const uniquePostId = Date.now().toString();

      const storageRef = await ref(storage, `postsImages/${uniquePostId}`);
      console.log("storageRef", storageRef);

      await uploadBytes(storageRef, file).then((photo) =>
        console.log("Uploaded a blob photo", photo)
      );

      const downloadedPhoto = await getDownloadURL(storageRef)
        .then((data) => data)
        .catch((error) => {
          console.log(error);
        });

      console.log("downloadedPhoto:", downloadedPhoto);

      return downloadedPhoto;
    } catch (error) {
      console.error(error);
    }
  };

  const uploadPostToServer = async () => {
    try {
      const photo = await uploadPhotoToServer();

      const post = {
        userId,
        photo,
        title,
        address,
        location,
        likes: 0,
      };

      // console.log(post);

      const createPost = await addDoc(collection(db, "posts"), post);
      console.log("Document written with ID: ", createPost);
    } catch (error) {
      console.error(error);
    }
  };

  const takePhoto = async () => {
    const photo = await snap.takePictureAsync();

    setPhoto(photo.uri);
  };

  const updatephoto = () => {
    setPhoto("");
  };

  const inputHandlerTitle = (text) => {
    setIsTitle(text);
  };

  const onFocusInputTitle = () => {
    setIsFocusInputTitle(true);
  };

  const onBlurInputTitle = () => {
    setIsFocusInputTitle(false);
  };

  const inputHandlerAddress = (text) => {
    setIsAddress(text);
  };

  const onFocusInputAddress = () => {
    setIsFocusInputAdress(true);
  };

  const onBlurInputAddress = () => {
    setIsFocusInputAdress(false);
  };

  const onPressPublishBtn = async () => {
    console.log("onPressPublishBtn");

    setPhoto("");

    setIsTitle("");
    setIsAddress("");

    Keyboard.dismiss();

    await uploadPostToServer();

    navigation.navigate("Posts");
  };

  const onPressDeleteBtn = () => {
    console.log("onPressDeleteBtn");

    photo && setPhoto("");
    title && setIsTitle("");
    address && setIsAddress("");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.wrraper}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <ScrollView>
            <Pressable
              style={
                isLandscape
                  ? { ...styles.content, alignItems: "center" }
                  : styles.content
              }
            >
              <View style={styles.public}>
                <View
                  style={
                    isLandscape
                      ? { ...styles.wrraperImage, width: 350 }
                      : styles.wrraperImage
                  }
                >
                  <Camera
                    style={
                      isLandscape
                        ? { ...styles.wrraperImage, width: 350 }
                        : styles.wrraperImage
                    }
                    type={type}
                    ref={setSnap}
                  >
                    {!!photo ? (
                      <Image
                        source={{ uri: photo }}
                        style={
                          isLandscape
                            ? { ...styles.postImage, width: 350 }
                            : styles.postImage
                        }
                      />
                    ) : null}
                    {!photo ? (
                      !location ? null : (
                        <TouchableOpacity
                          style={styles.camera}
                          onPress={takePhoto}
                        >
                          <CameraIcon
                            style={styles.cameraIcon}
                            width={24}
                            height={24}
                          />
                        </TouchableOpacity>
                      )
                    ) : (
                      <TouchableOpacity
                        style={{
                          ...styles.camera,
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                        }}
                        onPress={updatephoto}
                      >
                        <CameraWhiteIcon
                          style={styles.cameraIcon}
                          width={24}
                          height={24}
                        />
                      </TouchableOpacity>
                    )}
                  </Camera>
                </View>
                {!photo ? (
                  <Text
                    style={
                      isLandscape
                        ? { ...styles.info, textAlign: "left" }
                        : styles.info
                    }
                  >
                    Download Photo
                  </Text>
                ) : (
                  <Text
                    style={
                      isLandscape
                        ? { ...styles.info, textAlign: "left" }
                        : styles.info
                    }
                  >
                    Edit Photo
                  </Text>
                )}

                <TextInput
                  style={
                    isFocusInputTitle
                      ? { ...styles.input, ...onFocus }
                      : styles.input
                  }
                  onChangeText={inputHandlerTitle}
                  placeholder="Name..."
                  textAlign="left"
                  value={title}
                  placeholderTextColor="#BDBDBD"
                  onFocus={onFocusInputTitle}
                  onBlur={onBlurInputTitle}
                />
                <View style={styles.inputAddress}>
                  <MapPinIcon
                    style={
                      isFocusInputAddress
                        ? { ...styles.addressIcon, ...onFocus }
                        : styles.addressIcon
                    }
                    width={24}
                    height={24}
                  />
                  <TextInput
                    style={
                      isFocusInputAddress
                        ? { ...styles.input, ...onFocus, ...styles.address }
                        : { ...styles.input, ...styles.address }
                    }
                    onChangeText={inputHandlerAddress}
                    placeholder="Location..."
                    textAlign="left"
                    value={address}
                    placeholderTextColor="#BDBDBD"
                    onFocus={onFocusInputAddress}
                    onBlur={onBlurInputAddress}
                  />
                </View>

                <TouchableOpacity
                  style={
                    !!title & !!address
                      ? { ...styles.publishBtn, backgroundColor: "#FF6C00" }
                      : styles.publishBtn
                  }
                  activeOpacity={!!title & !!address ? 0.2 : 1}
                  onPress={!!title & !!address ? onPressPublishBtn : null}
                >
                  <Text
                    style={
                      !!title & !!address
                        ? { ...styles.publishBtnText, color: "#FFFFFF" }
                        : styles.publishBtnText
                    }
                  >
                    Publish
                  </Text>
                </TouchableOpacity>

                <View style={styles.deleteBtnWrraper}>
                  <TouchableOpacity
                    style={
                      !!title || !!address
                        ? { ...styles.deleteBtn, backgroundColor: "#FF6C00" }
                        : styles.deleteBtn
                    }
                    activeOpacity={!!title || !!address ? 0.2 : 1}
                    onPress={!!title || !!address ? onPressDeleteBtn : null}
                  >
                    {!!title || !!address ? (
                      <TrashIconActive width={24} height={24} />
                    ) : (
                      <TrashIcon width={24} height={24} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    fontFamily: "Roboto-Medium",

  },
  wrraper: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
  
  },
  public: {
    flex: 1,
  },
  wrraperImage: {
    position: "relative",
    height: 240,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    backgroundColor: "#F6F6F6",

    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  camera: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: [{ translateX: -30 }, { translateY: -30 }],
    width: 60,
    height: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    fill: "#BDBDBD",
  },
  postImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    borderRadius: 8,
    resizeMode: "cover",
  },
  info: {
    marginTop: 8,
    fontFamily: "Roboto-Medium",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
  },
  input: {
    marginTop: 32,
    fontFamily: "Roboto-Medium",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
  },
  inputAddress: {
    position: "relative",
    marginTop: 16,
  },
  address: {
    marginTop: 0,
    paddingLeft: 28,
  },
  addressIcon: {
    stroke: "#BDBDBD",
    position: "absolute",
    top: 13,
  },
  publishBtn: {
    marginTop: 32,
    paddingVertical: 16,
    backgroundColor: "#F6F6F6",
    borderRadius: 100,
  },
  publishBtnText: {
    fontFamily: "Roboto-Medium",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    color: "#BDBDBD",
  },
  deleteBtnWrraper: {
    alignItems: "center",
  },
  deleteBtn: {
    marginTop: 120,
    width: 70,
    height: 40,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#F6F6F6",
    borderRadius: 100,
  },
});

export default CreatePostsScreen;

// // from goIT video
// const takePhoto = async () => {
//   const { uri } = await snap.takePictureAsync();
//   setPhoto(uri);
// };

//  const sendPhoto = () => {
//   uploadPostToServer();
//   navigation.navigate("DefaultScreen");
// };

// const uploadPostToServer = async () => {
//   const photo = await uploadPhotoToServer();
//   const createPost = await db
//     .firestore()
//     .collection("posts")
//     .add({ photo, comment, location: location.coords, userId, username });
// };

// const uploadPhotoToServer = async () => {
//   const response = await fetch(photo);
//   const file = await response.blob();
//   const uniquePostId = Date.now().toString();
//   await db.storage().ref(`postImage/${uniquePostId}`).put(file);
//   const processedPhoto = await db
//     .storage()
//     .ref("postImage")
//     .child(uniquePostId)
//     .getDownloadURL();
//   return processedPhoto;
// };

// const takePhoto = async () => {
//   const photo = await camera.takePictureAsync();
//   const location = await Location.getCurrentPositionAsync();
//   console.log("location", location.coords.latitude);
//   console.log("location", location.coords.longitude);
//   setPhoto(photo.uri);
//   console.log("photo", photo);
//    };

// const sendPhoto=()=>{
//    console.log("navigation", navigation);
//   navigation.navigate("HomeScreen", {photo})
// } ;
