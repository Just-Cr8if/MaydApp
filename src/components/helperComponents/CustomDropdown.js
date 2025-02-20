import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const CustomDropdown = ({ menus, selectedMenu, handleMenuSelect }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedMenu?.id || null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (menus.length > 0) {
      setItems(menus.map((item) => ({ label: item.name, value: item.id })));
    }
  }, [menus]); // Update whenever `menus` changes

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={(callback) => {
          const selectedValue = callback(value);
          setValue(selectedValue);
          const selected = menus.find((item) => item.id === selectedValue);
          handleMenuSelect(selected);
        }}
        setItems={setItems}
        style={styles.dropdown}
        textStyle={styles.text}
        dropDownContainerStyle={styles.dropdownContainer}
        listItemContainerStyle={styles.listItemContainer}
        listItemLabelStyle={styles.listItemLabel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "white",
    zIndex: 1000,
  },
  text: {
    fontSize: 16,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 1000,
  },
  listItemContainer: {
    height: 50,
  },
});

export default CustomDropdown;
