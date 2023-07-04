import { NavigationContainer, useNavigation } from "@react-navigation/native"
import React, { useEffect, useState, useRef } from "react"
import { StyleSheet, Text, TouchableOpacity, View, StatusBar, Image, ScrollView, Pressable, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import AccountContext from "../context/AccountContext";
import { useContext } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import Slider from "@react-native-community/slider";
import Ionicons from '@expo/vector-icons/Ionicons';
import MapView from 'react-native-maps/lib/MapView';
import { Polyline } from 'react-native-maps'
import moment from "moment";
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome5';

const RunResult = ({route}) => {


    const { user, handleUploadRun } = useContext(AccountContext);

    const [ distance, setDistance ] = useState(route.params.distance)
    const [ avgPace, setAvgPace ] = useState(route.params.avgPace)
    const [ time, setTime ] = useState(moment().startOf('day').seconds(route.params.time).format("HH:mm:ss"))
    const [ coords, setCoords ] = useState(route.params.runCoords)
    const [ mapRegion, setMapRegion ] = useState(route.params.mapRegion)
    const [ notes, setNotes ] = useState('');
    const navigation = useNavigation();
    const map = useRef();

    const [ open, setOpen ] = useState(false);
    const [ value, setValue ] = useState(null);
    const [ items, setItems ] = useState([
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'},
        {label: '4', value: '4'},
        {label: '5', value: '5'},
        {label: '6', value: '6'},
        {label: '7', value: '7'},
        {label: '8', value: '8'},
        {label: '9', value: '9'},
        {label: '10', value: '10'}
    ])

    const [ discardPop, setDiscarePop ] = useState(false);

    const handleDiscard = () => {
        navigation.replace('RunStack')
    }

    useEffect(() => {
        map.current.fitToCoordinates(coords, {
            edgePadding: {
                top: 50,
                right: 50,
                bottom: 100,
                left: 50,
            },
        });
    },[]);

    return(
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>

            {
                open &&
                    <View style={styles.modalBackground}>
                        <View style={styles.feelPopUp}>
                            <View style={styles.feelPopUpTitleContainer}>
                                <Text style={styles.feelPopUpTitle}>How did your run feel?</Text>
                                <Pressable onPress={() => {setOpen(false)}}>
                                    <Ionicons style={styles.cross} name={'close-outline'} size={35} color='black'/>
                                </Pressable>
                            </View>  
                            <Slider 
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={10}
                                minimumTrackTintColor='orange'
                                step={1}
                                onValueChange={(value) => setValue(value)}
                            />
                            <Text style={styles.feelValue}>{value} out of 10</Text>

                            <Pressable onPress={() => {setOpen(false)}} style={styles.applyContainer}>
                                <Text style={styles.applyText}>Apply</Text>
                            </Pressable>

                        </View>

                    </View>

            }

                <ScrollView>
                    <View>
                        <View style={styles.mapContainer}>
                                <View style={styles.headerContainer}>
                                    <FontAwesome name={'running'} size={24} color={'rgba(0,0,0,0.8)'} />
                                    <Text style={styles.dateString}>{new Date().toDateString()} at {new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true})} </Text>
                                        
                                </View>

                                <MapView
                                    ref = {map}
                                    style={styles.mapStyle}
                                    showsUserLocation = {false}
                                    provider='google'
                                    followsUserLocation={false}
                                    showsPointsOfInterest={false}
                                    rotateEnabled={false}
                                    scrollEnabled={false}  
                                    zoomEnabled={false}
                                >
                                    <Polyline
                                        coordinates={coords}
                                        strokeColor='orange'
                                        strokeWidth={3}
                                    />
                                </MapView>

                        </View>

                        <View style={styles.statsContainer}>
                            <View>
                                <Text style={styles.distanceTitle}>distance</Text>
                                <Text style={styles.distanceText}>{distance}</Text>
                                <Text style={styles.kiloTitle}>kilometers</Text>
                            </View>
                            <View style={styles.rightSide}>
                                <Text style={styles.rightTitle}><Text style={styles.paceText}>{avgPace}"</Text>avg pace</Text>
                                <Text style={styles.rightTitle}><Text style={styles.paceText}>{time}</Text> time</Text>
                            </View>
                            
                            {/* <Text>{pace}</Text>
                            <Text>{time}</Text> */}

                        </View>

                        <View style={styles.notesContainer}>
                            <Text style={styles.notesTitle}>Effort of run</Text>
                            <Pressable style={styles.feelContainer} onPress={()=>{setOpen(true)}} >
                                {value === null ? <Text>Enter Effort Rating...</Text> : <Text>{value} out of 10</Text>}
                                <Ionicons name='chevron-down-outline' size={20} color='black'/>
                            </Pressable>

                            <Text style={styles.notesTitle}>Notes aboout your run</Text>

                            <TextInput 
                                placeholder="Enter Notes about your run..."
                                value={notes}
                                multiline
                                onChangeText={text => setNotes(text)}
                                style={styles.inputContainer}
                            />

                        </View>

                        <View style={styles.buttonContainer}>   
                                <Pressable style={styles.submitButton} onPress={() => {handleUploadRun(coords, distance, avgPace, time, value, notes, user.email, navigation)}}>
                                    <Text style={styles.submitText}>Submit</Text>
                                </Pressable>
                                <Pressable style={styles.discardButton} onPress={() => {handleDiscard()}}>
                                    <Text style={styles.discardText}>Discard</Text>
                                </Pressable>
                        </View>

                    </View>

                </ScrollView>

                <LinearGradient 
                                colors={['rgba(235,149,50,0.8)','rgba(240,255,0,0.4)']}
                                style={styles.circle}
                />
            </View>
           
        </TouchableWithoutFeedback>
    )
}

