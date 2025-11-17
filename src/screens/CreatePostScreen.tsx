// TODO: upload image to Firebase Storage → get URL
// TODO: save Firestore doc { text: v.text, imageUrl import React from 'react';
import {View, Text, StyleSheet, TextInput, Button} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {addPost} from '@/state/posts/postsSlice';
import {AppDispatch} from '@/state/store';
import {useNavigation} from '@react-navigation/native';

const CreatePostSchema = Yup.object().shape({
  title: Yup.string().trim().required('Title is required'),
  body: Yup.string().trim().min(5, 'Body is too short'),
});

const CreatePostScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Post</Text>

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
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={values.title}
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              placeholder="Enter a clear title"
            />
            {touched.title && errors.title ? (
              <Text style={styles.error}>{errors.title}</Text>
            ) : null}

            <Text style={styles.label}>Body</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={values.body}
              onChangeText={handleChange('body')}
              onBlur={handleBlur('body')}
              placeholder="Write the content of the post..."
              multiline
            />
            {touched.body && errors.body ? (
              <Text style={styles.error}>{errors.body}</Text>
            ) : null}

            {/* Later: add image picker section here */}

            <View style={styles.buttonWrapper}>
              <Button title="Publish" onPress={() => handleSubmit()} />
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
