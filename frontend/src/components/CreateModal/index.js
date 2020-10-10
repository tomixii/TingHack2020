import React from 'react';
import { Modal } from '@material-ui/core';

const CreateModal = ({ open, onClose }) => {
	return (
		<Modal open={open} onClose={onClose}>
			<div style={{ width: 200, height: 200, backgroundColor: 'white' }}>
				<p>Luo joku juttu</p>
			</div>
		</Modal>
	);
};

export default CreateModal;
