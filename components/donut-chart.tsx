import React from 'react';
import { StyleSheet, View } from 'react-native';
import PieChart from 'react-native-pie-chart';

interface Props {}

const DonutChart: React.FC<Props> = () => {
  const widthAndHeight = 104;
  const series = [123, 321, 389, 123];
  const sliceColor = ['#2280FF', '#fff', '#3DD34C', '#414CAA'];

  return (
    <View style={styles.container}>
      <PieChart
        widthAndHeight={widthAndHeight}
        series={series}
        sliceColor={sliceColor}
        coverRadius={0.7}
        coverFill={'#FFF'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    margin: 10,
  },
});

export default DonutChart;
