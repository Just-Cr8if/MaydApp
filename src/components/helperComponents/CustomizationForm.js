import React from "react";
import { View, TextInput, Text, Pressable, Switch, Dimensions,
    StyleSheet } from "react-native";

const CustomizationForm = ({ groups = [], setGroups, maxGroupsLimit = 5, maxOptionsLimit = 10 }) => {
    const addGroup = () => {
        // Only add a new group if the current group is valid
        const lastGroup = groups[groups.length - 1];
        if (!lastGroup?.name || (lastGroup.options && lastGroup.options.length === 0)) {
        alert("Please provide a name and at least one option for the current group.");
        return;
        }
    
        setGroups([
        ...groups,
        {
            id: groups.length + 1, // Temporary ID
            name: "",
            required: false,
            minSelections: 1,
            maxSelections: 1,
            options: [],
        },
        ]);
    };
    
    const removeGroup = (id) => {
        setGroups(groups.filter((group) => group.id !== id));
    };
    
    const updateGroup = (id, field, value) => {
        setGroups(
        groups.map((group) =>
            group.id === id ? { ...group, [field]: value } : group
        )
        );
    };
    
    const addOption = (groupId) => {
        setGroups(
        groups.map((group) =>
            group.id === groupId
            ? {
                ...group,
                options: [
                    ...(group.options || []), // Fallback to an empty array
                    { id: (group.options?.length || 0) + 1, name: "", priceModifier: "", description: "" },
                ],
                }
            : group
        )
        );
    };
    
    const removeOption = (groupId, optionId) => {
        setGroups(
        groups.map((group) =>
            group.id === groupId
            ? { ...group, options: group.options.filter((option) => option.id !== optionId) }
            : group
        )
        );
    };
    
    const updateOption = (groupId, optionId, field, value) => {
        setGroups(
        groups.map((group) =>
            group.id === groupId
            ? {
                ...group,
                options: group.options.map((option) =>
                    option.id === optionId ? { ...option, [field]: value } : option
                ),
                }
            : group
        )
        );
    };
    
    return (
        <View style={styles.container}>
        {groups.map((group, groupIndex) => (
            <View key={group.id} style={styles.groupContainer}>
            <Text style={styles.customizableHeader}>Customizable Group</Text>
            <View style={styles.removeButtonContainer}>
                <Pressable onPress={() => removeGroup(group.id)}>
                    <Text style={styles.removeButton}>Remove Group</Text>
                </Pressable>
            </View>
            <TextInput
                style={styles.input}
                placeholder="IE: Choose A Base..."
                value={group.name}
                onChangeText={(value) => updateGroup(group.id, "name", value)}
            />
            <View style={styles.toggleContainer}>
                <Text style={styles.customizableHeaderSubTitle}>Choice Required</Text>
                <Switch
                value={group.required}
                onValueChange={(value) => updateGroup(group.id, "required", value)}
                />
            </View>
            <View style={styles.selectionsContainer}>
                <View style={styles.selectionContainer}>
                    <Text style={styles.customizableHeaderSubTitle}>Minimum Required</Text>
                    <TextInput
                    style={styles.numericInput}
                    placeholder="Min Selections"
                    keyboardType="numeric"
                    value={String(group.minSelections)}
                    onChangeText={(value) => updateGroup(group.id, "minSelections", Number(value))}
                    />
                </View>
                <View style={styles.selectionContainer}>
                    <Text style={styles.customizableHeaderSubTitle}>Maximum Required</Text>
                    <TextInput
                    style={styles.numericInput}
                    placeholder="Max Selections"
                    keyboardType="numeric"
                    value={String(group.maxSelections)}
                    onChangeText={(value) => updateGroup(group.id, "maxSelections", Number(value))}
                    />
                </View>
            </View>
            <Text style={styles.customizableHeader}>Customizable Options</Text>
            {(group.options || []).map((option, optionIndex) => (
                <View key={option.id} style={styles.optionContainer}>
                    <View style={styles.removeButtonContainer}>
                        <Pressable onPress={() => removeOption(group.id, option.id)}>
                            <Text style={styles.removeButton}>Remove Option</Text>
                        </Pressable>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Option Name: White Rice, Brown Rice, etc..."
                        value={option.name}
                        onChangeText={(value) => updateOption(group.id, option.id, "name", value)}
                    />
                    <Text style={styles.customizableHeaderSubTitle}>Price</Text>
                    <TextInput
                        style={styles.priceInput}
                        placeholder="Leave blank if no charge"
                        keyboardType="numeric"
                        value={String(option.priceModifier)}
                        onChangeText={(value) => updateOption(group.id, option.id, "priceModifier", value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Description"
                        value={option.description}
                        onChangeText={(value) => updateOption(group.id, option.id, "description", value)}
                    />
                </View>
            ))}
            {group.options.length < maxOptionsLimit && (
                <View style={styles.removeButtonContainer}>
                    <Pressable 
                        onPress={() => addOption(group.id)}
                    >
                        <Text style={styles.addButton}>+ Add Option</Text>
                    </Pressable>
                </View>
            )}
            </View>
        ))}
        {groups.length < maxGroupsLimit && (
            <Pressable onPress={addGroup}>
                <Text style={styles.addButton}>+ Add Group</Text>
            </Pressable>
        )}
        </View>
    );
    };           

  const mainColor = "#00A6FF"
  const mainColorO = "rgba(0, 166, 255, 0.5)";
  const mint = "#3EB489";
  const darkColor = "#202124";
  const charcoal = "#36454F";
  const lightgrey = "#E5E4E2";
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8,
      marginBottom: 16,
      borderRadius: 4,
    },
    button: {
      backgroundColor: mainColor,
      padding: 12,
      borderRadius: 4,
      alignItems: 'center',
      marginBottom: 16,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    numericInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: 75
      },
      priceInput: {
        width: 200,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
      },
    image: {
      width: 100,
      height: 100,
      marginBottom: 10,
    },
    button: {
      backgroundColor: mainColor,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginVertical: 10,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    checkboxOuterContainer: {
      flexDirection: 'column',
    },
    checkboxRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10, 
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 3,
      marginRight: 10,
    },
    checkboxChecked: {
      backgroundColor: '#007BFF',
    },
    checkboxLabel: {
      fontSize: 14,
    },
    contentContainer: {
      paddingHorizontal: 20
    },
    dropdownContainer: {
      paddingHorizontal: 10
    },
    dropdownItem: {
      marginBottom: 5
    },
    dropdownItemText: {
      fontSize: 15
    },
    customizableButton: {
      color: mainColor,
      fontSize: 15,
      fontWeight: '600'
    },
    customizableButtonContainer: {
      marginVertical: 10
    },
    customizableFormContainer: {
  
    },
    toggleContainer: {
        marginBottom: 10
    },
    selectionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    selectionContainer: {
        alignItems: 'center',
        marginRight: 40
    },
    customizableHeader: {
        fontSize: 20,
        fontWeight: '600',
        marginVertical: 10
    },
    customizableHeaderSubTitle: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 10
    },
    addButton: {
        fontSize: 15,
        color: mainColor,
        fontWeight: '600'
    },
    removeButtonContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        justifyContent: 'flex-end'
    },
    removeButton: {
        fontSize: 15,
        color: mainColor,
        fontWeight: '600'
    }
  });
  

export default CustomizationForm;
  