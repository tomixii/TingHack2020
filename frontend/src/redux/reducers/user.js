import { SET_USER_UID } from '../actionTypes';

const initialState = {
	uid: '',
};

export default function (state = initialState, action) {
	switch (action.type) {
		case SET_USER_UID: {
			return {
				...state,
				uid: action.payload.uid,
			};
		}
		default:
			return state;
	}
}
