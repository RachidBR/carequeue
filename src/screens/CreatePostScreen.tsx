import React, {useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';


const CreatePostScreen: React.FC = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('createPost.title'),
    });
  }, [navigation, t]);

  const requestCameraPermission = async () => {
    const perm =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    const result = await request(perm);
    if (result === RESULTS.GRANTED) {
      return true;
    }
    Alert.alert(t('permissions.cameraRequired'));
    return false;
  };

  const requestGalleryPermission = async () => {
    const perm =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;

    const result = await request(perm);
    if (result === RESULTS.GRANTED) {
      return true;
    }
    Alert.alert(t('permissions.galleryRequired'));
    return false;
  };

  const handleTakePhoto = async () => {
    const ok = await requestCameraPermission();
    if (!ok) {
      return;
    }

    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePickFromGallery = async () => {
    const ok = await requestGalleryPermission();
    if (!ok) {
      return;
    }

    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(t('createPost.errors.titleRequired'));
      return;
    }
    if (!body.trim()) {
      Alert.alert(t('createPost.errors.bodyRequired'));
      return;
    }

    try {
      setSaving(true);

      const docRef = firestore().collection('posts').doc();
      const postId = docRef.id;
      const createdAt = new Date().toISOString();

      await docRef.set({
        id: postId,
        title: title.trim(),
        body: body.trim(),
        imageUrl: null, 
        createdAt,
      });

      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to save post.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('createPost.titleLabel')}</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={t('createPost.titlePlaceholder')}
      />

      <Text style={styles.label}>{t('createPost.bodyLabel')}</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={body}
        onChangeText={setBody}
        placeholder={t('createPost.bodyPlaceholder')}
        multiline
      />

      <View style={styles.imageRow}>
        <TouchableOpacity
          style={[styles.buttonBase, styles.rowButton]}
          onPress={handlePickFromGallery}>
          <Text style={styles.buttonText}>{t('createPost.chooseImage')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonBase, styles.rowButton]}
          onPress={handleTakePhoto}>
          <Text style={styles.buttonText}>{t('createPost.takePhoto')}</Text>
        </TouchableOpacity>
      </View>

      {imageUri && (
        <View style={styles.previewContainer}>
          <Image source={{uri: imageUri}} style={styles.preview} />
          <TouchableOpacity
            style={[styles.saveButton, styles.removeButton]}
            onPress={() => setImageUri(null)}>
            <Text style={styles.removeButtonText}>
              {t('createPost.removeImage')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={saving}>
        <Text style={styles.saveButtonText}>
          {saving ? t('createPost.saving') : t('createPost.save')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: 'white'},
  label: {fontSize: 14, fontWeight: '500', marginBottom: 4},
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 12,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },

  imageRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },

  buttonBase: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  rowButton: {
    flex: 1,
  },

  buttonText: {fontSize: 14, fontWeight: '500'},

  previewContainer: {alignItems: 'center', marginBottom: 16},
  preview: {width: '100%', height: 200, borderRadius: 12, marginBottom: 8},
  removeButton: {backgroundColor: '#fee2e2'},
  removeButtonText: {color: '#b91c1c', fontWeight: '600'},

  saveButton: {
    marginTop: 8,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {color: 'white', fontWeight: '600'},
});

export default CreatePostScreen;
