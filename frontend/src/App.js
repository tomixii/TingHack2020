import React, { useState, useEffect } from 'react';
import { Link, withRouter, Router } from 'react-router-dom';
import _ from 'lodash';
import './index.css';
import RobotoSlab from './fonts/roboto_slab/static/RobotoSlab-Regular.ttf';

import { withFirebase } from './components/Firebase';

import { withAuthentication } from './components/Session';
import background from './images/background.png';

import {
	createMuiTheme,
	MuiThemeProvider,
	makeStyles,
} from '@material-ui/core/styles';
import {
	Typography,
	IconButton,
	Menu,
	MenuItem,
	Box,
	Button,
	Grid,
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import LoginSwitch from './components/Login';
import CreateModal from './components/CreateModal';
import SearchModal from './components/SearchModal';
import PostCard from './components/Posts/PostCard';
import Map from './components/Map';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CssBaseline from '@material-ui/core/CssBaseline';

const theme = createMuiTheme({
	palette: {
		primary: { main: '#edeae5' },
		secondary: {
			main: '#026670',
		},
	},
	overrides: {
		MuiButton: {
			outlinedSecondary: {
				borderWidth: 3,
				borderRadius: 10,
				backgroundColor: '#edeae5',
				margin: 10,
			},
			'&hover': {
				backgroundColor: '#edeae5',
			},
		},
	},
});

const useStyles = makeStyles((theme) => ({
	rootContainer: {
		backgroundColor: '#edeae5',
		height: '100%',
		backgroundImage: `url(${background})`,
		backgroundSize: '100%',
		overflowY: 'hidden',
	},
	topbar: { padding: 20, height: 80 },
	buttonRow: { height: 70 },
}));

const App = (props) => {
	const classes = useStyles();

	const [searchActive, setSearchActive] = useState(false);
	const [createActive, setCreateActive] = useState(false);

	const [user, setUser] = React.useState({});
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const [loadingPosts, setLoadingPosts] = useState(true);
	const [posts, setPosts] = useState([]);
	const [userLoc, setUserLoc] = useState({});
	const [showMap, setShowMap] = useState(false);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition((position) => {
			setUserLoc({
				longitude: position.coords.longitude,
				latitude: position.coords.latitude,
			});
		});
		props.firebase
			.posts()
			.orderBy('createdAt', 'desc')
			.get()
			.then((data) => {
				const allPosts = [];
				data.forEach((doc) => allPosts.push({ postId: doc.id, ...doc.data() }));
				setPosts(allPosts);
				setLoadingPosts(false);
			});
	}, []);

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<MuiThemeProvider theme={theme}>
			<Box className={classes.rootContainer}>
				<CreateModal
					open={createActive}
					userLoc={userLoc}
					user={user}
					posts={posts}
					onClose={() => setCreateActive(false)}
					handleCreateAction={setPosts}
				/>
				<SearchModal
					open={searchActive}
					onClose={() => setSearchActive(false)}
					userLoc={userLoc}
					handleSearchAction={setPosts}
				/>
				<Grid
					container
					direction="row"
					justify="space-between"
					className={classes.topbar}
					color="primary"
				>
					<Grid item>
						<Typography
							variant="h4"
							color="secondary"
							className={classes.logo}
							onClick={() => window.location.reload()}
							style={{ cursor: 'pointer' }}
						>
							YHTEISELO
						</Typography>
					</Grid>
					<Grid item>
						<Grid container direction="row">
							<Typography
								variant="h6"
								color="secondary"
								className={classes.logo}
							>
								Kirjautunut
							</Typography>
							<LoginSwitch handleSwitch={setUser} />
						</Grid>
					</Grid>
				</Grid>
				<Grid container justify="center" className={classes.buttonRow}>
					<Button
						variant="outlined"
						color="secondary"
						onClick={() => setSearchActive(true)}
						startIcon={<SearchIcon />}
						size="large"
					>
						Hae
					</Button>
					{!_.isEmpty(user) && (
						<Button
							variant="outlined"
							color="secondary"
							onClick={() => setCreateActive(true)}
							startIcon={<AddIcon />}
							size="large"
						>
							Luo
						</Button>
					)}
				</Grid>
				{showMap ? (
					<Grid container alignItems="center" direction="row">
						<Grid item xs={2}>
							<Grid container justify="flex-end">
								<IconButton onClick={() => setShowMap(false)}>
									<ArrowBackIcon style={{ fontSize: 96, color: '#026670' }} />
								</IconButton>
							</Grid>
						</Grid>
						<Grid item xs={8}>
							<Grid container justify="center">
								<Map userLoc={userLoc} posts={posts} user={user} />
							</Grid>
						</Grid>
						<Grid item xs={2}></Grid>
					</Grid>
				) : (
					<Grid container alignItems="center" direction="row">
						<Grid item xs={2}></Grid>
						<Grid item xs={8}>
							<Grid container justify="center">
								<Grid container alignItems="center" direction="column">
									<div
										id="noscroll"
										style={{
											height: 'calc(100vh - 150px)',
											overflowY: 'scroll',
										}}
									>
										{loadingPosts ? (
											<p>Loading</p>
										) : (
											posts.map((post, i) => (
												<PostCard
													post={post}
													key={i}
													user={user}
													userLoc={userLoc}
												/>
											))
										)}
									</div>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={2}>
							<Grid container justify="flex-start">
								<IconButton onClick={() => setShowMap(true)}>
									<ArrowForwardIcon
										style={{ fontSize: 96, color: '#edeae5' }}
									/>
								</IconButton>
							</Grid>
						</Grid>
					</Grid>
				)}
			</Box>
		</MuiThemeProvider>
	);
};

export default withFirebase(App);
