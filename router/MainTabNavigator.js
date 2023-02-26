import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Home from '../src/screens/mainScreens/Home';
import CreatePostsScreen from '../src/screens/mainScreens/CreatePostsScreen';
import ProfileScreen from '../src/screens/mainScreens/ProfileScreen';
// img
import PostsIcon from '../assets/images/grid.svg';
import CreatePostIcon from '../assets/images/union.svg';
import ProfileIcon from '../assets/images/user.svg';
import BackIcon from '../assets/images/arrow_left.svg';


const MainTab = createBottomTabNavigator();

const MainTabNavigator = () => {


    const navigation = useNavigation();

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
                headerLeft: () => {
                 
                    return (
                       
                        <Pressable onPress={() => navigation.goBack()}>
                            <BackIcon style={{ marginLeft: 20 }} />
                        </Pressable>
                        
                    )
                },
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
    )
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

export default MainTabNavigator;