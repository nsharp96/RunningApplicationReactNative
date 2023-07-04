//Imports for the Activity Screen
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import React, { useEffect, useRef, useState } from "react"
import { StyleSheet, Text, View, ScrollView, Dimensions, Pressable } from "react-native";
import AccountContext from "../context/AccountContext";
import { useContext } from "react";
import MapView, { Polyline } from "react-native-maps";
import { LineChart } from "react-native-chart-kit";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { LinearGradient } from 'expo-linear-gradient';

const ActivityScreen = () => {

    //Functions and Variables used from the AccountContext
    const { 
        usersRuns, 
        handleFetchRuns, 
        user, 
        weeklyDistance, 
        currentMonthDistance, 
        yearDistance, 
        weeklyData, 
        monthlyData, 
        monthLabels, 
        yearData, 
        weeklyRunAmount, 
        montlyRunAmount, 
        yearlyRunAmount, 
        weeklyTimeAmount, 
        monthlyTimeAmount, 
        yearlyTimeAmount, 
        fetchedUsersRuns, 
        handleCalculateRunStreak 
    } = useContext(AccountContext);
    
    //Reference for maps within each run
    const mapRefs = useRef([]);

    //UseStates
    const [ labels, setLabels ] = useState(['Mon', 'Tues', 'Wed', 'Thur','Fri','Sat', 'Sun']);
    const [ data, setData ] = useState([0,0,0,0,0,0,0]);
    const [ graphOption, setGraphOption ] = useState(0);
    const [ distance, setDistance ] = useState(0);
    const [ runAmount, setRunAmount ] = useState(0);
    const [ totalTime, setTotalTime ] = useState(0);

    //Navigation 
    const navigation = useNavigation();

    //UseEffect that changes the data and labels within the graph when selected a different option. Week, Month and year view.
    useEffect(() => {
        if(graphOption==0){
            setLabels(['Mon', 'Tues', 'Wed', 'Thur','Fri','Sat', 'Sun']);
            setData(weeklyData);
            setDistance(weeklyDistance);
            setRunAmount(weeklyRunAmount);
            setTotalTime(weeklyTimeAmount);
        }
        else if(graphOption==1){
            setLabels(monthLabels);
            setData(monthlyData);
            setDistance(currentMonthDistance);
            setRunAmount(montlyRunAmount);
            setTotalTime(monthlyTimeAmount);
        }
        else if(graphOption==2){
            setLabels(['J',"F","M","A","M","J","J","A","S","O","N","D"])
            setData(yearData)
            setDistance(yearDistance)
            setRunAmount(yearlyRunAmount);
            setTotalTime(yearlyTimeAmount);
        }
    },[graphOption])

    //useFocusEffect that runs when the screen comes into focus. Calls onto the handleFetchRuns function fetch all runs and get the stats data.
    useFocusEffect(
        React.useCallback(() => {
            handleFetchRuns(user.email);
        },[])
    )

    //If the UserRuns get changed then the run streak is recalculated
    useEffect(() => {
        handleCalculateRunStreak();
    },[fetchedUsersRuns])

    //Updates the graph when first opened so it contains the weekly data
    useEffect(() => {
        setData(weeklyData);
    },[weeklyData])
    useEffect(() => {
        setDistance(weeklyDistance);
        setRunAmount(weeklyRunAmount);
        setTotalTime(weeklyTimeAmount);
    },[weeklyDistance])


               
    return(
        <View style={{flex: 1}}>

            
            {/* If the User has not completed any runs yet or a new user, then this message displays. */}
            {usersRuns == 0 &&
            <View style={Styles.newContainer}>
                <Text style={Styles.newText}>It looks like you are new here!</Text>
                <Text style={Styles.newText}>As you have completed no runs yet, you can not see any statistics or past runs!</Text>
                <Text style={Styles.newText}>Go for a run and start seeing trends!</Text>
                <Pressable style={Styles.newRunButton} onPress={() => {navigation.navigate('Run')}}>
                    <Text>Go for a Run!</Text>
                </Pressable>
            </View> 
            }
           

        
            <ScrollView style={Styles.container}>

                {/* If a user has completed one run or more than their stats and runs will appear */}
                {usersRuns.length > 0 &&
                    <View style={Styles.progressContainer}>
                        <View
                            style={Styles.runStats}
                        >
                            <View>
                                <Text style={Styles.distanceText}>{distance}</Text>
                                <Text style={Styles.kiloText}>kilometers</Text>
                            </View>
                            <View
                                style={Styles.rightSide}
                            >
                                <Text style={Styles.innerRunText}><Text style={Styles.runText}>{runAmount}</Text> total runs</Text>
                                <Text style={Styles.timeText}>{totalTime}</Text>
                                <Text style={Styles.totalTimeText}>total time</Text>
                            </View>

                        </View>
                        <View
                            style={Styles.graphView}
                        >
                            {
                                weeklyData?.length===7
                                &&
                                <LineChart 
                                data={{
                                    labels: labels,
                                    datasets: [
                                        {
                                            data: data,
                                            strokeWidth: 2,
                                        },
                                ],
                                }}
                                width={Dimensions.get('window').width - 100}
                                withDots={false}
                                height={200}
                                withInnerLines={false}
                                chartConfig={{
                                    backgroundGradientFrom: 'white',
                                    backgroundGradientFromOpacity: 0.5,
                                    backgroundGradientTo: 'white',
                                    fillShadowGradientFrom: 'orange',
                                    fillShadowGradientTo: 'white',
                                    fillShadowGradientToOpacity: 1,
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    style: {
                                        borderRadius: 16
                                    },
                                }}
                                style={{ marginVertical: 16,
                                borderRadius: 16
                                }}
                                bezier
                                />

                            }

                            <View
                                style={Styles.radio}
                            >
                            
                                <SegmentedControlTab 
                                    values={["Week","Month","Year"]}
                                    selectedIndex={graphOption}
                                    onTabPress={(l) => setGraphOption(l)}
                                    activeTabStyle={Styles.activeTabStyle}
                                    tabStyle={Styles.tabStyle}
                                    tabTextStyle={Styles.tabTextStyle}
                                />

                            </View>

                            

                        
                        
                            
                        </View>

                    </View>
                }
               
                {/* If user has completed runs then the userRuns is looped through and the five most recent is displayed. */}
                {usersRuns.length>0 &&
                    <View style={Styles.runContainer}>
                        <View style={Styles.rowContainer}>
                            <Text style={Styles.runTitle}>Recent Runs</Text>
                            <Pressable
                                style={Styles.viewAllContainer}
                                onPress={() => {navigation.navigate('ViewAllRuns')}}
                            >
                                <Text style={Styles.viewText}>View All</Text>
                            </Pressable>  
                        </View>
                        <View>
                            {
                                usersRuns.map((run, i) => {
                                    return(i < 5 
                                        ? 
                                            <Pressable onPress={() => {
                                                navigation.navigate('ViewRun', {
                                                    id: run.runID, 
                                                    coords: run.runCoordinates,
                                                    date: run.runDate,
                                                    distance: run.runDistance,
                                                    pace: run.runPace,
                                                    time: run.runTime,
                                                    feeling: run.runFeeling,
                                                    notes: run.runNotes
                                                } )}} key = {i}>
                                                <View style={Styles.singleRunContainer} key={i}>
                                                    <MapView
                                                        ref={(ref) => mapRefs.current[i] = ref}
                                                        onMapReady = {() => mapRefs.current[i].fitToCoordinates(run.runCoordinates, {
                                                            edgePadding: {
                                                                top: 25,
                                                                right: 25,
                                                                bottom: 25,
                                                                left: 25
                                                            },
                                                            animated: true
                                                        })}
                                                        style={Styles.mapStyle}
                                                        showsUserLocation={false}
                                                        provider='google'
                                                        followsUserLocation={false}
                                                        showsPointsOfInterest={false}
                                                        rotateEnabled={false}
                                                        scrollEnabled={false}
                                                        zoomEnabled={false}
                                                    >
                                                        <Polyline 
                                                            coordinates={run.runCoordinates}
                                                            strokeColor='orange'
                                                            strokeWidth={3}
                                                        />
                                                    </MapView>
                                                    <View style={Styles.singleRunTextContainer}>
                                                        <Text style={Styles.dateString}>{new Date(run.runDate.toDate()).toDateString()} at {new Date(run.runDate.toDate()).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true})}</Text>
                                                        <Text style={Styles.dateString}>Total time: {run.runTime}</Text>
                                                        <View style={Styles.singleRunStatsContainer}>
                                                            <View>
                                                                <Text style={Styles.singleRunDistance}>{run.runDistance}</Text>
                                                                <Text style={Styles.singleRunKilo}>kilometers</Text>
                                                            </View>
                                                            <View style={Styles.singleRightSide}>
                                                                <Text style={Styles.singleRunDistance}>{run.runPace}"</Text>
                                                                <Text style={Styles.singleRunKilo}>avg pace</Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                
                                                </View>
                                            </Pressable>
                                        : 
                                            null
                                    )
                                })
                            }
                            
                        </View>
                    </View>
                }    
            </ScrollView>

            <LinearGradient 
                    colors={['rgba(235,149,50,0.8)','rgba(240,255,0,0.4)']}
                    style={Styles.circle}
            />
            
        </View>
    )
}

