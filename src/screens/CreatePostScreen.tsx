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

import {addPost} from '@/state/posts/postsSlice';
import {notifyNewPost} from '@/services/notifications';
import {Colors, FontSize, FontWeight, Radius, Spacing, TextPresets} from '../theme';
import {getDB, insertPost} from '@/services/db';
import {Post} from '@/state/posts/types';

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
    if (result === RESULTS.GRANTED) return true;

    Alert.alert(t('permissions.cameraRequired'));
    return false;
  };

  const requestGalleryPermission = async () => {
    const perm =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;

    const result = await request(perm);
    if (result === RESULTS.GRANTED) return true;

    Alert.alert(t('permissions.galleryRequired'));
    return false;
  };

  const handleTakePhoto = async () => {
    const ok = await requestCameraPermission();
    if (!ok) return;

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
    if (!ok) return;

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

      const cleanTitle = title.trim();
      const cleanBody = body.trim();

      // create Post object so Redux & SQLite share same data
      const post: Post = {
        id: Date.now().toString(),
        title: cleanTitle,
        body: cleanBody,
        imageUrl: imageUri,
        createdAt: new Date().toISOString(),
      };

      const db = await getDB();
      await insertPost(db, post);

      dispatch(
        addPost({
          title: post.title,
          body: post.body,
          imageUrl: post.imageUrl,
        }),
      );
      await notifyNewPost({title: cleanTitle, body: cleanBody});

      setTitle('');
      setBody('');
      setImageUri(null);
      navigation.goBack();
    } catch (error) {
      console.error('CreatePost : handleSave error', error);
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
          style={styles.imageButton}
          onPress={handlePickFromGallery}>
          <Text style={styles.buttonText}>{t('createPost.chooseImage')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.imageButton} onPress={handleTakePhoto}>
          <Text style={styles.buttonText}>{t('createPost.takePhoto')}</Text>
        </TouchableOpacity>
      </View>

      {imageUri && (
        <View style={styles.previewContainer}>
          <Image source={{uri: imageUri}} style={styles.preview} />
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setImageUri(null)}>
            <Text style={styles.removeButtonText}>
              {t('createPost.removeImage')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleSave}
        disabled={saving}>
        <Text style={styles.primaryButtonText}>
          {saving ? t('createPost.saving') : t('createPost.save')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    backgroundColor: Colors.background,
  },
  label: {
    ...TextPresets.Label,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    fontSize: FontSize.MEDIUM,
    marginBottom: Spacing.sm,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  imageRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  imageButton: {
    flex: 1,
    backgroundColor: Colors.primarySoft,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  secondaryButton: {
    marginTop: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.dangerSoft,
  },
  buttonText: {
    ...TextPresets.Body,
    fontWeight: FontWeight.MEDIUM,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: Radius.lg,
    marginBottom: Spacing.xs,
  },
  removeButtonText: {
    ...TextPresets.Body,
    color: Colors.danger,
    fontWeight: FontWeight.SEMI_BOLD,
  },
  primaryButton: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...TextPresets.Body,
    color: '#FFFFFF',
    fontWeight: FontWeight.SEMI_BOLD,
    fontSize: FontSize.LARGE,
  },
});

export default CreatePostScreen;
