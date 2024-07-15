import * as React from "react";
import { View, TouchableOpacity, Image } from "react-native";

const CustomDrawerToggle = (props) => {
 
  const toggleDrawer = () => {
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity onPress={toggleDrawer}>
        <Image
          source={{
            uri: "https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png",
          }}
          style={{ width: 25, height: 25, marginLeft: 15, marginBottom: 30 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CustomDrawerToggle;