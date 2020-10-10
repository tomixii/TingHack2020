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
		width: 300,
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

const MapPostCard = ({ post, firebase, user, userLoc }) => {
	const classes = useStyles();
	const [isCollapsed, setIsCollapsed] = React.useState(true);
	const [imIn, setImIn] = React.useState(false);

	React.useEffect(() => {
		setImIn(
			firebase.auth.currentUser
				? post.usersIn.includes(firebase.auth.currentUser.uid)
				: false
		);
	}, [firebase.auth.currentUser]);

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
						{firebase.auth.currentUser && (
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
					</Grid>
					<Typography variant="subtitle1">
						{post.usersIn.length} käyttäjää mukana
					</Typography>
					<Typography variant="subtitle2">{getTimeDifference()}</Typography>
				</Grid>
			</Grid>
		</Card>
	);
};

export default withFirebase(MapPostCard);
