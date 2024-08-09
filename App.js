

import React from 'react';
import { View, Dimensions, TouchableOpacity, Alert, Text, Image, Linking } from 'react-native';
import { isStarted, start, stop } from 'react-native-file-server';
import DevInfo from 'react-native-device-info';
import { activateKeepAwake, deactivateKeepAwake} from "@sayem314/react-native-keep-awake";

let rate = 0.88;

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isRunning: false,
            serverUrl: "",
            outputArray: [
            ],
        }
    }

    appenOutput(param) {
        let outputArray = this.state.outputArray;
        outputArray.push(param);
        this.setState({ outputArray: outputArray });
    }

    clearOutput() {
        this.state.outputArray = [];
        this.setState({ outputArray: [] });
    }

    renderOutput() {

        let { width, height } = Dimensions.get('window');
        let itemH = 300;

        return (
            <View style={{ width: width * rate, marginTop: 0, backgroundColor: "transparent" }}>
                <View style={{ width: width * rate, height: itemH * 0.15, justifyContent: 'center', alignItems: 'flex-start' }}>
                    <Text allowFontScaling={false} style={{ color: "black", fontSize: 17 }}>Output</Text>
                </View>
                <View style={{ width: width * rate, minHeight: itemH * 0.85, backgroundColor: '#E5E5E5', borderRadius: 10, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <View style={{ width: width * (rate - 0.05), marginTop: 10, marginBottom: 10, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        {this.state.outputArray.map((element, key) => {
                            return <Text allowFontScaling={false} key={key} style={{ color: element.color, fontSize: 17 }}>{element.text}</Text>
                        })}
                    </View>
                </View>
            </View>
        )
    }

    async turnOnOrOff() {
        if (isStarted()) {
            stop();
            this.clearOutput ();
            this.appenOutput({ text: "Server stopped", color: "red" });
            this.setState({ isRunning: false });

            deactivateKeepAwake ();
            return;
        } else {
            start({ port: 8080 });
            let ipaddress = await DevInfo.getIpAddress()
            
            activateKeepAwake ();

            this.clearOutput ();
            this.appenOutput({ text: "Server started", color: "green" });
            this.setState({ isRunning: true, serverUrl: `http://${ipaddress}:8080` });
            return;
        }
    }

    render() {
        let { width, height } = Dimensions.get('window');
        let { isRunning } = this.state;
        return (
            <View style={{ width: width, height: height, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <TouchableOpacity
                    style={{ width: 100, height: 100, backgroundColor: 'transparent' }}
                    // activeOpacity={0.9} 
                    onPress={() => {
                        this.turnOnOrOff();
                    }}
                >
                    <Image source={isRunning ? require('./res/pow-on.png') : require('./res/pow-off.png')} style={{ width: 100, height: 100 }}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: rate * width, height: 40, backgroundColor: 'transparent', justifyContent: "center", alignItems: "center" }} onPress={() => {
                    if (!this.state.serverUrl || this.state.serverUrl == "") {
                        return ;
                    }
                    Alert.alert(
                        'Info',
                        `Do you want to open ${this.state.serverUrl} in browser?`,
                        [
                            {
                                text: 'Yes',
                                onPress: () => Linking.openURL(this.state.serverUrl),
                            },
                            {
                                text: 'No',
                                style: 'cancel',
                            },
                        ],
                        { cancelable: false }
                    );

                }}>
                    <Text allowFontScaling={false} style={{ color: "black", fontSize: 17, backgroundColor: 'transparent', textAlign: 'center', textAlignVertical: 'center', textDecorationLine: 'underline' }}>
                        {this.state.serverUrl}
                    </Text>
                </TouchableOpacity>
                {this.renderOutput()}
            </View>
        )
    }
}