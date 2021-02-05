import * as React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './Styles/LoginStyle'

import { gql, useMutation } from '@apollo/client'

import { AuthContext } from '../Contexts/AuthContext'

import { darkTheme } from '../Theme/Color'

const MUTATION_REGISTER = gql`
    mutation registerMutation(
        $email: String!
        $username: String!
        $password: String!
    ) {
        register(input: {
            email: $email
            username: $username
            password: $password
        }) 
        {
            jwt
            user {
                id
                username
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

const Register = () => {
    const [email, setEmail] = React.useState('paupau@gmail.com')
    const [username, setUsername] = React.useState('paupaupau')
    const [password, setPassword] = React.useState('Admin03!')

    const { signUp } = React.useContext(AuthContext);

    const [register] = useMutation(MUTATION_REGISTER, {
        variables: {
            email: email,        
            password: password,        
            username: username,
            provider: 'local'
        },
        onCompleted: async (result) => {
            await storeToken(result.register.jwt)
            signUp(result.register.jwt)
        },
        onError: (error) => {
            console.error(error)
        }
    })

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Register Screen</Text>
            <TextInput 
                style={styles.textInput}
                onChangeText={text => setUsername(text)}
                value={username}
                placeholder='Entrez votre username'
                placeholderTextColor={darkTheme.text} 
            />
            <TextInput 
                keyboardType={'email-address'}
                style={styles.textInput}
                onChangeText={text => setEmail(text)}
                value={email}
                placeholder='Entrez votre email'
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
                title='Register'
                onPress={() => {
                    console.log(`REGISTER : ${email} ${username} ${password}`)
                    register()
                }} 
                
            />
        </View>
    )
}

export default Register
