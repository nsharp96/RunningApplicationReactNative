Instructions on how to launch the app.
1. Open up file or clone the project using the project URL.
2. Run 'npm install' to ensure all correct React Native modules exist.
3. Run 'npm start'. (If you wish to test the run functionality without having to be near a computer with the development server. You can use 'npx expo start run --tunnel'. This will start a tunnel connection
where the device running the code and the development server can be on two different networks.)
4. Scan in barcode from a mobile device and here you can test the code
5. If you want access to a precreated account you can use these details:
Email: ellie66@gmail.com
Password: hellohello

Functionality of the Application
The application uses React Native to create an running application where a user can track a run and store it on a backend firebase databse. It also uses the Firebase Authenication to 
log in/log out and other authenication needs. The application also allows users to keep record of their run streak, find places nearby to run, earn badges and see stats on their
runs.

Dependenices within the application
- npm install firebase
This allows the application to be able to connect to a backend Firebase database. It provides all the built in functions and keywords.
- npm install @react-navigation/native 
Core utilities and navigator for navgiation structure
- npm install @react-navigation/native-stack 
Stack Navigator
- npx expo install expo-linear-gradient 
Linear Gradients used for the background design
- npx expo install react-native-maps 
Displays maps and polylines so the user can see their location on the screen.
- npx expo install expo-location 
Provides the application with geolocation services such as fetching the users location and tracking their location
- npm install @react-native-community/slider 
Sider that is used to get a rating out of 10 the effort of a run
- npm install moment --save 
Library that helps with dates and formats. Use within the graph data
- npm install react-native-chart-kit
Provides the application with charts to provide users statistics
- npm install react-native-svg 
Peer depencies for the chart kit
- npm install react-native-segmented-control-tab
Provides groupbutton on the activity screen where the user can select from week, month or year view.
- npm install react-native-elements 
Used the checkbox functionaliy to provide a checkbox so the user can argee to the privacy policy

