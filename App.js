import { Pressable, StyleSheet, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import AccountContext, {AccountContextProvider} from './context/AccountContext';
import { useContext } from 'react';
import Home from './screens/Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome5';
import RunScreen from './screens/RunScreen';
import ActivityScreen from './screens/ActivityScreen';
import RunResult from './screens/RunResult';
import ViewRun from './screens/ViewRun';
import ViewAllRuns from './screens/ViewAllRuns';
import GoalsAndBadges from './screens/GoalsAndBadges';

//Stack and Tab Navigator
const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();


//Function that determins what icon each tab should haev
const screenOptions = (route, color) => {
  let iconName;
  switch (route.name) {
    case 'Home':
      return <Ionicons name={'home-outline'} color={color} size={24} />
    case 'Run':
      return <FontAwesome name={'running'} size={24} color={color} />
    case 'Activity':
      return <Ionicons name={'fitness-outline'} size={24} color={color} />
    case 'Badges':
      return <Ionicons name={'ribbon-outline'} size={24} color={color}/>
    default:
      break;
  }
};

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name='SignIn' 
        component={SignInScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='SignUp'
        component={SignUpScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return(
    <Stack.Navigator>
      <Stack.Screen
        name='HomeStack'
        component={Home}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}

const ActivityStack = () => {
  return(
    <Stack.Navigator>
      <Stack.Screen
        name='ActivityStack'
        component={ActivityScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name = 'ViewRun'
        component={ViewRun}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name = 'ViewAllRuns'
        component={ViewAllRuns}
        options={{
          headerShown: false
        }}
      />

    </Stack.Navigator>
  )
}

const RunStack = () => {
  return(
    <Stack.Navigator >
      <Stack.Screen
        name='RunStack'
        component={RunScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='RunResult'
        component={RunResult}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
    
  )
}

const BadgeStack = () => {
  return(
    <Stack.Navigator >
      <Stack.Screen
      name = 'BadgesAndGoals'
      component={GoalsAndBadges}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
    
  )
}

const AppStack = () => {

  const { handleLogOut } = useContext(AccountContext);
  return(
    <Tabs.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color}) => screenOptions(route, color),
        tabBarInactiveTintColor: 'grey',
        tabBarActiveTintColor: 'orange',
        tabBarStyle: {
          backgroundColor: 'white',
        },
      })}
    >
      <Tabs.Screen
        name='Home'
        component={HomeStack}
        options={{
          headerTitle: props => <Text style={styles.headText}>Home</Text>,
          headerRight: () => (
            <Pressable
              style={{
                marginRight: 10
              }}
              onPress={()=>{handleLogOut()}}
            >
              <Ionicons name='log-out-outline' size={30} color='black'/>
            </Pressable>
          )
        }}
      />
      <Tabs.Screen
        name='Run'
        component={RunStack}
        options={{
          headerTitle: props => <Text style={styles.headText}>Run</Text>
        }}
      />
      <Tabs.Screen 
        name='Badges'
        component={BadgeStack}
        options={{
          headerTitle: props => <Text style={styles.headText}>Badges and Goals</Text>
        }}
      />
      <Tabs.Screen
        name='Activity'
        component={ActivityStack}
        options={{
          headerTitle: props => <Text style={styles.headText}>Activity</Text>
        }}
      />
    </Tabs.Navigator>
  );
};

//Authenication. Checks to see if the user is logged in or not. If the user is then they have acccess to the applciation screens otherewise they only have access to the sign in or create account. 
const AuthFlow = () => {
  const {isLoggedIn} = useContext(AccountContext);

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

//The AuthFlow is wrapped aorund the AcountContextProvider so that all the screens have access to the values and functions with the context.
export default function App() {
  return (
    <AccountContextProvider>
      <AuthFlow />
    </AccountContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headText:{
    fontSize: 20,
    letterSpacing: 5,
    fontWeight: '500'
  }
});
