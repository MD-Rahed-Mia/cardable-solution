import { Stack } from 'expo-router'
import React from 'react'

const ProductLayout = () => {
  return (
   <Stack>
    <Stack.Screen name='index' options={{headerShown: false}} />
    <Stack.Screen name='add-product' options={{headerShown: false, title: 'Add Product'}} />
    <Stack.Screen name='edit-product' options={{headerShown: false, title: 'Add Product'}} />
   </Stack>
  )
}

export default ProductLayout