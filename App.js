
import { GooglePay } from 'react-native-google-pay';
import React, {useState, useEffect} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, Dimensions,  StatusBar, TextInput, ScrollView, ActivityIndicator} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
var stripe = require('stripe-client')('pk_test_51HzSHtFdvOMEPwYskkoMA2q93HT9Tka9gnolddw8GP9fHD9VmxLTlD31SU64qg14CrqGG694aosyrY3qjU76oM3u00QEUv0iGO');
const axios = require('axios');

const height = Dimensions.get('window').height;

const App = (props) => {

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [password, setPassword] = useState('');
    const [ warning , setwarning] = useState('');
    const [activity, setActivity] = useState(false);


    const [cardInfo, setCardInfo] = useState('');


      function onChange(form) {
        
        // console.log(form)

        if(form.status.cvc === 'valid' && form.status.expiry === 'valid' && form.status.number === "valid") {
            console.log("Card is valid")
            // setwarning('valid')
            setCardInfo(form.values)
        }

        else if(form.status.cvc === 'invalid' || form.status.expiry === 'invalid' || form.status.number === "invalid")
        {
            console.log('invalid info')
        }


      }

    async function onSubmit() {

      if(email !== '' && password !== '' && firstName !== '' && cardInfo !== '' ) {

        setActivity(true);
        setwarning('');  
        console.log(cardInfo)


        var IntCardNumber = parseInt(cardInfo.number);
        var IntCreditYear = parseInt(cardInfo.expiry.substring(3,5));
        var IntCreditMonth = parseInt(cardInfo.expiry.substring(0,2));
        var IntCVC = parseInt(cardInfo.cvc)

        
        console.log(IntCreditMonth)
        console.log(IntCreditYear)

      const token = await stripe.createToken({
        card: {

            number: cardInfo.number,
            exp_month: IntCreditMonth,
            exp_year: IntCreditYear,
            cvc: cardInfo.cvc
        },
      }) 
    .then(function (response) {
        //console.log(response);
        if(response.card) {
            console.log("Credit card success")
            console.log(response)
            signRequest(response.id)
        }
        else if(response.error) {
            setwarning(response.card.message)
            setActivity(false);
        }
        
        
    })
    .catch(function (error) {

        setActivity(false);
        setwarning('Invalid card information')
    })

        }

        else {
            setwarning('Please add complete valid information ');
            console.log('Please Added all fields');
            setActivity(false);
        }
    }

    async function signRequest(Stripetoken) {
        const Data = await axios.post('http://192.168.0.103:5000/api/payment_handler', {
            email,
            id: Stripetoken,
          })
          .then(async function (response) {

            console.log("Customer Token is: ", response.data);
            thenOnSuccess()
        
          })
          .catch(function (error) {
            console.log("Error while first one")
            thenOnFail();
            console.log(error);
            setActivity(false)
          });
    }

    function thenOnSuccess() {
        setActivity(false);
        setEmail('');
        setPassword('');
        setFirstName('');
        setCardInfo('')
 
    
        
        //props.navigation.navigate('SignIn')
    }

    function thenOnFail() {
        setwarning('Something went wrong');
        
        setActivity(false);

    }

    return(
    
        <View style={styles.container}>
            <StatusBar barStyle="white" backgroundColor="#7041EE" />
                <View style={{ marginLeft: '5%', marginBottom: '10%'}}>
                    <Text style={{ fontSize: hp('4%'), fontWeight: 'bold', marginTop: hp('4%')}}>
                        Get Started
                    </Text>
                    <Text style={{ fontSize: hp('3%'), color: '#9c9c9c'}}>
                   Add your payment information
                    </Text>
                </View>
                <ScrollView contentContainerStyle={{ alignItems: 'center'}}>
                    <View style={styles.backgroundStyle}>
                        <TextInput 
                            style={styles.InputTextStyle}
                            placeholder="Name"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={true}
                            value={firstName}
                            onChangeText={setFirstName}
                            label="name"
                                
                        />
                    </View>
                    <View style={styles.backgroundStyle}>
                        <TextInput 
                            style={styles.InputTextStyle}
                            placeholder="Email"
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType={"email-address"}
                            editable={true}
                            label="Email" 
                            value={email} 
                            onChangeText={setEmail}  
                                
                        />
                    </View>

                    <View style={styles.backgroundStyle}>
                        <TextInput 
                            style={styles.InputTextStyle}
                            placeholder="Password"
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry
                            editable={true}
                            label="Password"
                            value={password}
                            onChangeText={setPassword}    
                                
                        />
                    </View>

                    
                    <View style={{ marginTop: 20, borderWidth: 1,  borderColor: '#b3b3b3',width: '90%', borderRadius: 8, paddingVertical: (Dimensions.get('window').height)/84}}>
                        <LiteCreditCardInput onChange={onChange} />
                    </View>

                    <TouchableOpacity onPress={() => onSubmit()} style={styles.ButtonStyle}>     
                        {activity ?
                            <ActivityIndicator size="small" color="white" />
                        :
                            <Text style={{ color: 'white', fontSize: hp('2.7%')}}>
                                 Sign up
                            </Text>
                        }              
                    </TouchableOpacity>
                    {warning ?
                        <View style={{ marginTop: '3%'}}>
                            <Text style={{ color: 'red'}}>{warning}</Text>
                        </View>
                        :
                        <>
                        </>
                    }

                    <View style={styles.signupText}>
                        <Text style={{ fontSize: hp('2%'), textAlign: 'center'}}>
                            By joining, you agree to our{" "}
                        </Text>
                        <TouchableOpacity onPress={() => console.log('Terms and conditions')}>
                            <Text style={{ color: '#7041EE', fontSize: hp('2%')}}>
                                Terms of Service
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.signupText}>
                        <Text style={{ fontSize: hp('2')}}>
                            Already have an account?{" "}
                        </Text>
                        <TouchableOpacity style={{ marginBottom: hp('10%')}} onPress={() => console.log('Terms and conditions')}>
                            <Text style={{ color: '#7041EE', fontSize: hp('2%'), fontWeight: 'bold'}}>
                                Sign in
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>            
        </View>
     

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',

    },
    ButtonStyle: {
        backgroundColor: '#7041EE',
        marginHorizontal: '5%',
        height: hp('8%'), 
        marginTop: hp('5%'),
        borderColor: 'white', 
        width: '90%', 
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 15 
    },
    backgroundStyle: {
        borderWidth: 1,
        borderColor: '#b3b3b3',
        height: (Dimensions.get('window').height)/14,
        borderRadius: 8,
        flexDirection: 'row',
        width: '90%',
        marginTop: (Dimensions.get('window').height)/70
        
    },
    welcomeContainer: {
        marginTop: (Dimensions.get('window').height)/14820, 
        marginBottom: (Dimensions.get('window').height)/12
    },
    InputTextStyle: {
        fontSize: hp('2.5%'),
        flex:1,
        marginLeft: '5%'
    },

    signupText: {
        flexDirection: 'row',
         marginTop: (Dimensions.get('window').height)/29,
     
    },
 
});

export default App;