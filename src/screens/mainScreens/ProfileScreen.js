import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import {
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  SafeAreaView,
  Platform,
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { authSignOutUser } from "../../../redux/auth/authOperations";

import { authSlice } from "../../../redux/auth/authReducer";

import { updateProfile } from "firebase/auth";
import { db, storage, auth } from "../../../firebase/config";
import {
  collection,
  getDocs,
  doc,
  onSnapshot,
  where,
  query,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
// img
import AvatarAddIcon from "../../../assets/images/add.svg";
import AvatarDeleteIcon from "../../../assets/images/close.svg";
import LogOutIcon from "../../../assets/images/logout.svg";
import CommentsIconFill from "../../../assets/images/message_circle_fill.svg";
import ThumbsUpIcon from "../../../assets/images/thumbs_up.svg";
import MapPinIcon from "../../../assets/images/map_pin.svg";

const photoBG = require("../../../assets/images/photoBG.jpg");
const avatarPhoto = require("../../../assets/images/avatarPhoto.jpg");

const ProfileScreen = ({ navigation, route }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get("window").width);
  const [isLandscape, setIsLandscape] = useState(false);

  const [avatarUser, setAvatarUser] = useState("");
  const [isAvatarUser, setIsAvatarUser] = useState(false);

  const [posts, setPosts] = useState([]);

  const userLogin = useSelector((state) => state.authSlice.userLogin);
  const userId = useSelector((state) => state.authSlice.userId);

  const dispatch = useDispatch();

  useEffect(() => {
    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height;

    width > height ? setDimensions(width) : setDimensions(height);
    width > height ? setIsLandscape(true) : setIsLandscape(false);
  }, []);

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

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const posts = await onSnapshot(
        query(collection(db, "posts"), where("userId", "==", userId)),
        (post) => {
         
          setPosts(post.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
          
        }
      );
     
    } catch (error) {
      console.log(error);
    }
  };

  const uploadPhotoToServer = async (deviceImage) => {
    try {
      console.log("uploadPhotoToServer deviceImage", deviceImage);
      const response = await fetch(deviceImage);
      // console.log("response:", response);
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

  const pickImageAsync = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        console.log("result image", result.assets[0].uri);
        setAvatarUser(result.assets[0].uri);
        return result.assets[0].uri;
      } else {
        alert("You did not select any image.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onPressBtnAvatar = async (event) => {
    try {
      if (isAvatarUser) {
        // console.log("Deleted avatar");
        setAvatarUser("");
        setIsAvatarUser(false);
      } else {
        const deviceImage = await pickImageAsync();
        
        const avatarPhoto = await uploadPhotoToServer(deviceImage);
        console.log("avatarPhoto", avatarPhoto);

        await updateProfile(auth.currentUser, {
    
          photoURL: avatarPhoto,
        })
          .then(() => {
            console.log("Profile updated!");
          })
          .catch((error) => {
            console.log("An error occurred");
          });

        const user = await auth.currentUser;

        dispatch(
          authSlice.actions.updateUserProfile({
            userId: user.uid,
            userLogin: user.displayName,
            userEmail: user.email,
            userAvatar: user.photoURL,
          })
        );
        console.log("Added avatar");
        await setIsAvatarUser(true);
       
      }
     
    } catch (error) {
      console.log(error);
    }
  };

  const logOut = () => {
    dispatch(authSignOutUser());
    console.log("Logout");
  };
  const addLike = () => {
    console.log("addLike");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <Image
          source={photoBG}
          style={
            !isLandscape ? styles.imgBg : { ...styles.imgBg, width: dimensions }
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
                  ? styles.profile
                  : { ...styles.profile, marginTop: 80 }
              }
            >
              <View style={styles.avatar}>

                {isAvatarUser && avatarUser ? (
               
                  <Image
                    source={{ uri: avatarUser }}
                    style={styles.avatarImg}
                  />
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

              <Pressable style={styles.logOut} onPress={logOut}>
                <LogOutIcon style={{ marginRight: 20 }} />
              </Pressable>

              <Text style={styles.login}>{userLogin}</Text>

              <View
                style={
                  isLandscape
                    ? { ...styles.posts, alignItems: "center" }
                    : styles.posts
                }
              >
                {console.log("posts", posts)}
                {posts.map((item, index) => (
                  <View
                    key={item.id}
                    style={
                      item[index] === posts.length - 1
                        ? { ...styles.post, marginBottom: 0 }
                        : styles.post
                    }
                  >
                
                    <Image
                      source={{ uri: item.photo }}
                      style={
                        isLandscape
                          ? { ...styles.postImage, width: 350 }
                          : styles.postImage
                      }
                    />
                    <Text style={styles.title}>{item.title}</Text>

                    <View style={styles.postInfo}>
                      <View style={styles.postFollowers}>
                        <Pressable
                          style={styles.comments}
                          onPress={() =>
                            navigation.navigate("Comments", {
                              postId: item.id,
                              photo: item.photo,
                            })
                          }
                        >
                          <CommentsIconFill
                            style={styles.commentsIcon}
                            width={24}
                            height={24}
                          />
                          
                          <Text style={styles.commentsCount}>0</Text>
                        </Pressable>
                        <Pressable style={styles.likes} onPress={addLike}>
                          <ThumbsUpIcon
                            style={styles.likesIcon}
                            width={24}
                            height={24}
                          />
                        
                          <Text style={styles.likesCount}>{item.likes}</Text>
                        </Pressable>
                      </View>
                      <Pressable
                        style={styles.addressInfo}
                        onPress={() =>
                          navigation.navigate("Map", {
                            location: item.location,
                          })
                        }
                      >
                        <MapPinIcon
                          style={styles.addressIcon}
                          width={24}
                          height={24}
                        />
                        <Text style={styles.address}>{item.address}</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
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
  imgBg: {
    flex: 1,
    resizeMode: "cover",

    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  profile: {
    backgroundColor: "#fff",
    position: "relative",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 92,
    paddingBottom: 78,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,

    marginTop: 147,

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
  logOut: {
    position: "absolute",
    top: 22,
    right: 0,
  },
  login: {
    fontFamily: "Roboto-Bold",
    fontWeight: "500",
    fontSize: 30,
    lineHeight: 35,
    textAlign: "center",
    letterSpacing: 0.01,
    color: "#212121",
  },
  posts: {
    // flex: 1,
    marginTop: 32,
    width: "100%",
  },
  post: {
    marginBottom: 32,
  },
  postImage: {
    width: "100%",
    height: 240,
    borderRadius: 8,
    resizeMode: "cover",
  },
  title: {
    fontFamily: "Roboto-Medium",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 19,
    marginTop: 8,
  },
  postInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 11,
  },
  postFollowers: {
    flexDirection: "row",
  },
  comments: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentsCount: {
    fontFamily: "Roboto-Medium",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
    marginLeft: 6,
  },
  likes: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 24,
  },
  likesIcon: {},
  likesCount: {
    fontFamily: "Roboto-Medium",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
    marginLeft: 6,
  },
  addressInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressIcon: {
    stroke: "#BDBDBD",
  },
  address: {
    fontFamily: "Roboto-Medium",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "right",
    textDecorationLine: "underline",
    color: "#212121",
    marginLeft: 4,
  },
});

export default ProfileScreen;
