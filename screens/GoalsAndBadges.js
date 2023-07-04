import React, { useContext } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import AccountContext from "../context/AccountContext";
import { useFocusEffect } from "@react-navigation/native"

const GoalsAndBadges = () => {

    const { 
        handleFetchBadges, 
        badges 
    } = useContext(AccountContext);

    //When the screen comes into focus the badges are fetched
    useFocusEffect(
        React.useCallback(() => {
            handleFetchBadges();
        },[])
    )

    return(
        <View>
            <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>Badges</Text>
                <View style={styles.rowContainer}>
                    {badges &&
                        <>
                            {badges.FiveK == true 
                                ?
                                <View style={styles.badegBadgeContainer}>
                                    <Image style={styles.badge} source={require('../badges/5KRunColour.png')}/>
                                    <Text style={styles.badgeUnderText}>Ran 5km</Text>
                                </View>
                                :
                                <View style={styles.badegBadgeContainer}>
                                    <Image style={styles.badge} source={require('../badges/5KRunGrey.png')}/>
                                    <Text style={styles.badgeUnderText}>Ran 5km</Text>
                                </View>
                            }
                            {badges.TenK == true 
                                ?
                                <View style={styles.badegBadgeContainer}>
                                    <Image style={styles.badge} source={require('../badges/10KRunColour.png')}/>
                                    <Text style={styles.badgeUnderText}>Ran 10km</Text>
                                </View>
                                :
                                <View style={styles.badegBadgeContainer}>
                                    <Image style={styles.badge} source={require('../badges/10KRunGrey.png')}/>
                                    <Text style={styles.badgeUnderText}>Ran 10km</Text>
                                </View>
                            }
                            {badges.TwentyK == true 
                                ?
                                <View style={styles.badegBadgeContainer}>
                                    <Image style={styles.badge} source={require('../badges/20kRunColour.png')}/>
                                    <Text style={styles.badgeUnderText}>Ran 20km</Text>
                                </View>
                                :
                                <View style={styles.badegBadgeContainer}>
                                    <Image style={styles.badge} source={require('../badges/20KRunGrey.png')}/>
                                    <Text style={styles.badgeUnderText}>Ran 20km</Text>
                                </View>
                            }
                            {badges.FiveRuns == true 
                                ?
                                <View style={styles.badegBadgeContainer}>
                                    <Image style={styles.badge} source={require('../badges/5RunColour.png')}/>
                                    <Text style={styles.badgeUnderText}>5 Runs</Text>
                                </View>
                                :
                                <View style={styles.badegBadgeContainer}>
                                    <Image style={styles.badge} source={require('../badges/5RunGrey.png')}/>
                                    <Text style={styles.badgeUnderText}>5 Runs</Text>
                                </View>
                            }
                            {badges.TenRuns == true 
                                ?
                                <View style={styles.badegBadgeContainer}>
                                    <Image style={styles.badge} source={require('../badges/10RunColour.png')}/>
                                    <Text style={styles.badgeUnderText}>10 Runs</Text>
                                </View>
                                :
                                <View style={styles.badegBadgeContainer}>
                                    <Image style={styles.badge} source={require('../badges/10RunGrey.png')}/>
                                    <Text style={styles.badgeUnderText}>10 Runs</Text>
                                </View>
                            }
                            {badges.TwentyRuns == true 
                                ?
                                <View style={styles.badegBadgeContainer}>
                                    <Image style={styles.badge} source={require('../badges/20RunColour.png')}/>
                                    <Text style={styles.badgeUnderText}>20 Runs</Text>
                                </View>
                                :
                                <View style={styles.badegBadgeContainer}>
                                    <Image style={styles.badge} source={require('../badges/20RunGrey.png')}/>
                                    <Text style={styles.badgeUnderText}>20 Runs</Text>
                                </View>
                            }
                             {badges.ThirtyRuns == true 
                                ?
                                <View style={styles.badegBadgeContainer}>
                                    <Image style={styles.badge} source={require('../badges/30RunColour.png')}/>
                                    <Text style={styles.badgeUnderText}>30 Runs</Text>
                                </View>
                                :
                                <View style={styles.badegBadgeContainer}>
                                    <Image style={styles.badge} source={require('../badges/30RunGrey.png')}/>
                                    <Text style={styles.badgeUnderText}>30 Runs</Text>
                                </View>
                            }
                             {badges.FiftyRuns == true 
                                ?
                                <View style={styles.badegBadgeContainer}>
                                    <Image style={styles.badge} source={require('../badges/50RunColour.png')}/>
                                    <Text style={styles.badgeUnderText}>50 Runs</Text>
                                </View>
                                :
                                <View style={styles.badegBadgeContainer}>
                                    <Image style={styles.badge} source={require('../badges/50RunGrey.png')}/>
                                    <Text style={styles.badgeUnderText}>50 Runs</Text>
                                </View>
                            }
                             {badges.OneHundredRuns == true 
                                ?
                                <View style={styles.badegBadgeContainer}>
                                    <Image style={styles.badge} source={require('../badges/100RunColour.png')}/>
                                    <Text style={styles.badgeUnderText}>100 Runs</Text>
                                </View>
                                :
                                <View style={styles.badegBadgeContainer}>
                                    <Image style={styles.badge} source={require('../badges/100RunGrey.png')}/>
                                    <Text style={styles.badgeUnderText}>100 Runs</Text>
                                </View>
                            }
                        </>
                    }

                </View>
            </View>

            <LinearGradient 
                    colors={['rgba(235,149,50,0.8)','rgba(240,255,0,0.4)']}
                    style={styles.circle}
            />
        </View>
    )
};

export default GoalsAndBadges;

const styles = StyleSheet.create({
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
    badgeContainer: {
        width: '90%',
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignSelf: 'center',
        borderRadius: 20,
        marginTop:30
    },
    badgeText: {
        fontSize: 20,
        letterSpacing: 5,
        marginLeft: 20,
        marginTop: 20,
        fontWeight: '600'
    },
    rowContainer: {
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'flex-start',
        flexWrap: 'wrap'
    },
    badge: {
        height: 75,
        width: 75
    },
    badgeUnderText: {
        fontWeight: '500',
        alignSelf: 'center',
        letterSpacing: 1,
        marginTop: 2
    },
    badegBadgeContainer: {
        marginRight: 11,
        marginBottom: 20
    }

})