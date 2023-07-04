import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable } from "react-native"
import AccountContext from "../context/AccountContext";
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import MapView, { Polyline } from "react-native-maps";
import { useNavigation } from "@react-navigation/native"

const ViewRun  = ({route}) => {
    
    //Run data that is passed through the route
    const runID = route.params.id;
    const mapRef = useRef();
    const coords = route.params.coords;
    const date = route.params.date;
    const distance = route.params.distance;
    const pace = route.params.pace;
    const time = route.params.time;
    const feeling = route.params.feeling;
    const notes = route.params.notes; 

    const { deleteRun } = useContext(AccountContext);
    const [ runDate, setRunDate ] = useState('');
    const [ modal, setModal ] = useState(false);
    const navigation = useNavigation();

    //useEffect that runs when the screen appears. Fits the mapView usings its reference to the coordinates that come from the route navigation.
    useEffect(() => {
        mapRef.current.fitToCoordinates(coords, {
            edgePadding: {
                top: 90,
                right: 90,
                bottom: 90,
                left: 90,
            },
        });
    },[]);
    
    return(
        <View style={styles.container}>

            {
                modal===true
                &&
                    <View style={styles.endPopContainer}>
                        <View style={styles.innerEndPopContainer}>
                            <Text style={styles.innerEndText}>Are you sure you want to delete this run?</Text>
                            <View style={styles.endRunButtonContainer}>
                                <Pressable
                                    onPress={() => {deleteRun(runID, navigation)}}
                                    style={styles.yesButton}
                                >
                                    <Text>Yes</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => {setModal(false)}}
                                    style={styles.noButton}
                                >
                                    <Text>No</Text>
                                </Pressable>

                            </View>
                            
                        </View>
                    </View>

            }

        
            <ScrollView>

            
                <View>
        
                    <View style={styles.mapContainer}>
                        <View style={styles.headerContainer}>
                            <FontAwesome name={'running'} size={24} color={'rgba(0,0,0,0.8)'} />
                            <Text style={styles.dateString}>{new Date(date.toDate()).toDateString()} at {new Date(date.toDate()).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true})} </Text>
                                
                        </View>

                        <MapView
                            ref = {mapRef}
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
                            <Text style={styles.rightTitle}><Text style={styles.paceText}>{pace}"</Text>avg pace</Text>
                            <Text style={styles.rightTitle}><Text style={styles.paceText}>{time}</Text> time</Text>
                        </View>
                
                    </View>

                    <View style={styles.feelingContainer}>
                        <Text style={styles.runTitle}>Run Effort: </Text>
                        {feeling != null
                            ?
                            <Text style={styles.effort}><Text style={styles.bold}>{feeling}</Text> out of 10</Text>
                            :
                            <Text style={styles.noeffort}>No effort added</Text>

                        }
                        
                    </View>

                    <View style={styles.notesContainer}>
                        <Text style={styles.runTitle}>Notes: </Text>
                        {notes != '' ? 
                            <Text style={styles.noteText}>{notes}</Text>
                            :
                            <Text style={styles.noteText}>There are currently no notes for this run!</Text>
                        }

                    </View>

                    <View style={styles.buttonContainer}>   
                                <Pressable style={styles.submitButton} onPress={() => {setModal(true)}}>
                                    <Text style={styles.deleteText}>Delete Run</Text>
                                </Pressable>
                    </View>

                    


                   
                    
                </View>
            </ScrollView>

            <LinearGradient 
                            colors={['rgba(235,149,50,0.8)','rgba(240,255,0,0.4)']}
                            style={styles.circle}
            />
        </View>


    )
}

export default ViewRun;

const styles = StyleSheet.create({
    container: {
        flex: 1
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
    mapStyle: {
        alignSelf: 'stretch',
        height: 300,
        width: '100%',
    },
    statsContainer: {
        width: '90%',
        backgroundColor: 'rgba(255,255,255,0.9)',
        marginTop: 20,
        alignSelf: 'center',
        borderRadius: 10,
        padding: 15,
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
    feelingContainer: {
        width: '90%',
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 20,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        padding: 20,
        flexDirection: 'row',
    },
    runTitle: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 5
    },
    effort: {
        fontSize: 15,
        marginLeft: 60,
        letterSpacing: 3
    },
    bold: {
        fontWeight: '700',
        fontSize: 18
    },
    notesContainer: {
        width: '90%',
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 20,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        padding: 20,
    },
    noteText: {
        marginTop: 10,
        letterSpacing: 5
    },
    noeffort: {
        fontSize: 15,
        marginLeft: 35,
        letterSpacing: 3,
        marginTop: 3
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
    endPopContainer: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 1,
        alignSelf: 'center'    
    },
    innerEndPopContainer: {
        backgroundColor: 'white',
        width: '80%',
        height: '20%',
        alignSelf: 'center',
        marginTop: '50%',
        borderRadius: 20
    },
    innerEndText: {
        alignSelf: 'center',
        margin: 20,
        fontSize: 17,
        textAlign: 'center',
        letterSpacing: 2
    },
    yesButton: {
        backgroundColor: 'lightgrey',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: 80

    },
    noButton: {
        backgroundColor: 'lightgrey',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: 80
    },
    endRunButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 10
    },
    deleteText : {
        letterSpacing: 5,
        fontWeight: '700',
        color: 'darkred'
    }
  

})
