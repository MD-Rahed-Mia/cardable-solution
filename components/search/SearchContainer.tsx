import { ProductType } from "@/types/products/product.types";
import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

export interface SearchContainerProps {
  setFilterData: React.Dispatch<React.SetStateAction<ProductType[]>>;
  originalData: ProductType[];
}

export default function SearchContainer({
  setFilterData,
  originalData,
}: SearchContainerProps) {
  const [text, setText] = useState("");

  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function handleSearchText() {
    const escapedText = escapeRegExp(text);
    const pattern = new RegExp(escapedText, "i");
    const filterItems = originalData.filter((item) => pattern.test(item.title));
    setFilterData(filterItems);
  }

  useEffect(() => {
    handleSearchText();
  }, [text]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="search items"
        placeholderTextColor={"gray"}
        style={styles.searchInput}
        onChangeText={(t) => setText(t)}
        value={text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 150,
  },
  searchInput: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "white",
    marginHorizontal: "auto",
    minHeight: 45,
    width: "100%",
    elevation: 5,
    borderRadius: 5
  },
});
