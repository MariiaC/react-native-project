import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  TouchableWithoutFeedback,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Keyboard,
  ScrollView,
  Pressable,
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";


import { db } from "../../../firebase/config";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";

// img
import CommentsIcon from "../../../assets/images/message_circle.svg";
import MapPinIcon from "../../../assets/images/map_pin.svg";

const avatarPhoto = require("../../../assets/images/avatar.jpg");

const PostsScreen = ({ navigation, route }) => {
  const [isLandscape, setIsLandscape] = useState(false);
  const [posts, setPosts] = useState([]);

  const userLogin = useSelector((state) => state.authSlice.userLogin);
  const userEmail = useSelector((state) => state.authSlice.userEmail);

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


  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const posts = await onSnapshot(collection(db, "posts"), (data) => {

        setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.wrraper}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <ScrollView>
            <Pressable style={styles.content}>
              <View style={styles.userInfo}>
                <Image source={avatarPhoto} style={styles.avatarImage} />
                <View style={styles.user}>
                  <Text style={styles.name}>{userLogin}</Text>
                  <Text style={styles.email}>{userEmail}</Text>
                </View>
              </View>
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
                      <Pressable
                        style={styles.comments}
                        onPress={() =>
                          navigation.navigate("Comments", {
                            postId: item.id,
                            photo: item.photo,
                          })
                        }
                      >
                        <CommentsIcon
                          style={styles.commentsIcon}
                          width={24}
                          height={24}
                        />
          
                        <Text style={styles.commentsCount}>0</Text>
                      </Pressable>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 16,
  },
  user: {
    marginLeft: 8,
  },
  name: {
    fontFamily: "Roboto-Bold",
    fontWeight: "700",
    fontSize: 13,
    lineHeight: 15,
    color: "#212121",
  },
  email: {
    fontFamily: "Roboto-Medium",
    fontWeight: "400",
    fontSize: 11,
    lineHeight: 13,
    color: "rgba(33, 33, 33, 0.8)",
  },
  posts: {
    flex: 1,
    marginTop: 32,
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
  comments: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentsCount: {
    fontFamily: "Roboto-Medium",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
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

export default PostsScreen;
