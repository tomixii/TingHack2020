import React from 'react';
import MapPostCard from '../Posts/MapPostCard';
import { Card } from '@material-ui/core';

const MapMarker = ({ post, user, userLoc, onClick }) => {
	const [showInfo, setShowInfo] = React.useState(false);

	return (
		<div
			onMouseEnter={() => setShowInfo(true)}
			onMouseLeave={() => setShowInfo(false)}
			onClick={() => onClick(post)}
		>
			<Card
				style={{
					backgroundColor: '#026670',
					width: 15,
					height: 15,
					borderRadius: 10,
				}}
			/>
			{showInfo && (
				<MapPostCard
					post={post}
					user={user}
					userLoc={userLoc}
					style={{ position: 'absolute', bottom: 150, left: 0 }}
				/>
			)}
		</div>
	);
};

export default MapMarker;
