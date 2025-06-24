import SalesProductCard from "@/components/sales/SalesProductCard";
import useAuth from "@/context/authContext";
import { fetchProduct } from "@/redux/features/products/productSlice";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const ProductReport = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const dispatch = useDispatch();
  const { user } = useAuth();

  const { products, isLoading } = useSelector((state) => state.productR);

  const handleStartDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setStartDate(currentDate);
  };
  const handleEndDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setEndDate(currentDate);
  };

  function showStartDate() {
    DateTimePickerAndroid.open({
      value: startDate,
      onChange: handleStartDate,
      mode: "date",
      is24Hour: true,
    });
  }

  function showEndDate() {
    DateTimePickerAndroid.open({
      value: endDate,
      onChange: handleEndDate,
      mode: "date",
      is24Hour: true,
    });
  }

  useEffect(() => {
    if (user && !products) {
      dispatch(fetchProduct(user.uid));
    }
  }, [user?.uid, dispatch, products]);

  function handleRefreshProduct() {
    dispatch(fetchProduct(user.uid));
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={showStartDate}>
          <Text style={styles.buttonText}>
            {startDate.toLocaleDateString("en-GB") || "Start Date"}
          </Text>
        </Pressable>
        <Pressable style={styles.button} onPress={showEndDate}>
          <Text style={styles.buttonText}>
            {endDate.toLocaleDateString("en-GB") || "End Date"}
          </Text>
        </Pressable>
      </View>

      {products && (
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <SalesProductCard
              product={item}
              endData={endDate.toString()}
              startDate={startDate.toString()}
            />
          )}
          keyExtractor={(item) => item.id}
          refreshing={isLoading}
          onRefresh={handleRefreshProduct}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",

    padding: 10,
    borderRadius: 8,
    width: 150,
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: "center",
  },
  salesContainer: {
    flex: 1,
  },
});

export default ProductReport;
