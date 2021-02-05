import * as React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { gql, useMutation } from '@apollo/client'

import styles from './Styles/LoginStyle'

import { AuthContext } from '../Contexts/AuthContext'

import { darkTheme } from '../Theme/Color'

const MUTATION_LOGIN = gql`
    mutation loginMutation(
        $input: UsersPermissionsLoginInput!
    ) {
        login(input: $input) {
            jwt
            user {
                id
                email
            }
        }
    }
`

const storeToken = async (token) => {
    try {
        await AsyncStorage.setItem('userToken', token)
    } catch (error) {
        console.error(error)
    }
}

const Login = ({ navigation }) => {
    const [username, setUsername] = React.useState('coco@gmail.com')
    const [password, setPassword] = React.useState('cocococo')

    const { signIn } = React.useContext(AuthContext);

    const [login] = useMutation(MUTATION_LOGIN, {
        variables: {
            input: {
                identifier: username,
                password: password, 
                provider: 'local'
            }
        },
        onCompleted: async (result) => {
            await storeToken(result.login.jwt)
            signIn(result.login.jwt)
        },
        onError: (error) => {
            console.error(error)
        }
    })

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Login Screen</Text>
            <TextInput 
                style={styles.textInput}
                onChangeText={text => setUsername(text)}
                value={username}
                placeholder='Entrez votre username'
                placeholderTextColor={darkTheme.text} 
            />
            <TextInput 
                secureTextEntry
                style={styles.textInput}
                onChangeText={text => setPassword(text)}
                value={password}
                placeholder='Entrez votre password'
                placeholderTextColor={darkTheme.text} 
            />
            <Button 
                title='Login' 
                onPress={() => {
                    console.log(`LOGIN :  ${username} ${password}`)
                    login()
                }} 
            />
            <Button
                title='Register'
                onPress={() => navigation.navigate('Register')} 
            />
        </View>
    )
}

export default Login
