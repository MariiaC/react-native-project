import React from "react";

import { createStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import LoginScreen from "../src/screens/authScreens/LoginScreen";
import RegistrationScreen from "../src/screens/authScreens/RegistrationScreen";
import PostsScreen from "./src/screens/nestedScreens/PostsScreen";
import CreatePostsScreen from "../src/screens/mainScreens/CreatePostsScreen";
import ProfileScreen from "../src/screens/mainScreens/ProfileScreen";
import Home from '../src/screens/mainScreens/Home';


// img
import PostsIcon from '../assets/images/grid.svg';
import CreatePostIcon from '../assets/images/union.svg';
import ProfileIcon from '../assets/images/user.svg';
import BackIcon from '../assets/images/arrow_left.svg';


const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

export const useRoute = (isAuth) => {
    const navigation = useNavigation();

    if (!isAuth) {
        return (
            <AuthStack.Navigator initialRouteName="Registration">
                <AuthStack.Screen name='Registration' component={RegistrationScreen} options={{ headerShown: false }} />
                <AuthStack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
            </AuthStack.Navigator>
        );
    }
    
    return (
        <MainTab.Navigator screenOptions={styles.mainTabContainer}>
            <MainTab.Screen name="Home" component={Home} options={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarIcon: ({ focused, color, size }) => (
                  
                    <View style={focused && styles.button} >
                        <PostsIcon stroke={focused ? "#fff" : "#212121"}/>
                    </View>
                )
            }} />
            <MainTab.Screen name="Create Post" component={CreatePostsScreen} options={{
                title: "Создать публикацию",
                headerTitleAlign: "center",
              
                tabBarShowLabel: false,
                tabBarIcon: ({ focused, color, size }) => (
                    <View style={focused && styles.button} >
                        <CreatePostIcon fill={focused ? "#fff" : "#212121"}/>
                    </View>
                ),
                headerLeft: () => (
                    <Pressable onPress={() => navigation.goBack()}>
                   
                        <BackIcon style={{ marginLeft: 20 }} />
                    </Pressable>
                ),
            }} />
            <MainTab.Screen name="Profile" component={ProfileScreen} options={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarIcon: ({ focused, color, size }) => (
                    <View style={focused && styles.button} >
                        <ProfileIcon stroke={focused ? "#fff" : "#212121"} />
                    </View>
                )
            }} />
        </MainTab.Navigator>
    );
}

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        alignItems: "center",
        width: 70,
        height: 40,
        backgroundColor: "#FF6C00",
        borderRadius: 20
    },
    mainTabContainer: {
        tabBarStyle: {
            height: 58,
            paddingTop: 9,
            paddingBottom: 9,
           
        },
    }
})