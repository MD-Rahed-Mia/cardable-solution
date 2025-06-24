import Calender from "@/components/date/Calender";
import SearchContainer from "@/components/search/SearchContainer";
import useAuth from "@/context/authContext";
import { db } from "@/firebaseConfig";
import { setNewProductList } from "@/redux/features/products/productSlice";
import { ProductType } from "@/types/products/product.types";
import {
    addDoc,
    collection,
    doc,
    increment,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import React, { JSX, useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const PostDamage = async (
  damageDate: Date,
  userId: string,
  damageList: ProductType[],
  reduceStock: boolean
) => {
  try {
    const selectedTime = Timestamp.fromDate(damageDate);

    await Promise.all(
      damageList.map((item) =>
        addDoc(collection(db, "users", userId, "damages"), {
          ...item,
          timestamp: selectedTime,
        }).then(async (sales) => {
          if (reduceStock) {
            await updateDoc(doc(db, "users", userId, "products", item.id), {
              stock: increment(-item.damageQuantity),
            });
          }
        })
      )
    );

    return true;
  } catch (error) {
    console.log("Failed to post damage. : ", error);
    return false;
  }
};

type DamageProductType = ProductType & { damageQuantity?: number };

const AddDamage = () => {
  const { products, isLoading } = useSelector((state: any) => state.productR);

  const [damageList, setDamageList] = useState<DamageProductType[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: string }>({});
  const [date, setDate] = useState(new Date());
  const [filterProducts, setFilterProducts] = useState<ProductType[]>(products);
  const { user } = useAuth();

  const dispatch = useDispatch();

  function handleDamageEntry(text: string, product: ProductType) {
    const numberQuantity = Number(text);

    setQuantities((prev) => ({
      ...prev,
      [product.id]: text,
    }));

    if (numberQuantity > 0) {
      setDamageList((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === product.id);

        if (existingIndex !== -1) {
          const updatedList = [...prev];
          updatedList[existingIndex] = {
            ...updatedList[existingIndex],
            damageQuantity: numberQuantity,
          };
          return updatedList;
        } else {
          return [...prev, { ...product, damageQuantity: numberQuantity }];
        }
      });
    } else if (numberQuantity === 0 && quantities[product.id] === "0") {
      setDamageList((prev) => prev.filter((item) => item.id !== product.id));
    }
  }

  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const RenderItem = ({ item }: { item: ProductType }): JSX.Element => (
    <View style={styles.productCard}>
      <View style={styles.detailsBox}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text>
          Dealer Price: &#2547;{item.dealerPrice?.toFixed(2) || "N/A"}
        </Text>
        <Text>Trade Price: &#2547;{item.tradePrice?.toFixed(2) || "N/A"}</Text>
        <Text>Stock: {item.stock ?? "N/A"}</Text>
      </View>
      <View>
        <TextInput
          placeholder="Qty"
          placeholderTextColor={"gray"}
          keyboardType="numeric"
          style={styles.inputBox}
          onChangeText={(text) => handleDamageEntry(text, item)}
          value={quantities[item.id] || ""}
        />
      </View>
    </View>
  );

  const StockSwitch = () => (
    <View>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );

  const handlePostDamage = async () => {
    try {
      const result = await PostDamage(date, user?.uid, damageList, isEnabled);
      if (result) {
        Alert.alert("Successfully damage added.");

        const filterItem = damageList.every((item) => {
          // console.log("item : ", item);

          const findIndex = filterProducts.findIndex((pr) => pr.id === item.id);

          console.log("index: ", findIndex);

          //   filterProducts[findIndex] = {
          //     ...filterProducts[findIndex],
          //     stock:
          //       Number(filterProducts[findIndex]) - Number(item.damageQuantity),
          //   };

          const updateStock = filterProducts.map((product, index) => {
            if (index === findIndex) {
              return {
                ...product,
                stock: product.stock - Number(item.damageQuantity),
              };
            } else {
              return product;
            }
          });
          setFilterProducts(updateStock);
          dispatch(setNewProductList(updateStock));
        });

        setDamageList([]);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.loadingText}>Loading products...</Text>
      ) : products && products.length > 0 ? (
        <FlatList
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Damage Entry</Text>
              <View style={styles.searchContainer}>
                <SearchContainer
                  originalData={products}
                  setFilterData={setFilterProducts}
                />
                <View style={{ width: "50%" }}>
                  <Calender date={date} setDate={setDate} />
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text>Damage Item: {damageList.length}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <StockSwitch />
                  <Text>Reduce Stock</Text>
                </View>
              </View>
            </View>
          }
          data={filterProducts}
          renderItem={RenderItem}
          keyExtractor={(item) => item.id.toString()}
          stickyHeaderIndices={[0]}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No products found.</Text>
          }
          ListFooterComponent={
            <View>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={handlePostDamage}
              >
                <Text style={styles.buttonTitle}>Post Damage</Text>
              </TouchableOpacity>
            </View>
          }
        />
      ) : (
        <Text style={styles.emptyListText}>
          No products available to add damage.
        </Text>
      )}
    </View>
  );
};

export default AddDamage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
  },
  header: {
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  searchContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 5,
    marginVertical: 5,
  },
  productCard: {
    marginVertical: 8,
    elevation: 3,
    backgroundColor: "white",
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: "row",
    paddingVertical: 12,
    gap: 15,
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsBox: {
    flex: 1,
  },
  inputBox: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 70,
    borderColor: "#ccc",
    borderWidth: 1,
    fontSize: 18,
    color: "black",
    textAlign: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
    color: "gray",
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
    color: "gray",
  },
  buttonContainer: {
    width: "100%",
    backgroundColor: "green",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: {
    color: "white",
  },
});
