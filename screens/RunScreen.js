import { useNavigation } from "@react-navigation/native"
import React, { useEffect, useState, useRef } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView from "react-native-maps/lib/MapView";
import * as Location from 'expo-location';
import { Polyline } from "react-native-maps";
import moment from "moment";
import { LinearGradient } from 'expo-linear-gradient';

const RunScreen = () => {

    const navigation = useNavigation();

    const [ runCoordinates, setRunCoordinates ] = useState([]);
    const [ watchID, setWatchID ] =useState(null);
    const [ status, setStatus ] = useState('');
    const [ mapRegion, setMapRegion ] = useState({
        latitude: 37.7885,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    })
    const [ runStatus, setRunStatus ] = useState(false);
    const [ distance, setDistance ] = useState(0.00);
    const [ avgPace, setAvgPace ] = useState(0.00);
    const [ endRunPop, setEndRunPop ] = useState(false);

    const [timer, setTimer] = useState(0);
    const [paused, setPaused] = useState(true);

    //useEffect that is triggered when the pause state is toggled. If the setstate is paused then the timer will stop. If the timer is not paused the timer will add 1 second for every second.
    useEffect(() => {
        const interval = setInterval(() => {
            if(!paused){
                setTimer(timer => timer + 1);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [paused]);

    //UseEffect that runs when the runCoordinates get updated. It calculates the distance by taking 1 away from the length of the runCoordinates and timising it by 0.02 which is 20 meters in kilometers
    //Console logs for testing purposes
    //Avg pace is calculate by taking the time in seconds over the distance and dividing by 60 to turn it into minutes. The distacne and pace is then set so it can be displayed to the user.
    useEffect(() => {
        console.log(runCoordinates);
        const calDistance = (runCoordinates.length-1)*0.02; 
        console.log('Distance is currently '+calDistance);
        const avg = (((timer/calDistance)/60).toFixed(2))
        console.log('Pace currently is '+avg);
        if(runCoordinates.length-1>1 && timer>5){
            setDistance(calDistance);
            setAvgPace(avg);
        }
    }, [runCoordinates]);

    //UseEffect that first runs when the screen is loaded. Gets users location if permission is granted. Sets the mapregion to the current location and sets the intial coordinates for the 
    //runcoordinates to be the current location.
    useEffect(() =>{
        (async () => {
          let {status} = await
           Location.requestForegroundPermissionsAsync();
           if(status != 'granted'){
             setStatus('Permission to access Location was denied');
             return;
           }
           else
           {
             let currentlocation = await Location.getCurrentPositionAsync();
             setMapRegion({latitude: currentlocation.coords.latitude, longitude: currentlocation.coords.longitude, latitudeDelta: 0.0009922, longitudeDelta: 0.00421});
             if(runCoordinates===[{latitude: 0,longitude: 0}]){
                setRunCoordinates([{latitude: currentlocation.coords.latitude, longitude: currentlocation.coords.longitude}]);
             }
             console.log("latitude "+ currentlocation.coords.latitude);
             console.log("longitude "+ currentlocation.coords.longitude);
             console.log('Access granted! ')
             setStatus(status)
           }
        })();
      }, []);

      //Function that is triggered when the start button is pressed. If permission is granted, expo location will start tracking the users location for every 20 meters.
      //For every new location, a new coordiante is added to the runcoordinates and the mapview is updated to the current location with the mapregion being set.
    const startRun = async() => {
        if(status === 'granted') {
            const runid = async () => {
                return await Location.watchPositionAsync({  
                accuracy: Location.Accuracy.BestForNavigation,
                activityType: Location.ActivityType.Fitness,
                timeInterval: 0,
                distanceInterval: 20,     
            },
            loc => {
                setRunCoordinates( (prevCoords) => [
                    ...prevCoords,
                    {
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude
                    }
                ]);
                setMapRegion({latitude: loc.coords.latitude, longitude: loc.coords.longitude, latitudeDelta: 0.0009922, longitudeDelta: 0.00421});
                setRunStatus(true);     
                setPaused(false);  
            })
            }
            runid()
            .then((result) => setWatchID(result))

        }
        else{
            alert('Ensure Permissions are set to be able to track run!')
            let { status } = await Location.requestForegroundPermissionsAsync();
            setStatus(status);
        }
    }

    //Function that is triggered when the top button is pressed. Sets pause to true which pauses the timer and stops the location tracking for the moment.
    const stopRun = async () => {
        setPaused(true);
        watchID.remove();
        setRunStatus(false);
    }

    //Function that is triggered when the user pressed the finish button. Stops the location tracking and pauses the timer. Sets the pop up to true to display the pop up to the user.
    const endRun = async () => {
        console.log('end');
        watchID.remove();
        setPaused(true);
        setEndRunPop(true);  
    }

    //Function that is triggered when the user presses yes in the pop up to finish the run. Removes the tracking and navigates to the run result page with the run data.
    const completeRun = async () => {
        watchID.remove();
        setRunStatus(false);
        navigation.replace('RunResult', {distance: distance, avgPace: avgPace, time: timer, runCoords: runCoordinates, mapRegion: mapRegion})
    }

    return(
        <View style={Styles.container}>

            {
                endRunPop===true
                &&
                    <View style={Styles.endPopContainer}>
                        <View style={Styles.innerEndPopContainer}>
                            <Text style={Styles.innerEndText}>Are you sure you want to end your run?</Text>
                            <View style={Styles.endRunButtonContainer}>
                                <TouchableOpacity
                                    onPress={() => {completeRun()}}
                                    style={Styles.yesButton}
                                >
                                    <Text>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {setPaused(false), startRun(), setEndRunPop(false)}}
                                    style={Styles.noButton}
                                >
                                    <Text>No</Text>
                                </TouchableOpacity>

                            </View>
                            
                        </View>
                    </View>

            }

            {status!='granted' &&
            <View style={Styles.modal}>
                <View style={Styles.modalBox}>
                    <Text style={Styles.modalText}>Please wait a moment while your current location is fetched.</Text>
                </View>
            </View>
            }

                <MapView
                    region={mapRegion}
                    style={Styles.mapStyle}
                    showsUserLocation={true}
                    provider='google'
                    followsUserLocation={true}
                    showsPointsOfInterest={false}
                    rotateEnabled={false}
                    scrollEnabled={false}
                    zoomEnabled={false}
                >
                    <Polyline
                    coordinates={runCoordinates}
                    strokeColor="orange"
                    strokeWidth={5}
                    />
                </MapView>
            
            <View style={Styles.runStatsContainer}>
                <Text style={Styles.timerText}>{moment().startOf('day').seconds(timer).format("HH:mm:ss")}</Text>
                <View style={Styles.rowContainer}>
                    <View>
                        <Text style={Styles.statsText}>distance</Text>
                        <Text style={Styles.distanceResult}>{distance.toFixed(2)} km</Text>
                    </View>
                    <View>
                        <Text style={Styles.statsText}>avg pace</Text>
                        <Text style={Styles.distanceResult}>{avgPace} min/km</Text>
                    </View>

                </View>

            </View>

            <View style={Styles.buttonContainer}>
                {
                    runStatus=== false 
                    ?
                        <TouchableOpacity
                            style={Styles.startButton}
                            onPress={()=>{
                                startRun()
                            }}
                        >
                            <Text style={Styles.startText}>Start</Text>
                        </TouchableOpacity>
                    :
                        <TouchableOpacity
                            style={Styles.stopButton}
                            onPress={()=>{
                                stopRun()
                            }}
                        >
                            <Text style={Styles.startText}>Stop</Text>
                        </TouchableOpacity>

                }
                 {
                    runStatus===true &&
                    <TouchableOpacity
                        style={Styles.finshButton}
                        onPress={()=>{
                            endRun()
                        }}
                    >
                        <Text style={Styles.startText}>Finish</Text>
                    </TouchableOpacity>
                    
                }

            </View>

            <LinearGradient 
                    colors={['rgba(235,149,50,0.8)','rgba(240,255,0,0.4)']}
                    style={Styles.circle}
            />

        </View>
    )
}

export default RunScreen;

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
    title: {
        color: 'black',
        alignSelf: 'center',
        marginTop: 10,
        fontSize: 25, 
        letterSpacing: 6
    },
    mapStyle: {
        alignSelf: 'stretch',
        height: '150%',
        width: '100%',
        alignSelf:'center',
        position: 'absolute',
        top: -350
    },
    startButton: {
        backgroundColor: 'lightgreen',
        width: 160,
        height: 70,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    startText: {
        fontSize: 30,
        letterSpacing: 5,
        textAlign: 'center'
    },
    modal:{
        height:'100%',
        width: '100%',
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        position: 'absolute',
        zIndex: 10000,
        justifyContent: 'center',
        alignContent: 'center'
    },
    modalBox: {
        backgroundColor: 'white',
        width: '80%',
        alignSelf: 'center',
        borderRadius: 10
    },
    modalText:{
        fontSize: 15,
        padding: 19,
        alignSelf: 'center',
        fontWeight: '500',
        letterSpacing: 3,
        textAlign: 'center'
    },
    stopButton: {
        backgroundColor: 'orange',
        width: 150,
        height: 70,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    timer:{
       container:{
           backgroundColor: 'rgba(0,0,0,0.1)',
           alignSelf: 'center', 
           marginTop: 20,
           padding: 10,
           borderRadius: 10

       },
       text:{
           fontSize: 50,
           letterSpacing: 5
       }
    },
    distanceContainer: {
        backgroundColor: 'white',
        marginTop: 15,
        padding: 10,
        borderRadius: 10,
    },
    runResultContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 10,
    },
    distanceText: {
        fontSize: 15,
        alignSelf: 'center',
        letterSpacing: 3,
        fontWeight: '400'
    },
    distanceResult: {
        fontSize: 25,
        textAlign: 'center',
        letterSpacing: 4,
        fontWeight: '700'
    },
    buttonContainer: {
        position: 'absolute',
        width: '90%',
        height: '15%',
        backgroundColor: 'white',
        bottom: 20,
        alignSelf: 'center',
        borderRadius: 20,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        justifyContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    units: {
        fontSize: 15
    },
    finshButton: {
        backgroundColor: 'rgba(214,69,65,1)',
        width: 150,
        height: 70,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        textAlign: 'center',
        alignContent: 'center'
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
    runStatsContainer: {
        position: 'absolute',
        width: '90%',
        height: '20%',
        backgroundColor: 'white',
        bottom: '20%',
        borderRadius: 20,
        alignSelf: 'center',
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3
    },
    timerText: {
        alignSelf: 'center',
        marginTop: 15,
        fontSize: 40,
        fontWeight: '800',
        letterSpacing: 5,
        color: 'orange'
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10
    },
    statsText: {
        letterSpacing: 8,
        fontWeight: '600',
        textAlign: 'center'
    }


});