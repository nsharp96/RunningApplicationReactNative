import { useState } from "react";
import { signOut, getAuth } from "firebase/auth";
import { auth, db } from '../config/firebase';
import { addDoc, collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, updateDoc, getCountFromServer, deleteDoc } from "firebase/firestore";
import React from 'react';
import moment from "moment";



const AccountContext = React.createContext();

export function AccountContextProvider({children}) {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState({
        DisplayName: '',
    })
    const [usersRuns, setUsersRuns] = useState([]);
    const [fetchedUsersRuns, setFetchedUsersRuns] = useState(false);
    const [ weeklyDistance, setWeeklyDistance ] = useState(0);
    const [ currentMonthDistance, setCurrentMonthDistance ] = useState(0);
    const [ yearDistance, setYearDistance ] = useState(0);
    const [ weeklyData, setWeeklyData ] = useState([0,0,0,0,0,0,0]);
    const [ monthlyData, setMonthData ] = useState([]);
    const [ monthLabels, setMonthLabels ] = useState([]);
    const [ yearData, setYearData ] = useState([]);
    const [ weeklyRunAmount, setWeeklyRunAmount ] = useState(0);
    const [ weeklyTimeAmount, setWeeklyTimeAmount ] = useState(0);
    const [ montlyRunAmount, setMonthlyRunAmount ] = useState(0);
    const [ monthlyTimeAmount, setMonthlyTimeAmount ] = useState(0);
    const [ yearlyRunAmount, setYearlyRunAmount ] = useState(0);
    const [ yearlyTimeAmount, setYearlyTimeAmount ] = useState(0);
    const [ currentRun, setCurrentRun ] = useState([]);
    const [ runStreak, setRunStreak ] = useState(0);
    const [ streakType, setStreakType ] = useState('');
    const [ badges, setBadges ] = useState('');

    //Function that enables the user to log into their account using firebase authernication
    const handleLogin = (email, password) => {
        auth
        .signInWithEmailAndPassword(email, password)
        .then(userDet => {
            setUser(userDet.user);
            setIsLoggedIn(true);
            console.log('Logged in as: '+userDet.user.email);
        })
        .catch(error => alert(error.message))
    };

    //Function that enables the user to log out of their account using firbase authernication.
    const handleLogOut =() => {
        const auth = getAuth();
        signOut(auth).then(() =>{
            setIsLoggedIn(false);
            setUser(null);
            setUserData([]);
        }).catch((error) => {
            alert(error)
        })
    }

    //Function that enables the user to create an account using firebase authenication. Also sets up a user document and badge document to hold their user and badge data.
    const handleCreateAccount = (displayName, email, password) => {
        auth
        .createUserWithEmailAndPassword(email, password)
        .then((userDet) => {
            setUser(userDet.user);
            setIsLoggedIn(true);
            console.log('Logged in as: '+userDet.user.email);
            async function addUserToDatabase() {
                await setDoc(doc(db, "Users", userDet.user.email.toLowerCase()),
                {
                    DisplayName: displayName,
                    Email: userDet.user.email,
                });
            }
            addUserToDatabase();
            async function createUsersBadgeCollection(){
                await setDoc(doc(db, "Badges", userDet.user.email.toLowerCase()), {
                    FiveRuns: false,
                    TenRuns: false,
                    TwentyRuns: false,
                    ThirtyRuns: false,
                    FiftyRuns: false,
                    OneHundredRuns: false,
                    FiveK: false,
                    TenK: false,
                    TwentyK: false
                })
            }
            createUsersBadgeCollection()
        })
        .catch(error => alert(error.message))
    }

    //Function that fetches the users data from the user collection within firebase
    async function handleFetchUserData(){
        const user = doc(db, "Users", auth.currentUser.email);
        const usersnap = await getDoc(user);
        const userdata = usersnap.data();
        setUserData({
            DisplayName: usersnap.data().DisplayName
        })
    }

    //Function that uploads a run to the Runs collection within firebase. The function also calls onto the updateAwards to see if the see run and previous ones earn any new badges.
    async function handleUploadRun(coordinates, distance, pace, time, feeling, notes, user, navigation){
        handleFetchBadges();
        const docRef = await addDoc(collection(db, "Runs"), {
            runDate: new Date(),
            runCoordinates: coordinates,
            runDistance: distance,
            runPace: pace,
            runTime: time,
            runFeeling: feeling,
            runNotes: notes,
            userID: user
        });
        handleUpdateAwards()
        navigation.replace('RunStack');
        navigation.navigate('Activity');
    }

    //Function that updates the users badges. It fetches the amount of runs they have completed and the runs. It checks the distance of each run and the number of runs.
    async function handleUpdateAwards(){
        let updatedBadges = {
            FiftyRuns: false,
            FiveK:  false,
            FiveRuns:  false,
            OneHundredRuns: false,
            TenK: false,
            TenRuns: false,
            ThirtyRuns: false,
            TwentyRuns: false
        };
        let change = false;
        
        //Check total amount of runs
        const runQuery = query(collection(db, "Runs"), where("userID", "==", auth.currentUser.email));
        const runSnap = await getCountFromServer(runQuery);
        const runSnapTwo = await getDocs(runQuery);

        runSnapTwo.forEach((run) => {
            if(run.data().runDistance>20.00){
                updatedBadges.FiveK = true;
                updatedBadges.TenK = true;
                updatedBadges.TwentyK = true;
                change = true;
            }
            else if(run.data().distance>10.00){
                updatedBadges.FiveK = true;
                updatedBadges.TenK = true;
                change = true;
            }
            else if(run.data().runDistance>5.00){
                updatedBadges.FiveK = true;
                change = true;
            }

        })

        const numOfRuns = runSnap.data().count;
        if(numOfRuns>=100){
            updatedBadges.OneHundredRuns = true;
            updatedBadges.FiftyRuns = true;
            updatedBadges.ThirtyRuns = true;
            updatedBadges.TwentyRuns = true; 
            updatedBadges.TenRuns = true;
            updatedBadges.FiveRuns = true;
            change = true;
        }
        else if(numOfRuns>=50){
            updatedBadges.FiftyRuns = true;
            updatedBadges.ThirtyRuns = true;
            updatedBadges.TwentyRuns = true; 
            updatedBadges.TenRuns = true;
            updatedBadges.FiveRuns = true;
            change = true;
        }
        else if(numOfRuns>=30){
            updatedBadges.ThirtyRuns = true;
            updatedBadges.TwentyRuns = true; 
            updatedBadges.TenRuns = true;
            updatedBadges.FiveRuns = true;
            change = true;
        }
        else if(numOfRuns>=20){
            updatedBadges.TwentyRuns = true; 
            updatedBadges.TenRuns = true;
            updatedBadges.FiveRuns = true;
            change = true;
        }
        else if(numOfRuns>=10){
            updatedBadges.TenRuns = true;
            updatedBadges.FiveRuns = true;
            change = true;
        }
        else if(numOfRuns>=5){
            updatedBadges.FiveRuns = true;
            change = true;
        }

        if(change==false){
            console.log("no change to badges")
        }
        else{
            console.log("change to badge")
            const badgeRef = doc(db, "Badges", auth.currentUser.email);
            const update = await updateDoc(badgeRef, 
                updatedBadges);
        }
    

        handleFetchBadges();
    }

    //Function to fetch the users runs from the runs collection. It also goes through the data and gets it ready from the stats by getting graph data and overal distacne, time and runs. 
    async function handleFetchRuns(user){
        setUsersRuns([]);
        const runQuery = query(collection(db, "Runs"), where("userID", "==", user), orderBy("runDate", "desc"));
        const runSnap = await getDocs(runQuery);

        const start = moment().startOf('isoWeek').toDate();
        const end = moment().endOf('isoWeek').toDate();
        let distance = 0;

        const startMonth = moment().startOf('month').toDate();
        const endMonth = moment().endOf('month').toDate();
        let monthDistance = 0;

        const startYear = moment().startOf('year').toDate();
        const endYear = moment().endOf('year').toDate();
        let yearDistance = 0;

        runSnap.forEach( async(run) => {
            setUsersRuns((prevRuns) => [
                ...prevRuns,
                {
                    runID: run.id,
                    runDate: run.data().runDate,
                    runCoordinates: run.data().runCoordinates,
                    runDistance: run.data().runDistance,
                    runPace: run.data().runPace,
                    runTime: run.data().runTime,
                    runFeeling: run.data().runFeeling,
                    runNotes: run.data().runNotes,
                }
            ])

            const date = new Date(run.data().runDate.toDate());
            if(date>=start && date<=end){ 
                distance += run.data().runDistance;
            }
            if(date>=startMonth && date<=endMonth){
                monthDistance += run.data().runDistance;
            }
            if(date>=startYear && date<=endYear){
                yearDistance += run.data().runDistance;
            }
        })

        //Loop through each day of the week
        var weekDays = [];
        var weekRuns = 0;
        var weekTime = 0;
        for(let i = 1; i<=7; i++){
            let dateDistance = 0;
            const date = moment(start).day(i).toDate();
            console.log(date);
            runSnap.forEach((run) => {
                if(date.toDateString() === new Date(run.data().runDate.toDate()).toDateString()){
                    dateDistance += run.data().runDistance
                    weekRuns += 1;
                    const time = run.data().runTime;
                    const timeSplit = time.split(':');
                    const changedTime = (parseFloat(timeSplit[0]*3600)) + (parseFloat(timeSplit[1]*60)) + (parseFloat(timeSplit[2]));
                    weekTime += changedTime;
                }
            })
            weekDays.push(dateDistance);
        }
        if(weekDays.length!= 0){
            setWeeklyData(weekDays);
        }
        setWeeklyRunAmount(weekRuns);
        let hours = Math.floor(weekTime/3600);
        let mins = Math.floor((weekTime - (hours *3600)) / 60);
        let seconds = Math.floor(weekTime - (hours * 3600) - (mins * 60))
        let timeString = hours.toString().padStart(2, '0')+':'+mins.toString().padStart(2, '0')+':'+seconds.toString().padStart(2, '0');
        setWeeklyTimeAmount(timeString);

        //Loop through each day of the month
        const m = moment(endMonth).month();
        if( m==0 || m==2 || m==4 || m==6 || m==7 | m==9 || m==11 ){
            setMonthLabels([1,4,7,10,13,16,19,22,25,28,31])
        }
        else if(m==1){
            setMonthLabels([1,4,7,10,13,16,19,22,25,28])
        }
        else if(m==3 || m==5 || m==8 || m==10)
        {
            setMonthLabels([1,4,7,10,13,16,19,22,25,28,30])
        }
        console.log("start of month "+moment(startMonth).date());
        console.log("end of month "+moment(endMonth).date())
        const endOfLoop = moment(endMonth).date();
        var monthDays =[];
        var monthRuns = 0;
        var monthTime = 0;
        for(let i = 0; i<endOfLoop; i++){
            let dateDistance = 0;
            const date = moment(startMonth).add(i, "days").toDate();
            console.log(date);
            runSnap.forEach((run) => {
                if(date.toDateString() === new Date(run.data().runDate.toDate()).toDateString()){
                    dateDistance += run.data().runDistance
                    monthRuns+=1;
                    const time = run.data().runTime;
                    const timeSplit = time.split(':');
                    const changedTime = (parseFloat(timeSplit[0]*3600)) + (parseFloat(timeSplit[1]*60)) + (parseFloat(timeSplit[2]));
                    monthTime += changedTime;
                }
            })
            monthDays.push(dateDistance);
        }
        if(monthDays.length!= 0){
            setMonthData(monthDays);
        }
        hours = Math.floor(monthTime/3600);
        mins = Math.floor((monthTime - (hours *3600)) / 60);
        seconds = Math.floor(monthTime - (hours * 3600) - (mins * 60))
        timeString = hours.toString().padStart(2, '0')+':'+mins.toString().padStart(2, '0')+':'+seconds.toString().padStart(2, '0');
        setMonthlyTimeAmount(timeString);
        setMonthlyRunAmount(monthRuns);

        //Get distance of each month of year
        var year =[];
        var yearRuns = 0;
        var yearTime = 0;
        const currentYear = moment(new Date()).year()
        for(let i = 0; i<12; i++){
            let monthDistance = 0;
            runSnap.forEach((run) => {
                const runYear = moment(new Date(run.data().runDate.toDate())).year()
                const runDate = moment(new Date(run.data().runDate.toDate())).month()
                if(runYear == currentYear){
                    if(i == runDate){
                        monthDistance = monthDistance + run.data().runDistance
                        yearRuns += 1;
                        const time = run.data().runTime;
                        const timeSplit = time.split(':');
                        const changedTime = (parseFloat(timeSplit[0]*3600)) + (parseFloat(timeSplit[1]*60)) + (parseFloat(timeSplit[2]));
                        yearTime += changedTime;
                    }
                }    
            })
            year.push(monthDistance);
        }

        hours = Math.floor(yearTime/3600);
        mins = Math.floor((yearTime - (hours *3600)) / 60);
        seconds = Math.floor(yearTime - (hours * 3600) - (mins * 60))
        timeString = hours.toString().padStart(2, '0')+':'+mins.toString().padStart(2, '0')+':'+seconds.toString().padStart(2, '0');
        setYearlyTimeAmount(timeString);
        setYearlyRunAmount(yearRuns);
        setYearData(year);
        setWeeklyDistance(distance.toFixed(2));
        setCurrentMonthDistance(monthDistance.toFixed(2));
        setYearDistance(yearDistance.toFixed(2));
        setFetchedUsersRuns(true);

    }

    //Function that fetches data from the Runs collection to only get one run with the ID specified
    async function handleFetchRun(id){
        console.log("wooo")
        const run = doc(db, "Runs", id);
        const snap = await getDoc(run);
        const data = snap.data();
        const runData = {
            runID: id,
            runDate: data.runDate,
            runCoordinates: data.runCoordinates,
            runDistance: data.runDistance,
            runPace: data.runPace,
            runTime: data.runTime,
            runFeeling: data.runFeeling,
            runNotes: data.runNotes,
        }
        setCurrentRun(runData);
    }

    //Function the fetches the users badges from the Badges collection within firebase
    async function handleFetchBadges(){
        const badges = doc(db, "Badges", auth.currentUser.email);
        const badgeSnap = await getDoc(badges);
        const data = badgeSnap.data();
        const badgeData =  {
            FiftyRuns: data.FiftyRuns,
            FiveK:  data.FiveK,
            FiveRuns:  data.FiveRuns,
            OneHundredRuns: data.OneHundredRuns,
            TenK: data.TenK,
            TenRuns: data.TenRuns,
            ThirtyRuns: data.ThirtyRuns,
            TwentyRuns: data.TwentyRuns
        }
        setBadges(badgeData);
        console.log("BADGES   "+data.FiveRuns);
    }

    //Function that calaculates the users runstreak. 
    async function handleCalculateRunStreak(){
        console.log("RUN STREAK")
        let today = new Date();
        let streak = 0;
        match = usersRuns.find((run) => new Date(run.runDate.toDate()).toDateString() == today.toDateString())
        if(match!=undefined){
            streak+=1;
            setStreakType('current');
        }
        else{
            setStreakType('missingToday')
        }
        let match = 'run' ;
        today = moment(today).subtract(1, 'days').toDate();
        while (match!=undefined){
            match = usersRuns.find((run) => new Date(run.runDate.toDate()).toDateString() == today.toDateString())
            if(match!=undefined){
                streak+=1;
            }
            //take a day away
            today = moment(today).subtract(1, 'days').toDate();
            console.log("DAY "+today)
            
            console.log(match)
        }
        setFetchedUsersRuns(false);
        setRunStreak(streak);     
    }

    //Function that deletes a run from the Runs collection withi firebase
    async function deleteRun(id, navigation){
        await deleteDoc(doc(db, 'Runs', id));
        handleUpdateAwards();
        navigation.pop();
    }

    
    return (
        <AccountContext.Provider
            value={{
                user,
                handleLogin,
                isLoggedIn,
                handleCreateAccount,
                userData,
                handleFetchUserData,
                handleUploadRun,
                handleFetchRuns,
                usersRuns,
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
                handleFetchRun,
                currentRun,
                runStreak,
                handleCalculateRunStreak,
                fetchedUsersRuns,
                streakType,
                handleFetchBadges,
                badges,
                deleteRun,
                handleLogOut
            }}
        >
            {children}
        </AccountContext.Provider>
    );
}

export default AccountContext;