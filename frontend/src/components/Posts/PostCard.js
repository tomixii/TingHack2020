import React from 'react';
import {
	Card,
	Typography,
	Grid,
	makeStyles,
	Collapse,
	Button,
	Divider,
} from '@material-ui/core';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import AddIcon from '@material-ui/icons/Add';
import { withFirebase } from '../Firebase';
import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
	card: {
		width: 700,
		backgroundColor: theme.palette.secondary.main,
		color: theme.palette.primary.main,
		margin: 20,
		padding: 15,
		borderRadius: 10,
	},
	titleRow: { marginBottom: 20 },
	extraInfo: {
		marginRight: 20,
		marginLeft: 5,
	},
	description: {},
}));

const PostCard = ({ post, firebase, user, userLoc }) => {
	const classes = useStyles();
	const [isCollapsed, setIsCollapsed] = React.useState(true);
	const [imIn, setImIn] = React.useState(false);

	React.useEffect(() => {
		console.log('auth changed');
		setImIn(
			firebase.auth.currentUser
				? post.usersIn.includes(firebase.auth.currentUser.uid)
				: false
		);
	}, [firebase.auth.currentUser]);

	const isLoggedIn = () => {
		return firebase.auth.currentUser && !_.isEmpty(user);
	};

	const getTimeDifference = () => {
		let difference = new Date() - Date.parse(post.createdAt);

		difference /= 1000 * 60 * 60 * 24;

		if (difference > 1) {
			return `${Math.floor(difference)} päivää sitten`;
		}
		difference *= 24;
		if (difference > 1) {
			return `${Math.floor(difference)} tuntia sitten`;
		}
		difference *= 60;
		if (difference > 1) {
			return `${Math.floor(difference)} minuuttia sitten`;
		}
		return 'juuri nyt';
	};

	const toggleJoin = () => {
		if (imIn) {
			firebase.removeFromUsersIn(post.postId, firebase.auth.currentUser.uid);
			post.usersIn = post.usersIn.filter(
				(item) => item != firebase.auth.currentUser.uid
			);
		} else {
			console.log(post.postId, firebase.auth.currentUser.uid);
			firebase.addToUsersIn(post.postId, firebase.auth.currentUser.uid);
			post.usersIn.push(firebase.auth.currentUser.uid);
		}
		setImIn(!imIn);
	};

	function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
		console.log(lat1, lon1, lat2, lon2);
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

	return (
		<Card className={classes.card}>
			<Grid
				container
				direction="row"
				justify="space-between"
				className={classes.titleRow}
			>
				<Grid item>
					<Grid container direction="row">
						<Typography variant="h4">{post.title}</Typography>
						{isLoggedIn() && (
							<Button
								variant="outlined"
								color="primary"
								onClick={() => toggleJoin()}
								size="small"
								style={{ marginLeft: 10 }}
							>
								{imIn ? 'Poistu' : 'Liity'}
							</Button>
						)}
					</Grid>
					<Grid container alignItems="center">
						<PeopleAltIcon />
						<Typography variant="subtitle1" className={classes.extraInfo}>
							{`${post.min != post.max ? `${post.min}-${post.max}` : post.min}`}
						</Typography>
						<LocationOnIcon />
						<Typography variant="subtitle1" className={classes.extraInfo}>
							{Math.round(
								getDistanceFromLatLonInKm(
									post.latitude,
									post.longitude,
									userLoc.latitude,
									userLoc.longitude
								) * 10
							) / 10}
							km
						</Typography>
						<Typography variant="subtitle1" className={classes.extraInfo}>
							{post.usersIn.length} käyttäjää mukana
						</Typography>
					</Grid>
					<Typography variant="subtitle2">{getTimeDifference()}</Typography>
				</Grid>
				<Grid item>
					<Grid
						container
						direction="row"
						alignItems="center"
						style={{ height: '100%' }}
					>
						<Typography variant="h6">{post.name}</Typography>
						<img
							src={post.imageUrl}
							style={{
								width: 64,
								height: 64,
								borderRadius: 32,
								marginLeft: 20,
								marginRight: 10,
							}}
						/>
					</Grid>
				</Grid>
			</Grid>
			<Typography variant="body1" className={classes.description}>
				{isCollapsed
					? `${post.description.slice(0, 300)}${
							post.description.length > 300 ? '...' : ''
					  }`
					: post.description}
			</Typography>
			{post.description.length > 300 && (
				<div
					style={{
						borderTop: '1px solid #edeae5aa',
						marginTop: 5,
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Button color="primary" onClick={() => setIsCollapsed(!isCollapsed)}>
						{isCollapsed ? 'Näytä lisää' : 'Näytä vähemmän'}
					</Button>
				</div>
			)}
		</Card>
	);
};

export default withFirebase(PostCard);
