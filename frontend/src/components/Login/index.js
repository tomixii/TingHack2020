import React from 'react';

import { withFirebase } from '../Firebase';

import Switch from '@material-ui/core/Switch';

const LoginSwitch = (props) => {
	const [isLoggedIn, setIsLoggedIn] = React.useState(false);

	React.useEffect(() => {
		console.log(isLoggedIn);
		if (isLoggedIn) {
			props.firebase
				.doSignInWithEmailAndPassword('admin@admin.com', 'asd123')
				.then((user) => {
					console.log(user);
					return props.handleSwitch(user);
				})
				.catch((err) => console.log(err));
		} else {
			props.firebase.doSignOut();
			props.handleSwitch({});
		}
	}, [isLoggedIn]);

	return (
		<Switch
			checked={isLoggedIn}
			onChange={(event) => setIsLoggedIn(event.target.checked)}
		/>
	);
};

export default withFirebase(LoginSwitch);
