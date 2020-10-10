import React, { useState } from 'react';
import { Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import { withFirebase } from '../Firebase';

const SearchModal = ({
	open,
	onClose,
	firebase,
	userLoc,
	handleSearchAction,
}) => {
	const [search, setSearch] = useState('');
	const [minPrice, setMinPrice] = useState(0);
	const [maxPrice, setMaxPrice] = useState(100000);
	const [category, setCategory] = useState('Kaikki');
	const [distance, setDistance] = React.useState(1000000);
	const [place, setPlace] = React.useState('All');
	const classes = useStyles();

	function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
		var R = 6371; // Radius of the earth in km
		var dLat = deg2rad(lat2 - lat1); // deg2rad below
		var dLon = deg2rad(lon2 - lon1);
		var a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(deg2rad(lat1)) *
				Math.cos(deg2rad(lat2)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c; // Distance in km
		return d;
	}

	function deg2rad(deg) {
		return deg * (Math.PI / 180);
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		firebase
			.posts()
			.where('price', '<', parseInt(maxPrice ? maxPrice : 100000))
			.where(
				'category',
				'in',
				category === 'Kaikki' ? ['tools', 'technology', 'outdoors'] : [category]
			)
			.get()
			.then((snapshot) => {
				const postsToReturn = [];
				snapshot.forEach((doc) => {
					if (
						doc.data().title.toLowerCase().includes(search.toLowerCase()) &&
						distance >
							getDistanceFromLatLonInKm(
								doc.data().latitude,
								doc.data().longitude,
								userLoc.latitude,
								userLoc.longitude
							)
					) {
						postsToReturn.push(doc.data());
					}
				});
				return postsToReturn;
			})
			.then((posts) => {
				console.log(posts);
				handleSearchAction(posts);
				onClose();
			})
			.catch((err) => {
				console.log('err', err);
			});
	};

	return (
		<Modal open={open} onClose={onClose} className={classes.paper}>
			<div className={classes.modal}>
				<div className={classes.center}>
					<h1 style={{ color: '#EDEAE5' }}>Hae</h1>
				</div>

				<form
					className={classes.root}
					noValidate
					autoComplete="off"
					onSubmit={() => handleSubmit()}
				>
					<div className={classes.center}>
						<TextField
							variant="outlined"
							className={classes.inputField}
							onChange={(event) => setSearch(event.target.value)}
							InputProps={{
								endAdornment: <SearchIcon style={{ color: '#026670' }} />,
							}}
						/>
					</div>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							margin: '20px 40px 20px 40px ',
							justifyContent: 'space-between',
						}}
					>
						<p style={{ color: '#EDEAE5' }}>Oma kustannus</p>
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
								onChange={(event) => setMaxPrice(event.target.value)}
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
								className={classes.formControl}
								onChange={(event) => setCategory(event.target.value)}
							>
								<MenuItem value="Kaikki">
									<em>Kaikki</em>
								</MenuItem>
								<MenuItem value="tools">Työkalut</MenuItem>
								<MenuItem value="technology">Teknologia</MenuItem>
								<MenuItem value="outdoors">Ulkotavarat</MenuItem>
							</Select>
						</FormControl>
					</div>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							margin: '20px 40px 20px 40px ',
						}}
					>
						<p style={{ color: '#EDEAE5' }}>Etäisyys (km)</p>
						<Slider
							defaultValue={2}
							getAriaValueText={(value) => setDistance(value)}
							step={0.1}
							marks
							min={0.1}
							max={20}
							valueLabelDisplay="auto"
						/>
					</div>
					<FormControl component="fieldset">
						<FormLabel
							style={{ color: '#EDEAE5' }}
							className={classes.center}
							component="legend"
						>
							Hae
						</FormLabel>
						<RadioGroup
							style={{ marginLeft: '40px' }}
							aria-label="place"
							name="gender1"
							value={place}
							onChange={(event) => setPlace(event.target.value)}
						>
							<FormControlLabel
								style={{ color: '#EDEAE5' }}
								value="All"
								control={
									<Radio
										classes={{ root: classes.radio, checked: classes.checked }}
									/>
								}
								label="Kaikkialta"
							/>
							<FormControlLabel
								style={{ color: '#EDEAE5' }}
								value="Own"
								control={
									<Radio
										classes={{ root: classes.radio, checked: classes.checked }}
									/>
								}
								label="Omista yhteisöistä"
							/>
						</RadioGroup>
					</FormControl>
					<br></br>
					<div className={classes.center}>
						<Button
							variant="outlined"
							color="primary"
							onClick={(event) => handleSubmit(event)}
							size="large"
						>
							Hae
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

export default withFirebase(SearchModal);
