import React, { useState } from 'react';
import _ from 'lodash';

import { withFirebase } from './components/Firebase';

import { withAuthentication } from './components/Session';

import {
	ThemeProvider as MuiThemeProvider,
	makeStyles,
} from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import {
	Typography,
	IconButton,
	Menu,
	MenuItem,
	Box,
	Button,
} from '@material-ui/core';

import AccountCircle from '@material-ui/icons/AccountCircle';
import LoginSwitch from './components/Login';
import CreateModal from './components/CreateModal';
import SearchModal from './components/SearchModal';

const theme = createMuiTheme({
	palette: {
		primary: { main: '#edeae5' },
		secondary: {
			main: '#026670',
		},
	},
});

const useStyles = makeStyles((theme) => ({
	root: {
		color: theme.palette.primary.main,
	},
}));

const App = (props) => {
	const classes = useStyles();

	const [searchActive, setSearchActive] = useState(false);
	const [createActive, setCreateActive] = useState(false);
	const [user, setUser] = React.useState({});
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<MuiThemeProvider theme={theme}>
			<Box className={classes.root}>
				{console.log(createActive)}
				<CreateModal
					open={createActive}
					onClose={() => setCreateActive(false)}
				/>
				<SearchModal
					open={searchActive}
					onClose={() => setSearchActive(false)}
				/>
				<Typography variant="h4" color="secondary">
					YHTEISELO
				</Typography>
				<LoginSwitch handleSwitch={setUser} />
				<Button onClick={() => setSearchActive(true)}>Hae</Button>
				<Button onClick={() => setCreateActive(true)}>Luo</Button>
				{!_.isEmpty(user) && (
					<div>
						<IconButton
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleMenu}
							color="inherit"
						>
							<AccountCircle />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={open}
							onClose={handleClose}
						>
							<MenuItem onClick={handleClose}>Profile</MenuItem>
							<MenuItem onClick={handleClose}>My account</MenuItem>
						</Menu>
					</div>
				)}
			</Box>
		</MuiThemeProvider>
	);
};

export default withFirebase(App);
