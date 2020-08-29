import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

Icon.loadFont();

export default function Header({ title, navigation }) {
  const openMenu = () => {
    navigation.navigate("Logout");
  };

  return (
    <View style={styles.header}>
      <AntDesign name="menuunfold" size={24} style={styles.burgerMenu} />
      <View>
        <Text style={styles.headerText}>{title}</Text>
      </View>
      <AntDesign
        name="logout"
        onPress={openMenu}
        size={24}
        style={styles.logoutButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: "100%",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#3E57A9",
  },
  burgerMenu: {
    backgroundColor: "#3E57A9",
    color: "#fff",
    flex: 2,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
    letterSpacing: 1,
    flex: 9,
  },
  logoutButton: {
    backgroundColor: "#3E57A9",
    color: "#fff",
    flex: 1,
  },
});
