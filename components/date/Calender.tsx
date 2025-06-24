import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export interface CalenderProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

const Calender = ({ date, setDate }: CalenderProps) => {
  const handleDateOpen = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: handleSelectDate,
      mode: "date",
      is24Hour: true,
    });
  };

  const handleSelectDate = (event, selectedDate) => {
    console.log("selected date: ", selectedDate);
    setDate(selectedDate);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleDateOpen}>
      <Text>{date.toLocaleDateString("en-GB")}</Text>
    </TouchableOpacity>
  );
};

export default Calender;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 5,
  },
});
