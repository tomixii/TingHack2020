import React, { useState, useEffect } from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const withAuthentication = (Component) => {
	const WithAuthentication = (props) => {
		const [authUser, setAuthUser] = useState('');

		useEffect(() => {
			console.log('auth?');
			props.firebase.auth.onAuthStateChanged((user) => {
				setAuthUser(user);
			});
		}, [props]);

		return (
			<div>
				<AuthUserContext.Provider value={authUser}>
					<Component {...props} />
				</AuthUserContext.Provider>
			</div>
		);
	};
	return withFirebase(WithAuthentication);
};

export default withAuthentication;
