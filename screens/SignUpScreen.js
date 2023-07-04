import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Pressable, ScrollView } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import AccountContext from "../context/AccountContext";
import { CheckBox } from "react-native-elements/dist/checkbox/CheckBox";

const SignUpScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [checkPolicy, setCheckPolicy] = useState(false);
    const [policyModal, setPolicyModal] = useState(false);

    const navigation = useNavigation();

    const { handleCreateAccount } = useContext(AccountContext);

    return(
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View 
        style={styles.container} 
        >

            {policyModal==true &&
                <View style={styles.policyContainer}>
                    <View style={styles.policyInnerContainer}>
              
                            <Text style={styles.policyTitle}>Privacy Policy </Text>
                            <Text style={styles.policytext}>This Privacy Policy governs the manner in which 'GoRun' ("we" or "us") collects, uses, maintains, and discloses information collected from users (each, a "User") of the 'GoRun' mobile application (the "App").</Text>
                            <Text style={styles.policyTitle}>Information Collection and Use </Text>
                            <Text style={styles.policytext}>We may collect and use the following types of information from users:</Text>
                            <Text style={styles.policytext}> - Personal Infromation: We may collect personal information such as the users name and email address when they sign up.</Text>
                            <Text style={styles.policytext}> - Location: We may collect location information from the user's mobile device in order to track their runs.</Text>
                            <Text style={styles.policytext}>All information collected from the Users is stored securely in a Firebase database and is not shared with any third parties.</Text>
                            <Text style={styles.policyTitle}>Data Retention</Text>
                            <Text style={styles.policytext}>We will retain User data for as long as necessary to provide the services requested by the User, or as required by law.</Text>
                            <Text style={styles.policyTitle}>Security </Text>
                            <Text style={styles.policytext}>We take the security of User data seriously and have implemented appropriate technical and organizational measures to protect User data from unauthorized access, use or discolsure.</Text>
                            <Text style={styles.policyTitle}>Changes to the privacy policy</Text>
                            <Text style={styles.policytext}>We reserve the right to modify the privacy policy at any time.</Text>

                            <Pressable onPress={() => {setPolicyModal(false)}} style={styles.closeButton}>
                                <Text>Close</Text>
                            </Pressable>
                    </View>
                </View>
            }

            <Image 
                style={styles.Logo}
                source={require('../assets/GoRun-logos_transparent.png')}
            />

        <View style={styles.CreateContainer}>

            <Text style={styles.CreateText}> Create Account </Text>

                <View style={styles.inputContainer}>
                    <Ionicons name='person-outline' size={20} color="black"/>
                    <TextInput 
                        placeholder='Display Name...'
                        value={displayName}
                        onChangeText={text => setDisplayName(text)}
                        style={styles.innerInput}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name='mail-outline' size={20} color="black"/>
                    <TextInput 
                        placeholder='Email...'
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={styles.innerInput}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name='lock-closed-outline' size={20} color="black"/>
                    <TextInput 
                        placeholder='Password...'
                        value={password}
                        onChangeText={text => setPassword(text)}
                        style={styles.innerInput}
                        secureTextEntry
                    />
                </View>

                <CheckBox
                    center
                    title='Click here to accept the Privacy Policy'
                    checked={checkPolicy}
                    onPress={() => setCheckPolicy(!checkPolicy)}
                    containerStyle={{
                        backgroundColor: 'transparent',
                        borderColor: 'transparent'
                    }}
                />
            

                <TouchableOpacity 
                    style={styles.CreateButton}
                    onPress={() => {
                        if (checkPolicy==true){
                            handleCreateAccount(displayName,email,password)
                        }
                        else{
                            alert('To make an account, you must argee to the privacy policy.')
                        }
                        
                    }}
                >
                    <Text style={styles.submitText}>Create Account</Text>
                </TouchableOpacity>

                

            </View>

            <Pressable onPress={() => {setPolicyModal(true)}}>
                <Text style={styles.policytextOpen}>View Privacy Policy</Text>
            </Pressable>

            <Text 
                style={styles.SignInText}
                onPress={() => {navigation.replace('SignIn')}}
            >
                Already have an Account? 
                <Text style={styles.SignTextBold}> Log in.</Text>
            </Text>

        </View>
        </ TouchableWithoutFeedback>
    )
};

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E79115',
        alignItems: 'center',
        justifyContent: 'center'
      },
    Logo:{
        width: 500,
        height: 500,
        position: 'absolute',
        top: -40,
    },
    CreateContainer:{
        width: '85%',
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 20,
        marginTop: 180
    },
    CreateText: {
        alignSelf: 'center',
        marginTop: 20,
        fontSize:20,
        marginBottom: 20,
    },
    inputContainer: {
        backgroundColor: 'white',
        padding: 15,
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
    CreateButton: {
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
    SignInText:{
        position: 'absolute',
        bottom: 50,
        fontSize: 15
    },
    SignTextBold:{
        fontWeight: '700'
    },
    policyContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 1,
        borderRadius: 20,
        justifyContent: 'center'
    },
    policyInnerContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        alignSelf: 'center',
        padding: 20,
        zIndex: 10,
    },
    policyTitle: {
        fontSize: 15,
        letterSpacing: 5,
        fontWeight: '600',
        alignSelf: 'center',
        marginBottom: 10,
        marginTop: 10
    },
    policytext: {
        fontSize: 10,
    },
    closeButton: {
        alignSelf: 'center',
        marginTop: 30,

    },
    policytextOpen: {
        fontSize: 15,
        marginTop: 20,
        letterSpacing: 5,
        fontWeight: '700'
    }
});