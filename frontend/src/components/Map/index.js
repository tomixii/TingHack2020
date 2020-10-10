import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Card } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';

const Map = (props) => {
	return (
		<Card
			elevation={8}
			style={{
				height: 600,
				width: 800,
			}}
		>
			<GoogleMapReact
				bootstrapURLKeys={{ key: 'AIzaSyA5QI05Hz7NxIYeWzdYgh---GflRVi_c4k' }}
				defaultCenter={{
					lat: 60.17515519999999,
					lng: 25,
				}}
				defaultZoom={11}
			>
				{props.posts.map((post) => (
					<LocationOnIcon lng={post.longitude} lat={post.latitude} />
				))}
			</GoogleMapReact>
		</Card>
	);
};

export default Map;
