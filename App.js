import React, {Component} from 'react';
import {StyleSheet, Text, View } from 'react-native';
import { RNCamera } from 'react-native-camera-tflite';
import _ from 'lodash';

let _currentInstant = 0;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      output: ""
    };
  }

processOutput({data}) {

    console.log(data)
    console.log((data[0] & 0xFF))
    
    const output = _.round((data[0] & 0xFF) / 255, 2) // probability to see a energy meter 
    console.log(output)

    this.setState(state => ({
      output
    }));
    _currentInstant = Date.now();
  }
  
  render() {
    const modelParams = {
      file: "meter_yes1_no0.tflite",
      inputDimX: 224,
      inputDimY: 224,
      outputDim: 1,
      freqms: 0
    };
    return (
      <View style={styles.container}>
        <RNCamera
            ref={ref => {
                this.camera = ref;
              }}
            style = {styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.on}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}
            onModelProcessed={data => this.processOutput(data)}
            modelParams={modelParams}
        >
          <Text style={styles.cameraText}>{this.state.output}</Text>
        </RNCamera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});