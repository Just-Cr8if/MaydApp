import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomDropdownSmall = ({ tables, selectedTable, setSelectedTable }) => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(selectedTable?.id || null);

  const handleSelect = (item) => {
    setSelectedValue(item.id);
    handleTableSelect(tables.find(table => table.id === item.id));
    setOpen(false);
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => setOpen(!open)} 
        style={styles.dropdownHeader}
        activeOpacity={0.8}
      >
        <Text style={styles.dropdownText}>
          {tables.find(table => table.id === selectedValue)?.table_number || 'Select...'}
        </Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdownList}>
          {tables.map(table => (
            <TouchableOpacity 
              key={table.id} 
              onPress={() => handleSelect(table)} 
              style={styles.dropdownItem}
              activeOpacity={0.8}
            >
              <Text style={styles.dropdownItemText}>{table.table_number}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10
  },
  dropdownHeader: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
  },
});

export default CustomDropdownSmall;