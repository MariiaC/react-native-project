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
  TextInput,
  TouchableOpacity,
} from "react-native";

import { db, storage } from "../../../firebase/config";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  where,
  query,
} from "firebase/firestore";
// img
import VectorIcon from "../../../assets/images/vector.svg";


const avatarPhoto = require("../../../assets/images/avatarPhoto.jpg");
const ellipsePhoto = require("../../../assets/images/ellipse.jpg");

const postPhoto = require("../../../assets/images/black_sea.jpg");


// const width = Dimensions.get("window").width;

const CommentsScreen = ({ navigation, route }) => {
  const [isLandscape, setIsLandscape] = useState(false);
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [comment, setComment] = useState("");

  const [isFocusInputComment, setIsFocusInputComment] = useState(false);

  const userId = useSelector((state) => state.authSlice.userId);


  useEffect(() => {
    if (route.params === undefined) {
      return;
    }
    const { postId } = route.params;
    setPostId(postId);
  }, [route.params]);

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: "none",
      },
    });
    return () =>
      navigation.getParent()?.setOptions({
     
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

  useEffect(() => {
    getComments();
  }, []);

  const getComments = async () => {
    try {
        const docRef = doc(db, "posts", route.params.postId);
      const commentsRef = collection(docRef, "comments");
      const newComment = await onSnapshot(commentsRef, (data) => {
       
        setComments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
    } catch (error) {
      console.log(error);
    }
  };

  const inputHandlerComment = (text) => {
    setComment(text);
    console.log(text);
  };

  const onFocusInputComment = () => {
    setIsFocusInputComment(true);
  };

  const onBlurInputComment = () => {
    setIsFocusInputComment(false);
  };

  const addCommentHandler = async () => {
    try {
      setIsFocusInputComment(false);

      if (!comment) {
        return;
      }

      const nowDate = new Date();
      const day = nowDate.getDate();
      const numberOfMonth = nowDate.getMonth();
      const month = await transformMonth(numberOfMonth);
      const year = nowDate.getFullYear();
      const hours = nowDate.getHours();
      const minutes = nowDate.getMinutes().toString().padStart(2, 0);
      const dateText = `${day} ${month}, ${year} | ${hours}:${minutes}`;

      const commentPost = {
        text: comment,
        date: dateText,
        postId,
        owner: userId,
      };

      setComment("");

      const docRef = doc(db, "posts", postId);
      const commentsRef = collection(docRef, "comments");
      const newComment = await addDoc(commentsRef, commentPost);
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
            <Pressable
              style={
                isLandscape
                  ? { ...styles.content, alignItems: "center" }
                  : styles.content
              }
            >
              {route.params === undefined ? (
                <Image
                  source={postPhoto}
                  style={
                    isLandscape
                      ? { ...styles.postImage, width: 350 }
                      : styles.postImage
                  }
                />
              ) : (
                <Image
                  source={{ uri: route.params.photo }}
                  style={
                    isLandscape
                      ? { ...styles.postImage, width: 350 }
                      : styles.postImage
                  }
                />
              )}

              <View style={styles.comments}>
                {comments.map((item, index) => (
                  <View
                    key={item.id}
                    style={
                      index % 2
                        ? {
                            ...styles.commentInfo,
                            flexDirection: "row-reverse",
                            width: isLandscape ? 350 : "100%",
                          }
                        : {
                            ...styles.commentInfo,
                            width: isLandscape ? 350 : "100%",
                          }
                    }
                  >
                    {item.avatar === undefined ? (
                      <Image source={ellipsePhoto} style={styles.avatar} />
                    ) : (
                      <Image
                        source={{ uri: item.avatar }}
                        style={styles.avatar}
                      />
                    )}

                    <View
                      style={
                        index % 2
                          ? {
                              ...styles.comment,
                              marginLeft: 0,
                              marginRight: 16,
                              borderTopRightRadius: 0,
                              borderTopLeftRadius: 6,
                            }
                          : styles.comment
                      }
                    >
                      <Text style={styles.text}>{item.text}</Text>
                      <Text
                        style={
                          index % 2
                            ? { ...styles.date, textAlign: "left" }
                            : styles.date
                        }
                      >
                        {item.date}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              <View
                style={
                  isLandscape
                    ? { ...styles.addComment, width: 350 }
                    : { ...styles.addComment, width: "100%" }
                }
              >
                <TextInput
                  style={
                    isFocusInputComment
                      ? {
                          ...styles.input,
                          ...onFocus,
                          width: isLandscape ? 350 : "100%",
                        }
                      : { ...styles.input, width: isLandscape ? 350 : "100%" }
                  }
                  onChangeText={inputHandlerComment}
                  placeholder="Comment..."
                  textAlign="left"
                  inputMode="text"
                  value={comment}
                  placeholderTextColor="#BDBDBD"
                  onFocus={onFocusInputComment}
                  onBlur={onBlurInputComment}
                />

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addCommentHandler}
                >
                  <VectorIcon width={10} height={14} />
                </TouchableOpacity>
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
  },
  wrraper: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  postImage: {
    // flex: 1,
    width: "100%",
    height: 240,
    borderRadius: 8,
    resizeMode: "cover",
  },
  comments: {
    marginTop: 32,
  },
  commentInfo: {
    flexDirection: "row",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 50,
  },
  comment: {
    flex: 1,

    padding: 16,
    marginLeft: 16,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderBottomLeftRadius: 6,
    marginBottom: 24,
  },
  text: {
    fontFamily: "Roboto-Medium",
    fontWeight: "400",
    fontSize: 13,
    lineHeight: 18,
    color: "#212121",
  },
  date: {
    marginTop: 8,
    fontFamily: "Roboto-Medium",
    fontWeight: "400",
    fontSize: 10,
    lineHeight: 12,
    textAlign: "right",
    color: "#BDBDBD",
  },
  addComment: {
    marginTop: 7,

    position: "relative",
  },
  input: {
    height: 50,
    backgroundColor: "#F6F6F6",
    fontFamily: "Roboto-Medium",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
    padding: 15,
    paddingRight: 50,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 100,
  },
  addButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 34,
    height: 34,
    borderRadius: 50,
    backgroundColor: "#FF6C00",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CommentsScreen;
