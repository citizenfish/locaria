import React from 'react';
import {Route, Redirect} from 'react-router-dom';

const AdminRoute = ({component: Component, user, ...rest}) => {
	console.log(`USER:${user}`);
	return (
		<Route {...rest} render={
			props => {
				if (user) {
					return <Component {...rest} {...props} />
				} else {
					return <Redirect to={
						{
							pathname: '/',
							state: {
								from: props.location
							}
						}
					}/>
				}
			}
		}/>
	)
}

export default AdminRoute;
