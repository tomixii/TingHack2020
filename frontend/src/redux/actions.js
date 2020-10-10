import { SET_USER_UID } from './actionTypes';

export const setUserUid = (uid) => ({
	type: SET_USER_UID,
	payload: {
		uid,
	},
});

export const getUserUid = (store) => store.user.uid;
