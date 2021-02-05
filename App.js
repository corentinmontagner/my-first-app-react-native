/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './App/Containers/HomeScreen'
import Screen2 from './App/Containers/Screen2'

import LoginScreen from './App/Containers/Login'
import RegisterScreen from './App/Containers/Register'

import { AuthContext } from './App/Contexts/AuthContext'

import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator()

const client = new ApolloClient({
  uri: 'https://tranquil-hamlet-59487.herokuapp.com/graphql',
  cache: new InMemoryCache()
})

  // const getToken = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('token')
  //     if(token) {
  //       return token
  //     } else {
  //       return null
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

const App: () => React$Node = () => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch(action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false
          }
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token
          }
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null
          }
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null
    }
  )

  // Equivalent à un DidMount ou un WillMount
  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken
      try {
        userToken = await AsyncStorage.getItem('userToken')
      } catch (error) {
        console.error(error)
      }

      dispatch({type: 'RESTORE_TOKEN', token: userToken})
    }

    bootstrapAsync()
  }, [])

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // Mise à jour de l'action SIGN_IN
        dispatch({ type: 'SIGN_IN', token: data})
      },
      signOut: () => dispatch({ type: 'SIGN_OUT'}),
      signUp: async data => {
        // Enregistrement
        dispatch({ type: 'SIGN_IN', token: 'fake-token'})
      }
    }),
    []
  )

  return (
    <AuthContext.Provider value={authContext}>
      <ApolloProvider client={client}>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" />
            {
              state.userToken
              ? (
                <Stack.Navigator>
                  <Stack.Screen name='HomeScreen' component={HomeScreen} />
                  <Stack.Screen name='Screen2' component={Screen2} />
                </Stack.Navigator>
              )
              : (
                <Stack.Navigator>
                  <Stack.Screen name='Login' component={LoginScreen} />
                  <Stack.Screen name='Register' component={RegisterScreen} />
                </Stack.Navigator>
              )
            }
        </NavigationContainer>
      </ApolloProvider>
    </AuthContext.Provider>
    
    
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10
  }
});

export default App;
