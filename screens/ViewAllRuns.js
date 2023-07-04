import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useContext, useRef } from "react";
import { StyleSheet, View, Text, FlatList, Pressable } from "react-native"
import MapView, { Polyline } from "react-native-maps";
import AccountContext from "../context/AccountContext";
import { LinearGradient } from 'expo-linear-gradient';

const ViewAllRuns  = () => {

    const { user, handleFetchRuns, usersRuns } = useContext(AccountContext);
    const mapRefs = useRef([]);
    const navigation = useNavigation();

    //useEffect that runs when the screen first appears. Fetches the users runs. 
    useFocusEffect(
        React.useCallback(() => {
            handleFetchRuns(user.email)
        }, [])
    )
    
    
    return(
        <View style={styles.container}>
            <Text style={styles.title}>All Runs</Text>
            <FlatList
                data={usersRuns}
               // keyExtractor={index => index}
                renderItem={({item, index}) => 
                <Pressable onPress={() => {
                    navigation.navigate('ViewRun', {
                        id: item.runID, 
                        coords: item.runCoordinates,
                        date: item.runDate,
                        distance: item.runDistance,
                        pace: item.runPace,
                        time: item.runTime,
                        feeling: item.runFeeling,
                        notes: item.runNotes
                    } )}}>
                    <View style={styles.singleRunContainer}>
                        <MapView
                            ref={(ref) => mapRefs.current[index] = ref}
                            onMapReady = {() => mapRefs.current[index].fitToCoordinates(item.runCoordinates, {
                                edgePadding: {
                                    top: 25,
                                    right: 25,
                                    bottom: 25,
                                    left: 25
                                },
                                animated: true
                            })}
                            style={styles.mapStyle}
                            showsUserLocation={false}
                            provider='google'
                            followsUserLocation={false}
                            showsPointOfInterest={false}
                            rotateEnabled={false}
                            scrollEnabled={false}
                            zoomEnabled={false}
                        >
                            <Polyline 
                                coordinates={item.runCoordinates}
                                strokeColor='orange'
                                strokeWidth={3}
                            />
                        </MapView>
                        <View style={styles.singleRunTextContainer}>
                            <Text style={styles.dateString}>{new Date(item.runDate.toDate()).toDateString()} at {new Date(item.runDate.toDate()).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true})}</Text>
                            <Text style={styles.dateString}>Total time: {item.runTime}</Text>
                            <View style={styles.singleRunStatsContainer}>
                                <View>
                                    <Text style={styles.singleRunDistance}>{item.runDistance}</Text>
                                        <Text style={styles.singleRunKilo}>kilometers</Text>
                                </View>
                                <View style={styles.singleRightSide}>
                                    <Text style={styles.singleRunDistance}>{item.runPace}"</Text>
                                    <Text style={styles.singleRunKilo}>avg pace</Text>
                                </View>
                            </View>
                        </View>
                        
                    </View>

                </Pressable>
                    
                }

            />

            <LinearGradient 
                    colors={['rgba(235,149,50,0.8)','rgba(240,255,0,0.4)']}
                    style={styles.circle}
            />
        </View>

    )
}

export default ViewAllRuns;

const styles = StyleSheet.create({
    container: {
        marginBottom: 50

    },
     singleRunContainer: {
        width:'90%',
        marginBottom: 15,
        borderRadius: 10,
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 20,
        alignSelf: 'center'
    },
    mapStyle: {
        alignSelf: 'stretch',
        height: 90,
        width: '30%',
        borderRadius: 10
    },
    singleRunTextContainer: {
        marginLeft: 20
    },
    dateString: {
        color: 'rgba(0,0,0,1)',
        marginBottom: 5
    },
    singleRunStatsContainer: {
        flexDirection: 'row',
        marginTop: 5,
        width: '75%'
    },
    singleRunDistance: {
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: 7
    },
    singleRunKilo: {
        letterSpacing: 1
    },
    singleRunPace: {
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: 2
    },
    singleRightSide: {
        marginLeft: 45
    },
    title: {
        fontSize: 20,
        fontWeight: '500',
        marginTop: 15,
        marginLeft: 30,
        marginBottom: 15,
        letterSpacing: 5
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
    
})