export default ActivityScreen;

const Styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title:{
        alignSelf:'center',
        marginTop: 70,
        marginLeft: 50
    },
    progressContainer : {
        backgroundColor: 'rgba(0,0,0,0.05)',
        width: '90%',
        alignSelf: 'center',
        marginTop: 20,
        padding: 10,
        borderRadius: 10,  
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3
    },
    runContainer: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 20,
        minHeight: 300,
        borderRadius: 10,
        padding: 15,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3
    },
    runTitle: {
        fontSize: 20,
        letterSpacing: 5,
        fontWeight: '400',
        marginBottom: 20,
        marginTop: 5,
        marginLeft: 5,
        fontWeight: '600'
    },
    singleRunContainer: {
        width:'100%',
        marginBottom: 15,
        borderRadius: 10,
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 20,
    },
    mapStyle: {
        alignSelf: 'stretch',
        height: 90,
        width: '30%',
        borderRadius: 10
    },
    radio: {
        width: '80%',
        alignSelf: 'center'
    },
    graphView: {
        alignItems: 'center',
    },
    runStats: {
        width: '90%',
        flexDirection: 'row',
        alignSelf:'center'
    },
    distanceText:{
        marginTop: 15,
        fontSize: 40,
        fontWeight: '900',
        letterSpacing: 2
    },
    kiloText: {
        letterSpacing: 8
    },
    runText: {
        fontSize: 35,
        fontWeight: '900',
        letterSpacing: 5
    },
    innerRunText: {
        letterSpacing: 5
    },
    rightSide: {
        marginLeft: 25
    },
    activeTabStyle: {
        backgroundColor: 'orange',
        borderColor: 'orange'
    },
    tabStyle: {
        borderColor: 'orange',
    },
    tabTextStyle: {
        color: 'orange'
    },
    timeText: {
        fontWeight: '900',
        fontSize: 20,
        letterSpacing: 7,
        marginTop: 5
    },
    totalTimeText: {
        letterSpacing: 9,
    },
    singleRunTextContainer: {
        marginLeft: 20
    },
    dateString: {
        color: 'rgba(0,0,0,0.5)',
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
        letterSpacing: 3
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
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    viewAllContainer: {
        marginTop: 10,
        marginRight: 10
    },
    viewText: {
        fontSize: 15,
        letterSpacing: 3
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
    newContainer : {
        width: '90%',
        height: 300,
        backgroundColor: 'rgba(0,0,0,0.1)',
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 20,
        padding: 20
    },
    newText: {
        fontSize: 20,
        letterSpacing: 2,
        fontWeight: '600',
        alignSelf: 'center',
        marginBottom: 10,
        textAlign: 'center'
    },
    newRunButton: {
        backgroundColor: 'rgba(243,156,18,0.8)',
        width: 150,
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20
    }

});