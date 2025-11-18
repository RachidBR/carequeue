import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {addPost} from '@/state/posts/postsSlice';
import {AppDispatch} from '@/state/store';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {
  launchCamera,
  launchImageLibrary,
  Asset,
  ImageLibraryOptions,
  CameraOptions,
} from 'react-native-image-picker';

import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';

const CreatePostScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const {t} = useTranslation();

  const [imageUri, setImageUri] = useState<string | null>(null);

  const CreatePostSchema = Yup.object().shape({
    title: Yup.string().trim().required(t('createPost.titleRequired')),
    body: Yup.string().trim().min(5, t('createPost.bodyTooShort')),
  });

  const requestCameraPermission = async () => {
    const perm =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    const result = await request(perm);
    if (result === RESULTS.GRANTED) {
      return true;
    }
    Alert.alert('Permission', 'Camera permission is required.');
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
    Alert.alert('Permission', 'Gallery permission is required.');
    return false;
  };

  const handleTakePhoto = async () => {
    const ok = await requestCameraPermission();
    if (!ok) {
      return;
    }

    const options: CameraOptions = {
      mediaType: 'photo',
      saveToPhotos: true,
    };

    const result = await launchCamera(options);
    if (result.didCancel) {
      return;
    }
    if (result.errorMessage) {
      Alert.alert('Error', result.errorMessage);
      return;
    }

    const asset: Asset | undefined = result.assets?.[0];
    if (asset?.uri) {
      setImageUri(asset.uri);
    }
  };

  const handlePickFromLibrary = async () => {
    const ok = await requestGalleryPermission();
    if (!ok) {
      return;
    }

    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
    };

    const result = await launchImageLibrary(options);
    if (result.didCancel) {
      return;
    }
    if (result.errorMessage) {
      Alert.alert('Error', result.errorMessage);
      return;
    }

    const asset: Asset | undefined = result.assets?.[0];
    if (asset?.uri) {
      setImageUri(asset.uri);
    }
  };

  const handleRemoveImage = () => {
    setImageUri(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('createPost.screenTitle')}</Text>

      <Formik
        initialValues={{title: '', body: ''}}
        validationSchema={CreatePostSchema}
        onSubmit={(values, helpers) => {
          dispatch(
            addPost({
              title: values.title.trim(),
              body: values.body.trim(),
              imageUri,
            }),
          );
          helpers.resetForm();
          setImageUri(null);
          navigation.goBack();
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.form}>
            <Text style={styles.label}>{t('createPost.titleLabel')}</Text>
            <TextInput
              style={styles.input}
              value={values.title}
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              placeholder={t('createPost.titleLabel')}
            />
            {touched.title && errors.title ? (
              <Text style={styles.error}>{errors.title}</Text>
            ) : null}

            <Text style={styles.label}>{t('createPost.bodyLabel')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={values.body}
              onChangeText={handleChange('body')}
              onBlur={handleBlur('body')}
              placeholder={t('createPost.bodyLabel')}
              multiline
            />
            {touched.body && errors.body ? (
              <Text style={styles.error}>{errors.body}</Text>
            ) : null}

            {/* IMAGE PICKER SECTION */}
            <View style={styles.imageSection}>
              <Text style={styles.label}>{t('createPost.addImage')}</Text>
              <View style={styles.imageButtonsRow}>
                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={handleTakePhoto}>
                  <Text style={styles.smallButtonText}>
                    {t('createPost.takePhoto')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={handlePickFromLibrary}>
                  <Text style={styles.smallButtonText}>
                    {t('createPost.chooseFromLibrary')}
                  </Text>
                </TouchableOpacity>
              </View>

              {imageUri ? (
                <View style={styles.previewWrapper}>
                  <Image source={{uri: imageUri}} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={handleRemoveImage}>
                    <Text style={styles.removeImageText}>
                      {t('createPost.removeImage')}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            <View style={styles.buttonWrapper}>
              <Button
                title={t('createPost.submit')}
                onPress={() => handleSubmit()}
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  title: {fontSize: 20, fontWeight: '700', marginBottom: 16},
  form: {gap: 12},
  label: {fontSize: 14, fontWeight: '500'},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  error: {fontSize: 12, color: 'red'},
  buttonWrapper: {marginTop: 16},
  imageSection: {marginTop: 8},
  imageButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  smallButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  previewWrapper: {
    marginTop: 12,
    alignItems: 'flex-start',
    gap: 6,
  },
  previewImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
  },
  removeImageButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeImageText: {
    color: '#DC2626',
    fontSize: 13,
  },
});

export default CreatePostScreen;
