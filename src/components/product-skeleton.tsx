import { MotiView, View } from 'moti';
import { StyleSheet } from 'react-native';

const ProductSkeleton = () => (
  <MotiView
    from={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ type: 'timing', duration: 1000, loop: true }}
    style={styles.productCard}
  >
    <View style={[styles.skeletonBox, styles.skeletonImage]} />
    <View style={[styles.skeletonBox, styles.skeletonTitle]} />
    <View style={[styles.skeletonBox, styles.skeletonPrice]} />
  </MotiView>
);

export default ProductSkeleton;

const styles = StyleSheet.create({
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  skeletonBox: {
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
  skeletonImage: {
    width: '100%',
    height: 150,
    marginBottom: 8,
  },
  skeletonTitle: {
    width: '80%',
    height: 12,
    marginBottom: 8,
  },
  skeletonPrice: {
    width: '40%',
    height: 12,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
