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

const PostCard = ({ post, firebase, user }) => {
	const classes = useStyles();
	const [isCollapsed, setIsCollapsed] = React.useState(true);

	const getTimeDifference = () => {
		let difference = new Date() - Date.parse(post.createdAt);

		difference /= 1000 * 60 * 60 * 24;

		if (difference > 0) {
			return `${Math.floor(difference)} päivää sitten`;
		}
		difference *= 24;
		if (difference > 0) {
			return `${Math.floor(difference)} tuntia sitten`;
		}
		difference *= 60;
		if (difference > 0) {
			return `${Math.floor(difference)} minuuttia sitten`;
		}
		return 'juuri nyt';
	};

	const toggleJoin = () => {
		console.log(firebase.auth.currentUser);
		firebase.addToUsersIn(post.postId, firebase.auth.currentUser.uid);
	};

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
						<Typography variant="h4">Ruohonleikkuri</Typography>
						{firebase.auth.currentUser && (
							<Button
								variant="outlined"
								color="primary"
								onClick={() => toggleJoin()}
								startIcon={<AddIcon />}
								size="small"
								style={{ marginLeft: 10 }}
							>
								Liity
							</Button>
						)}
					</Grid>
					<Grid container alignItems="center">
						<PeopleAltIcon />
						<Typography variant="subtitle1" className={classes.extraInfo}>
							{`${post.min}-${post.max}`}
						</Typography>
						<LocationOnIcon />
						<Typography variant="subtitle1" className={classes.extraInfo}>
							02150
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
					? `${post.description.slice(0, 300)}...`
					: post.description}
			</Typography>
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
		</Card>
	);
};

export default withFirebase(PostCard);
