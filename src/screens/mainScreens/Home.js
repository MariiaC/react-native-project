import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image,Button } from "react-native";
import db from '../../../firebase/config'
import { createStackNavigator } from '@react-navigation/stack';

import { useDispatch } from 'react-redux';
import { authSignOutUser } from '../../redux/auth/authOperations';

import PostsScreen from './PostsScreen';
import CommentsScreen from '../nestedScreens/CommentsScreen';
import MapScreen from '../nestedScreens/MapScreen';

// img
import BackIcon from '../../../assets/images/arrow_left.svg';
import LogOutIcon from '../../../assets/images/logout.svg';

const Home = (props) => {
 const dispatch = useDispatch();

    const logOut = () => {
        dispatch(authSignOutUser());
        console.log('Logout');
    }
  // console.log("route.params", route.params);


  return (
        <NestedScreenStack.Navigator>
            <NestedScreenStack.Screen name='Posts' component={PostsScreen} options={{
                title: "Posts",
                headerTitleAlign: "center",
                headerBackAccessibilityLabel: false,
                headerRight: () => (
                    <Pressable onPress={logOut}>
                        <LogOutIcon style={{ marginRight: 20 }} />
                    </Pressable>
                ),
            }} />
            <NestedScreenStack.Screen name='Comments' component={CommentsScreen} options={{
                title: "Comments",
                tabBarVisible: false,
                headerTitleAlign: "center",
                headerBackTitleVisible: false,
                headerBackImage: () => (
                    <BackIcon style={{ marginLeft: 20 }} />
                ),
            }}/>
            <NestedScreenStack.Screen name='Map' component={MapScreen} options={{
                title: "Map",
                headerTitleAlign: "center",
                headerBackTitleVisible: false,
                headerBackImage: () => (
                    <BackIcon style={{ marginLeft: 20 }} />
                ),
            }}/>
        </NestedScreenStack.Navigator>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        fontFamily: 'Roboto-Medium',
        justifyContent: "center",
        alignItems: "center"
    },
});

export default Home;
