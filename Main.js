import React, { useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
// import { useRoute } from "./router";
import AuthStackNavigator from './router/AuthStackNavigator';
 import MainTabNavigator from './router/MainTabNavigator';

// import { db, auth } from './firebase/config';
// import { getAuth, onAuthStateChanged } from "firebase/auth";

import { authStateChangeUser } from './redux/auth/authOperations';


const Main = () => {

    const stateChange = useSelector(state => state.authSlice.stateChange);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(authStateChangeUser());
    }, [dispatch]);
  
    return (
        <NavigationContainer
          
        >
            {/* {routing} */}
            {stateChange ?
                <MainTabNavigator />
                :
                <AuthStackNavigator />
            }
        </NavigationContainer>
    )
};

export default Main;
  
  

  // const routing = useRoute(stateChange);

  // return <NavigationContainer>{routing}</NavigationContainer>;


    // const [user, setUser] = useState(null);
    // const state = useSelector((state) => state);
    // console.log(state)
    // db.auth().onAuthStateChanged((user) => setUser(user))
    // const routing = useRoute(user);
    // useEffect(() => { }, []);
    // return <NavigationContainer>{routing}</NavigationContainer>;
    

