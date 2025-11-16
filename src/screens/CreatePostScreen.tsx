import * as React from 'react';
import {View, TextInput, Button, Image, Alert} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const Schema = Yup.object({text: Yup.string().min(1).required()});

export default function CreatePostScreen() {
  const [imageUri, setImageUri] = React.useState<string | undefined>();

  const pickFromLibrary = async () => {
    const res = await launchImageLibrary({mediaType: 'photo'});
    const uri = res.assets?.[0]?.uri;
    if (uri) setImageUri(uri);
  };
  const takePhoto = async () => {
    const res = await launchCamera({mediaType: 'photo'});
    const uri = res.assets?.[0]?.uri;
    if (uri) setImageUri(uri);
  };

  return (
    <Formik
      initialValues={{text: ''}}
      validationSchema={Schema}
      onSubmit={async v => {
        try {
          // TODO: upload image to Firebase Storage → get URL
          // TODO: save Firestore doc { text: v.text, imageUrl }
          Alert.alert('Posted', 'Will save to Firestore in the next step');
        } catch (e) {
          Alert.alert('Error', String(e));
        }
      }}>
      {({handleChange, handleBlur, handleSubmit, values}) => (
        <View style={{flex: 1, padding: 16, gap: 12}}>
          <TextInput
            placeholder="Write something…"
            value={values.text}
            onChangeText={handleChange('text')}
            onBlur={handleBlur('text')}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              padding: 12,
            }}
          />
          {imageUri ? (
            <Image
              source={{uri: imageUri}}
              style={{width: '100%', height: 200, borderRadius: 8}}
            />
          ) : null}

          <Button title="Pick from gallery" onPress={pickFromLibrary} />
          <Button title="Take a photo" onPress={takePhoto} />
          <Button title="Post" onPress={() => handleSubmit()} />
        </View>
      )}
    </Formik>
  );
}
