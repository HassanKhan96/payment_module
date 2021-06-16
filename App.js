import React, { useState, useEffect } from 'react';
import { View, Button } from 'react-native';
import { Constants } from 'react-native-unimodules';
import { Audio } from 'expo-av';
console.log(Constants.systemFonts);

const App = () => {


    const [recording, setRecording] = useState();

    const [sound, setSound] = useState();

    const [Uri, setUri] = useState();

    useEffect(() => {
        return sound
          ? () => {
              console.log('Unloading Sound');
              sound.unloadAsync(); }
          : undefined;
      }, [sound]);

    async function startRecording() {
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            const perm = await Audio.getPermissionsAsync();
            console.log(perm)
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            console.log('Starting recording..');
            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await recording.startAsync();
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setUri(uri)
        console.log('Recording stopped and stored at', uri);
    }


    async function playSound() {
        
        if(Uri){
            console.log('Loading Sound');
            console.log(Uri)
            const { sound } = await Audio.Sound.createAsync(
                {uri: Uri}
            );
            setSound(sound);
    
            console.log('Playing Sound');
            await sound.playAsync();
        }
    }

    return (
        <View style={{ justifyContent: 'space-evenly', alignItems: 'center', flex: 1 }}>
            <Button
                title={recording ? 'Stop Recording' : 'Start Recording'}
                onPress={recording ? stopRecording : startRecording}
            />

            <Button
                title="Play Sound" 
                onPress={playSound}
            />
        </View>
    )
}

export default App;