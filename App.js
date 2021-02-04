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

const Stack = createStackNavigator()

const client = new ApolloClient({
  uri: 'https://tranquil-hamlet-59487.herokuapp.com/graphql',
  cache: new InMemoryCache()
})

const App: () => React$Node = () => {
  const isLoggedIn = false
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      {
        isLoggedIn
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
