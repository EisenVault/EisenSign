import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import baseStyles from "../styles/baseStyles.js";
import { AuthContext } from "./AuthContext";

const LoginScreen = ({ navigation }) => {
  const { signIn } = useContext(AuthContext);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [instanceURL, setInstanceURL] = React.useState("");

  const verifyHTTPSandSignIn = (propsPassed) => {
    var fixedURL = "";
    if (propsPassed.instanceURL.startsWith("https://")) {
      fixedURL = propsPassed.instanceURL;
    } else if (propsPassed.instanceURL.startsWith("http://")) {
      alert("Instance URL must use https. Please check and try again.");
      return;
    } else {
      fixedURL = "https://" + propsPassed.instanceURL;
    }
    propsPassed.instanceURL = fixedURL;

    signIn(propsPassed);
  };

  return (
    <KeyboardAvoidingView
      style={baseStyles.body}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={baseStyles.innerView}>
          <Image
            source={require("../../assets/MobileMast-01.png")}
            style={baseStyles.mastImage}
          />
        </View>
        <View style={baseStyles.loginView}>
          <TextInput
            style={baseStyles.textInput}
            placeholder="URL (https://eisenvault.net/)"
            value={instanceURL}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={setInstanceURL}
          />
          <TextInput
            style={baseStyles.textInput}
            placeholder="Username"
            value={username}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={setUsername}
          />
          <TextInput
            style={baseStyles.textInput}
            placeholder="Password"
            autoCorrect={false}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={baseStyles.loginScreenButton}
            onPress={() =>
              verifyHTTPSandSignIn({ username, password, instanceURL })
            }
            underlayColor="#fff"
          >
            <Text style={baseStyles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={baseStyles.mast}>
          <Text>&#169; 2020, Argali Knowledge Services Pvt. Ltd.</Text>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
