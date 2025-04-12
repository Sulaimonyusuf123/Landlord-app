// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ImageBackground,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import { useRouter } from "expo-router";

// const { height, width } = Dimensions.get("window");

// const LandingScreen = () => {
//   const router = useRouter();

//   return (
//     <ImageBackground
//       source={require("../../assets/images/log01.png")} // Use the grayscale building sketch image
//       style={styles.backgroundImage}
//       imageStyle={styles.backgroundImageStyle}
//       resizeMode="cover"
//     >
//       <View style={styles.container}>
//         <View style={styles.logoContainer}>
//           <Text style={styles.title}>MALIK</Text>
//           <Text style={styles.subtitle}>REAL ESTATE</Text>
//         </View>

//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => router.push("/(auth)/login-landlord")} // Adjust the route as needed
//           >
//             <Text style={styles.buttonText}>Login as LandLord</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => router.push("/(auth)/login-tenant")} // Adjust the route as needed
//           >
//             <Text style={styles.buttonText}>Login as Tenant</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     width: "100%",
//     height: "100%",
//   },
//   backgroundImageStyle: {
//     opacity: 0.2, 
//   },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   logoContainer: {
//     alignItems: "center",
//     marginBottom: 50,
//   },
//   title: {
//     fontSize: 40,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   subtitle: {
//     fontSize: 20,
//     color: "#333",
//     marginTop: 5,
//   },
//   buttonContainer: {
//     width: "100%",
//     alignItems: "center",
//   },
//   button: {
//     backgroundColor: "#00C4B4", 
//     width: "80%",
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });

// export default LandingScreen;