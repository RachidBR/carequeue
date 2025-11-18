import React from 'react';
import {View, Text, StyleSheet, TextInput, Button} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {addPost} from '@/state/posts/postsSlice';
import {AppDispatch} from '@/state/store';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

const CreatePostScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const {t} = useTranslation();

  const CreatePostSchema = Yup.object().shape({
    title: Yup.string().trim().required(t('createPost.titleRequired')),
    body: Yup.string().trim().min(5, t('createPost.bodyTooShort')),
  });

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
            }),
          );
          helpers.resetForm();
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
});

export default CreatePostScreen;