export default RunResult;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map:{
        height: 350,
        width: 350,
        alignSelf: 'center'
    },
    title:{
        color: 'black',
        alignSelf: 'center',
        marginTop: 70,
        fontSize: 25,
        letterSpacing: 6
    },
    runContainer : {
        alignSelf: 'center',
        width: '90%',
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 10,
        padding: 20
    },
    dropdown: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 10
    },
    subTitle: {
        fontSize: 15,
        fontWeight: '400',
        marginLeft: 20,
        marginTop: 10
    },
    feelPopUp: {
        position: 'absolute',
        height:220,
        backgroundColor: 'white',
        bottom: 0,
        zIndex: 1,
        width: '100%',
        borderTopEndRadius: 30,
        borderTopStartRadius: 30
    },
    slider: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 20
    },
    feelPopUpTitle: {
        fontSize: 20,
        marginTop: 20,
        marginLeft: 25
    },
    modalBackground: {
        position: 'absolute',
        bottom: 0,
        flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 1,
    },
    feelValue : {
        alignSelf: 'center',
        marginTop: 5,
        fontSize: 20
    },
    feelContainer: {
        width: '90%',
        padding: 15,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5, 
        alignSelf: 'center',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    applyContainer: {
        alignSelf: 'center',
        marginTop: 20,
        backgroundColor: 'orange',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5, 
        borderRadius: 5
    },
    applyText: {
        fontSize: 15,
        fontWeight: '400',
        letterSpacing: 2
    },
    feelPopUpTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }, 
    cross: {
        marginTop: 20,
        marginRight: 20
    },
    inputContainer: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 10,
        paddingTop: 10,
        paddingLeft:15,
        paddingBottom: 10,
        paddingRight: 10,
        borderRadius: 5,
        maxHeight: 160,
        minHeight: 100,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 20
    },
    buttonContainer: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        marginTop: 20,
        alignSelf: 'center',
        borderRadius: 10,
        padding: 15,
        paddingLeft: 25,
        flexDirection: 'row',
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        justifyContent: 'space-evenly',
        width: '80%',
        marginBottom: 80
    },
    submitButton: {
        borderColor: 'green',
        borderWidth: 2,
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    submitText: {
        color: 'green'
    },
    discardButton: {
        borderColor: 'darkred',
        borderWidth: 2,
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    discardText: {
        color: 'darkred'
    },
    mapStyle: {
        alignSelf: 'stretch',
        height: 300,
        width: '100%',
    },
    circle:{
        top:400,
        left:-275,
        right:0,
        bottom:0,
        height: 1000,
        width: 1000,
        borderRadius: 500,
        position:'absolute',
        zIndex: -1
    },
    mapContainer: {
        backgroundColor: 'pink',
        height: 350,
        width: '90%',
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 10,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3
    },
    headerContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 15,
        flexDirection:'row'
    },
    dateString: {
        marginLeft: 10,
        marginTop: 5,
        fontSize: 15,
        letterSpacing: 1,
        color: 'rgba(0,0,0,0.8)'
    },
    statsContainer: {
        width: '90%',
        backgroundColor: 'rgba(255,255,255,0.9)',
        marginTop: 20,
        alignSelf: 'center',
        borderRadius: 10,
        padding: 15,
        paddingLeft: 25,
        flexDirection: 'row',
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3
    },
    distanceText: {
        fontSize: 30,
        fontWeight: '900',
        letterSpacing: 4
    },
    distanceTitle: {
        marginTop: 5,
        letterSpacing: 7,
        fontSize: 15,
        fontWeight: '600'
    },
    kiloTitle: {
        letterSpacing: 4
    },
    paceText: {
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: 5,
    },
    rightSide: {
        marginLeft: 25,
        marginTop: 10
    },
    rightTitle: {
        letterSpacing: 4,
        marginBottom: 10
    },
    notesContainer : {
        width: '90%',
        padding: 5,
        backgroundColor: 'rgba(255,255,255,0.9)',
        marginTop: 20,
        alignSelf: 'center',
        borderRadius: 10,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3
    },
    notesTitle: {
        fontSize: 15,
        letterSpacing: 5,
        fontWeight: '600',
        marginLeft: 20,
        marginTop: 15
    }

});