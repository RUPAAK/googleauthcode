import React from 'react'
import GoogleLogin from 'react-google-login';
import axios from 'axios'


const App = () => {
    const responseGoogle = (response) => {
        console.log(response)
        axios.post('http://localhost:5000/api/google', {tokenId: response.tokenId})
    }
    return (
        <>
            <GoogleLogin
                clientId="513469776532-aquu38i7vf7m52g5qr8224s8t61e8re8.apps.googleusercontent.com"
                buttonText="Login/ SignUp"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
        </>
    )
}

export default App
