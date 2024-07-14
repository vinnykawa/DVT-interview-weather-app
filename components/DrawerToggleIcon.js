import * as React from "react";
import { View, TouchableOpacity, Image } from "react-native";

const CustomDrawerToggle = (props) => {
  //Structure for the navigatin Drawer
  const toggleDrawer = () => {
    //Props to open/close the drawer
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity onPress={toggleDrawer}>
        {/*Donute Button Image */}
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