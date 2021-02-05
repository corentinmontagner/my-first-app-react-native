import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from '../Contexts/AuthContext';

function HomeScreen({ navigation }) {

const { signOut } = React.useContext(AuthContext)

  const logout = async () => {
    try {
      await AsyncStorage.clear()
      signOut()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
          title='Go to Screen2'
          onPress={() => navigation.navigate('Screen2')} />
      <Button
          title='Logout'
          onPress={() => logout()} />
    </View>
  );
  }

export default HomeScreen
