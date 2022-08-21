import React, { useEffect, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import axios from 'axios';

const {
    REACT_APP_COGNITO_URL,
    REACT_APP_COGNITO_CLIENT_ID,
    REACT_APP_COGNITO_CLIENT_SECRET,
    REACT_APP_COGNITO_REDIRECT_URI
} = process.env;

function Callback() {
    const { search } = useLocation();
    const [credentials, setCredentials] = useState();

    useEffect(() => {
        (async () => {
            const params = new URLSearchParams();

            params.append('grant_type', 'authorization_code');
            params.append('client_id', REACT_APP_COGNITO_CLIENT_ID as string);
            params.append('code', search.split('=')[1]);
            params.append('redirect_uri', REACT_APP_COGNITO_REDIRECT_URI as string);

            const { data: credentials } = await axios.post(`${REACT_APP_COGNITO_URL}/oauth2/token`, params, {
                auth: {
                    username: REACT_APP_COGNITO_CLIENT_ID as string,
                    password: REACT_APP_COGNITO_CLIENT_SECRET as string
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            });

            console.log('Credentials', credentials);

            localStorage.setItem('credentials', JSON.stringify(credentials));
            setCredentials(credentials);
        })();
    }, [search]);

    return credentials ? <Redirect to="/" /> : null;
}

export default Callback;