import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import AccountContext from "../context/AccountContext";


const SignInScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    
    const { handleLogin } = useContext(AccountContext);


    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>

                <Image 
                    style={styles.Logo}
                    source={require('../assets/GoRun-logos_transparent.png')}
                />

                <View style={styles.signInContainer}>
                    <Text style={styles.signInText}> Login </Text>

                    <View style={styles.inputContainer}>
                        <Ionicons name='mail-outline' size={20} color="grey"/>
                        <TextInput 
                            placeholder='Email...'
                            value={email}
                            onChangeText={text => setEmail(text)}
                            style={styles.innerInput}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name='lock-closed-outline' size={20} color="grey"/>
                        <TextInput 
                            placeholder='Password...'
                            value={password}
                            onChangeText={text => setPassword(text)}
                            style={styles.innerInput}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity 
                        style={styles.signInButton}
                        onPress={() => {
                            handleLogin(email, password)
                        }}
                    >
                        <Text style={styles.submitText}>Sign In</Text>
                    </TouchableOpacity>

                    

                </View>

                <Text 
                    style={styles.createAccountText}
                    onPress={() => {navigation.replace('SignUp')}}
                >
                    Don't have an Account yet? 
                    <Text style={styles.createAccountTextBold}> Sign Up </Text>
                </Text>

            </View>
        </TouchableWithoutFeedback>
    )
}

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E79115',
        alignItems: 'center',
        justifyContent: 'center',
      },
    signInContainer:{
        width: '85%',
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 20,
        marginTop: 140
    },
    signInText: {
        alignSelf: 'center',
        marginTop: 20,
        fontSize:20,
        marginBottom: 20,
    },
    inputContainer: {
        backgroundColor: 'white',
        padding: 20,
        width: '80%',
        borderRadius: 15,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 3,
        flexDirection: 'row',
        marginBottom: 30,
        alignSelf: 'center'
    },
    innerInput:{
        marginLeft: 10,
    },
    signInButton: {
        backgroundColor: '#E79115',
        padding: 15,
        width: 150,
        borderRadius: 20,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 3,
        marginBottom: 20,
        alignItems: 'center',
        alignSelf: 'center'
    },
    Logo:{
        width: 500,
        height: 500,
        position: 'absolute',
        top: -40,
    },
    submitText:{
        fontSize: 15,
    },
    createAccountText:{
        position: 'absolute',
        bottom: 50,
        fontSize: 15
    },
    createAccountTextBold:{
        fontWeight: '700'
    }
})