import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Card, Modal } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import MapMarker from './MapMarker';
import PostCard from '../Posts/PostCard';

const Map = (props) => {
	const [focusedPost, setFocusedPost] = React.useState(null);

	return (
		<Card
			elevation={8}
			style={{
				height: 600,
				width: 800,
				position: 'relative',
			}}
		>
			<Modal
				open={focusedPost}
				onClose={() => setFocusedPost(null)}
				style={{
					display: 'flex',
					alignItems: 'flex-start',
					justifyContent: 'center',
				}}
			>
				<PostCard
					user={props.user}
					userLoc={props.userLoc}
					post={focusedPost}
				/>
			</Modal>
			<GoogleMapReact
				bootstrapURLKeys={{ key: 'AIzaSyA5QI05Hz7NxIYeWzdYgh---GflRVi_c4k' }}
				defaultCenter={{
					lat: 60.17515519999999,
					lng: 25,
				}}
				defaultZoom={11}
			>
				{props.posts.map((post) => (
					<MapMarker
						lat={post.latitude}
						lng={post.longitude}
						post={post}
						user={props.user}
						userLoc={props.userLoc}
						onClick={setFocusedPost}
					/>
				))}
			</GoogleMapReact>
		</Card>
	);
};

export default Map;
