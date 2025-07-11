// src/components/BarcodeGenerator.js
import React from 'react';
import { View } from 'react-native';
import { BarCodeSvg } from 'react-native-barcode-svg';

const BarcodeGenerator = ({ value }) => {
  return (
    <View style={{ alignItems: 'center', marginTop: 20 }}>
      <BarCodeSvg value={value} format="CODE128" height={80} />
    </View>
  );
};

export default BarcodeGenerator;
