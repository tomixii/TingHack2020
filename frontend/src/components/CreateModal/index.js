import React, { useState } from 'react';
import { Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import Radio from '@material-ui/core/Radio/Radio';
import Select from '@material-ui/core/Select/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { withFirebase } from '../Firebase';

const CreateModal = ({ open, onClose, firebase, userLoc, user }) => {
	const [topic, setTopic] = React.useState('');
	const [description, setDescription] = React.useState('');
	const [minParticipation, setMinParticipation] = React.useState(0);
	const [maxParticipation, setMaxParticipation] = React.useState(10000);
	const [price, setPrice] = React.useState(0);
	const [category, setCategory] = useState('Kaikki');
	const classes = useStyles();

	const handleSubmit = (event) => {
		firebase
			.user(firebase.auth.currentUser.uid)
			.get()
			.then(function (doc) {
				if (doc.exists) {
					firebase
						.posts()
						.add({
							title: topic,
							category,
							price: parseInt(price),
							description,
							latitude: userLoc.latitude,
							longitude: userLoc.longitude,
							min: parseInt(minParticipation),
							max: parseInt(maxParticipation),
							usersIn: [],
							name: doc.data().name,
							imageUrl: doc.data().imageUrl,
							createdAt: new Date().toISOString(),
						})
						.then(function (docRef) {
							console.log('Document written with ID: ', docRef.id);
						})
						.catch(function (error) {
							console.error('Error adding document: ', error);
						});
				} else {
					// doc.data() will be undefined in this case
					console.log('No such document!');
				}
			})
			.catch(function (error) {
				console.log('Error getting document:', error);
			});
	};

	return (
		<Modal open={open} onClose={onClose} className={classes.paper}>
			<div className={classes.modal}>
				<div className={classes.center}>
					<h1 style={{ color: '#EDEAE5' }}>Luo uusi ilmoitus</h1>
				</div>
				<form
					className={classes.root}
					noValidate
					autoComplete="off"
					onSubmit={() => handleSubmit()}
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							margin: '20px 40px 20px 40px ',
							justifyContent: 'space-between',
						}}
					>
						<p style={{ color: '#EDEAE5' }}>Otsikko</p>
						<div
							style={{
								float: 'right',
								clear: 'both',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<TextField
								variant="outlined"
								type="string"
								className={classes.inputField}
								onChange={(event) => setTopic(event.target.value)}
							/>
						</div>
					</div>
					{console.log(
						'state',
						topic,
						description,
						minParticipation,
						maxParticipation,
						price,
						category
					)}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							margin: '20px 40px 20px 40px ',
							justifyContent: 'space-between',
						}}
					>
						<p style={{ color: '#EDEAE5' }}>Kuvaus</p>
						<div
							style={{
								float: 'right',
								clear: 'both',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<TextField
								rows={4}
								multiline
								variant="outlined"
								type="string"
								className={classes.description}
								onChange={(event) => setDescription(event.target.value)}
							/>
						</div>
					</div>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							margin: '20px 40px 20px 40px ',
							justifyContent: 'space-between',
						}}
					>
						<p style={{ color: '#EDEAE5' }}>Henkilömäärä</p>
						<div
							style={{
								float: 'right',
								clear: 'both',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<TextField
								variant="outlined"
								type="number"
								placeholder="min"
								className={classes.numberInputField}
								onChange={(event) => setMinParticipation(event.target.value)}
							/>
							<p style={{ color: '#EDEAE5' }}>- </p>
							<TextField
								variant="outlined"
								type="number"
								placeholder="max"
								className={classes.numberInputField}
								onChange={(event) => setMaxParticipation(event.target.value)}
							/>
						</div>
					</div>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							margin: '20px 40px 20px 40px ',
							justifyContent: 'space-between',
						}}
					>
						<p style={{ color: '#EDEAE5' }}>Arvioitu hinta per käyttäjä</p>
						<div
							style={{
								float: 'right',
								clear: 'both',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<TextField
								variant="outlined"
								type="number"
								className={classes.numberInputField}
								onChange={(event) => setPrice(event.target.value)}
							/>
							<p style={{ color: '#EDEAE5' }}>€ </p>
						</div>
					</div>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							margin: '20px 40px 20px 40px ',
						}}
					>
						<p style={{ color: '#EDEAE5' }}>Kategoria</p>
						<FormControl variant="outlined">
							<Select
								labelId="demo-simple-select-outlined-label"
								id="demo-simple-select-outlined"
								value={category}
								variant="outlined"
								className={classes.formControl}
								onChange={(event) => setCategory(event.target.value)}
							>
								<MenuItem value="all">
									<em>Kaikki</em>
								</MenuItem>
								<MenuItem value="tools">Työkalut</MenuItem>
								<MenuItem value="technology">Teknologia</MenuItem>
								<MenuItem value="outdoors">Ulkotavarat</MenuItem>
							</Select>
						</FormControl>
					</div>
					<br></br>
					<div className={classes.center}>
						<Button
							variant="outlined"
							color="primary"
							disabled={
								topic === '' ||
								description === '' ||
								minParticipation === 0 ||
								maxParticipation === 10000 ||
								price === 0
							}
							onClick={(event) => handleSubmit(event)}
							size="large"
						>
							Luo
						</Button>
					</div>
				</form>
			</div>
		</Modal>
	);
};

const useStyles = makeStyles((theme) => ({
	modal: {
		width: '60%',
		height: '80%',
		backgroundColor: '#026670', // vaalea'#EDEAE5'
	},
	paper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	center: {
		display: 'flex',
		justifyContent: 'center',
		margin: '20px 40px 20px 40px ',
	},
	inputField: {
		justifyContent: 'center',
		borderRadius: '40px',
		backgroundColor: '#EDEAE5',
		width: 400,
		margin: '20px 40px 20px 40px ',
	},
	description: {
		justifyContent: 'center',
		borderRadius: '40px',
		backgroundColor: '#EDEAE5',
		width: 600,
		margin: '20px 40px 20px 40px ',
	},
	numberInputField: {
		justifyContent: 'center',
		borderRadius: '40px',
		backgroundColor: '#EDEAE5',
		width: 200,
		margin: '20px 40px 20px 40px ',
	},
	root: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),

			'& fieldset': {
				borderRadius: '40px',
			},
		},
	},
	formControl: {
		width: '250px',
		backgroundColor: '#EDEAE5',
	},
	radio: {
		color: '#EDEAE5',
		'&$checked': {
			color: '#EDEAE5',
		},
	},
	checked: {},
}));

export default withFirebase(CreateModal);
