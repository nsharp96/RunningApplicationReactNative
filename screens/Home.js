import { useNavigation } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View, FlatList, Image, Pressable } from "react-native";
import AccountContext from "../context/AccountContext";
import { useContext } from "react";
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';



const Home = () => {

    const { 
        handleFetchUserData,
         userData, 
         handleFetchRuns, 
         handleCalculateRunStreak, 
         user, 
         fetchedUsersRuns, 
         runStreak, 
         streakType 
    } = useContext(AccountContext);

    const [ status, setStatus ] = useState('');
    const [ lat, setLat ] = useState('');
    const [ long, setLong ] = useState('');
    const [ placeData, setPlaceData ] = useState([]);
    const [ places, setPlaces ] = useState([]);

    const navigation = useNavigation();

    //Useeffect that runs when screen is first appeared. Fetches user data and runs. Fetches user location if permission is granted.
    useEffect(() => {
        handleFetchUserData();
        handleFetchRuns(user.email);
        console.log('Fetch Data '+userData.DisplayName);

        (async () => {
            let {status} = await
             Location.requestForegroundPermissionsAsync();
             if(status != 'granted'){
               setStatus('Permission to access Location was denied');
             }
             else
             {
               let currentlocation = await Location.getCurrentPositionAsync();
               setLat(currentlocation.coords.latitude);
               setLong(currentlocation.coords.longitude);
               setStatus(status)
             }
        })();
    }, []);

    //If userruns is updated then the run streak is calculated.
    useEffect(() => {
        handleCalculateRunStreak();
    },[fetchedUsersRuns])

    //When the users location is fetched it triggers this useeffect. The useeffect uses the foursquare api to fetch 10 parks that are close by.
    useEffect(() => {
        if(lat!=''&&long!=''){
            console.log("wooo "+lat+" "+long)
            fetch(`https://api.foursquare.com/v3/places/search?ll=${lat}%2C${long}&radius=10000&categories=16032&sort=DISTANCE&limit=10`, options)
            .then(response => response.json())
            .then(response => {
                setPlaceData(response.results) 
            })  
            .catch(err => console.error(err));
        }
    },[long, lat])

    //When the places nearby is fetched, this useeffect gets called. The useefeect uses the four square api to fetch an image for each park that is nearby. 
    useEffect(() => {
        let placestwo = [];
        placeData.forEach((park) => {
            fetch(`https://api.foursquare.com/v3/places/${park.fsq_id}/photos?limit=1`, options)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                if(response.length != 0){
                    console.log("good")
                    placestwo.push({
                                name: park.name,
                                fsq: park.fsq_id,
                                photo: response[0].prefix+"original"+response[0].suffix,
                                distance: (park.distance*0.001).toFixed(2)
        
                    })
                }
                setPlaces(placestwo);  
            })
            .catch(err => console.error(err));
        })
    },[placeData])

    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'fsq3K5mIebm7rn4vJjGxyvwV28yffDvBCDZMCWVq7HJghJU='
        }
      };

    const viewConfig = {
        viewAreaCoveragePercentThreshold: 95,
        itemVisiblePercentThreshold: 30
    }
      

    return (
        <View style={styles.container}>

            

                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.welcomeName}>{userData.DisplayName}</Text>

                {/* If the user has no run streak, then it appears that they have no current streak going */}
                {runStreak == 0 &&
                    <View style={styles.runStreakContainer}>
                        <View style={styles.runNumberContainer}>
                            <Text style={styles.runNumber}>0</Text>
                            <Text style={styles.streakNumberText}>day streak</Text>
                        </View>
                        <View style={styles.rightSideContainer}>
                            <Text style={styles.streakText}>You have no current run streak!</Text>
                            <Pressable 
                                style={styles.streakButton}
                                onPress={() => {navigation.navigate('Run')}}
                            >
                                <Text style={styles.streakButtonText}>Go for a run!</Text>
                            </Pressable>
                        </View>
                    </View>
                }

                {/* If the user has a runstreak it checks if they have ran today or not. If they havent it will encourage the user to run today to keep their run streak. */}
                {runStreak > 0 &&
                    <View style={styles.runStreakContainer}>
                        <View style={styles.runNumberContainer}>
                            <Text style={styles.runNumber}>{runStreak}</Text>
                            <Text style={styles.streakNumberText}>day streak</Text>
                        </View>
                        <View style={styles.rightSideContainer}>
                            {streakType == 'missingToday' &&
                                <Text style={styles.streakSmallerText}>Go for a run today or you will lose your run streak!</Text>
                            }
                            {streakType == 'current' &&
                                <Text style={styles.streakText}>Keep Running! You got this!</Text>
                            }
                            <Pressable 
                                style={styles.streakButton}
                                onPress={() => {navigation.navigate('Run')}}
                            >
                                <Text style={styles.streakButtonText}>Go for a run!</Text>
                            </Pressable>
                        </View>
                    </View>
                }
                

                <View style={styles.placeNearbyContainer}>
                    <Text style={styles.runText}>Don't know where to run?</Text>
                    <Text style={styles.runTextTwo}>Why not try these places near you</Text>

                    {/* If data is still being loaded then the below text appears */}
                    {places.length == 0 &&
                        <Text style={styles.loadingLocation}>Locations are loading....</Text>
                    }
    
                    {/* Horiziontal flatlist that displays all the parks nearby */}
                    <FlatList 
                        horizontal
                        style={{flex: 0}}
                        showsHorizontalScrollIndicator={false}
                        viewabilityConfig={viewConfig}
                        data={places}
                        useInteraction={false}
                        initialNumToRender={places.length}
                        renderItem={({item}) => 
                        <View style={styles.placeContainer}>
                            <Image source={{uri: item.photo}} style={styles.imageContainer}/>
                            <Text style={styles.placeText}>{item.name}</Text>
                            <Text style={styles.distanceText}>{item.distance} km away</Text>
                            
                        </View>
                    }
                    />

                </View>


            <LinearGradient 
                    colors={['rgba(235,149,50,0.8)','rgba(240,255,0,0.4)']}
                    style={styles.circle}
            />

        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
    },
    welcomeText:{
        color: 'black',
        fontWeight: '700',
        letterSpacing: 5,
        marginTop: 80,
        ...Platform.select({
            ios: {
              marginTop: 10,
              marginLeft: 20,
              fontSize: 30
            },
            android: {
                marginTop: 20,
                marginLeft: 20,
                fontSize: 30
            }
        })
    },
    welcomeName:{
        color:'orange',
        fontSize: 30,
        letterSpacing: 2,
        ...Platform.select({
            ios: {
                marginLeft:20
            },
            android: {
                marginLeft: 25
            }
        })
    },
    placeContainer: {
        width: 250,
        borderRadius: 20,
        marginLeft: 20,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    placeText: {
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 2, 
        marginTop: 10,
        marginLeft: 5
    },
    imageContainer: {
        height: 175,
        borderRadius: 20,
    },
    distanceText: {
        color: 'rgba(0,0,0,0.5)',
        marginLeft: 5,
        letterSpacing: 2
    },
    runText: {
        marginLeft: 20,
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: 2
    },
    runTextTwo: {
        marginLeft: 20,
        fontSize: 15,
        letterSpacing: 2,
        marginTop: 5,
        marginBottom: 10
    },
    placeNearbyContainer: {
        marginTop: 15,
        width: '200%'
    },
    runStreakContainer: {
        width: '90%',
        height: 140,
        backgroundColor: '#EDEDED',
        marginTop: 10,
        borderRadius: 10,
        alignSelf: 'center',
        flexDirection:'row',
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},   
        shadowOpacity: 0.2,
        shadowRadius: 3
    },
    runNumber: {
        fontSize: 70,
        fontWeight: '900',
        color: 'white',
        alignSelf: 'center'
    },
    streakText: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 1,
        width: 200,
        marginTop: 15,
        textAlign: 'center',
        alignSelf: 'center'
    },
    streakButton: {
        borderRadius: 10,
        borderColor: 'orange',
        borderWidth: 2,
        alignContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        width: 175,
        padding: 5,
        backgroundColor: 'rgba(255,165,0,0.2)',
        alignSelf: 'center',
        marginTop: 15,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3
    },
    streakButtonText: {
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 3
    },
    runNumberContainer: {
        backgroundColor: 'orange',
        height: '80%',
        alignSelf: 'center',
        marginLeft: 20,   
        paddingLeft: 15,
        paddingRight: 15, 
        borderRadius: 10,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3
    },
    streakNumberText: {
        fontWeight: '600',
        fontSize: 15,
        alignSelf: 'center',
        color: 'white',
        letterSpacing: 1
    },
    rightSideContainer: {
        width: 240
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
    streakSmallerText: {
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 1,
        width: 200,
        marginTop: 15,
        textAlign: 'center',
        alignSelf: 'center'
    },
    loadingLocation: {
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: 2,
        marginTop: 20, 
        marginLeft: '10%'
    }
    
})