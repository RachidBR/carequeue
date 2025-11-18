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
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { addPost } from '@/state/posts/postsSlice';

const CreatePostScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
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

    setSaving(true);

    // for now, local-only: Redux
    dispatch(
      addPost({
        id: Date.now().toString(),
        title: title.trim(),
        body: body.trim(),
        imageUri,
        createdAt: new Date().toISOString(),
      }),
    );

    setSaving(false);
    navigation.goBack();
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
        <TouchableOpacity style={styles.button} onPress={handlePickFromGallery}>
          <Text style={styles.buttonText}>{t('createPost.chooseImage')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
          <Text style={styles.buttonText}>{t('createPost.takePhoto')}</Text>
        </TouchableOpacity>
      </View>

      {imageUri && (
        <View style={styles.previewContainer}>
          <Image source={{uri: imageUri}} style={styles.preview} />
          <TouchableOpacity
            style={[styles.button, styles.removeButton]}
            onPress={() => setImageUri(null)}>
            <Text style={styles.removeButtonText}>
              {t('createPost.removeImage')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, styles.saveButton]}
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
  button: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {fontSize: 14, fontWeight: '500'},
  previewContainer: {alignItems: 'center', marginBottom: 16},
  preview: {width: '100%', height: 200, borderRadius: 12, marginBottom: 8},
  removeButton: {backgroundColor: '#fee2e2'},
  removeButtonText: {color: '#b91c1c', fontWeight: '600'},
  saveButton: {backgroundColor: '#2563eb', marginTop: 8},
  saveButtonText: {color: 'white', fontWeight: '600'},
});

export default CreatePostScreen;
