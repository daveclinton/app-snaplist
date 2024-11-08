import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { type CameraCapturedPicture, CameraView } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { ImageIcon, X } from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, Image, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Pressable, Text, View } from '@/ui';

// eslint-disable-next-line import/namespace
interface MediaAsset extends MediaLibrary.Asset {
  selected?: boolean;
}

interface MediaPickerSheetProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  onSelectMedia: (media: MediaAsset) => void;
}

type ViewType = 'photos' | 'albums';

const MediaPickerSheet: React.FC<MediaPickerSheetProps> = ({
  bottomSheetModalRef,
  onSelectMedia,
}) => {
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [view, setView] = useState<ViewType>('photos');

  const loadMedia = useCallback(async () => {
    const { assets } = await MediaLibrary.getAssetsAsync({
      first: 20,
      mediaType: ['photo', 'video'],
      sortBy: ['creationTime'],
    });
    setMediaAssets(assets);
  }, []);

  React.useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const renderItem = useCallback(
    ({ item }: { item: MediaAsset }) => (
      <Pressable onPress={() => onSelectMedia(item)} style={styles.mediaItem}>
        <Image source={{ uri: item.uri }} style={styles.thumbnail} />
      </Pressable>
    ),
    [onSelectMedia],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={['75%']}
      enablePanDownToClose
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.sheetIndicator}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => bottomSheetModalRef.current?.close()}>
            <X size={24} color="white" />
          </Pressable>
          <View style={styles.segmentedControl}>
            <Pressable
              style={[
                styles.segmentButton,
                view === 'photos' && styles.activeSegment,
              ]}
              onPress={() => setView('photos')}
            >
              <Text
                style={[
                  styles.segmentText,
                  view === 'photos' && styles.activeSegmentText,
                ]}
              >
                Photos
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.segmentButton,
                view === 'albums' && styles.activeSegment,
              ]}
              onPress={() => setView('albums')}
            >
              <Text
                style={[
                  styles.segmentText,
                  view === 'albums' && styles.activeSegmentText,
                ]}
              >
                Albums
              </Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.permissionText}>
          This app can only access the photos that you select
        </Text>

        <BottomSheetFlatList
          data={mediaAssets}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </BottomSheetModal>
  );
};

interface FullScreenCameraProps {
  onClose: () => void;
  onMediaSelect?: (media: MediaAsset) => void;
  onPhotoCapture?: (photo: CameraCapturedPicture | undefined) => void;
}

const FullScreenCamera: React.FC<FullScreenCameraProps> = React.memo(
  ({ onClose, onMediaSelect, onPhotoCapture }) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [isTakingPicture, setIsTakingPicture] = useState(false);
    const cameraRef = React.useRef<CameraView>(null);

    const handleTakePicture = useCallback(async () => {
      if (!cameraRef.current || isTakingPicture) return;

      try {
        setIsTakingPicture(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: true,
        });
        await MediaLibrary.saveToLibraryAsync(photo!.uri);

        // Notify parent component
        onPhotoCapture?.(photo);
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Failed to take picture. Please try again.', [
          { text: 'OK' },
        ]);
      } finally {
        setIsTakingPicture(false);
      }
    }, [isTakingPicture, onPhotoCapture]);

    const handleSelectMedia = useCallback(
      (media: MediaAsset) => {
        bottomSheetModalRef.current?.close();
        onMediaSelect?.(media);
      },
      [onMediaSelect],
    );

    return (
      <Animated.View entering={FadeIn} style={styles.fullScreenContainer}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <X size={24} color="white" />
        </Pressable>

        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          mode="picture"
        />

        <View style={styles.bottomControls}>
          <Pressable
            onPress={() => {
              bottomSheetModalRef.current?.present();
            }}
            style={styles.galleryButton}
          >
            <ImageIcon size={24} color="white" />
          </Pressable>

          <Pressable
            onPress={handleTakePicture}
            style={[
              styles.captureButton,
              isTakingPicture && styles.captureButtonDisabled,
            ]}
            disabled={isTakingPicture}
          >
            <View style={styles.captureButtonInner} />
          </Pressable>

          <View style={styles.placeholderButton} />
        </View>

        <MediaPickerSheet
          bottomSheetModalRef={bottomSheetModalRef}
          onSelectMedia={handleSelectMedia}
        />
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 1000,
  },
  closeButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
  },
  camera: {
    flex: 1,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    paddingBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  galleryButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
  },
  placeholderButton: {
    width: 44,
    height: 44,
  },
  // Media Picker Sheet Styles
  container: {
    flex: 1,
  },
  sheetBackground: {
    backgroundColor: '#000',
  },
  sheetIndicator: {
    backgroundColor: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  segmentedControl: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 2,
    marginLeft: 16,
  },
  segmentButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeSegment: {
    backgroundColor: '#fff',
  },
  segmentText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  activeSegmentText: {
    color: '#000',
  },
  permissionText: {
    color: '#999',
    textAlign: 'center',
    padding: 16,
    fontSize: 13,
  },
  flatListContent: {
    padding: 4,
  },
  mediaItem: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 2,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
});

export default FullScreenCamera;
