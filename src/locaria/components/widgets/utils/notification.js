import React, {forwardRef, useImperativeHandle} from 'react';
import {Alert, Snackbar} from "@mui/material";

const Notification = forwardRef( ({notification,vertical='top',horizontal='center'}, ref) => {


	const [open, setOpen] = React.useState(false);

	useImperativeHandle(
		ref,
		() => ({
			open() {
				setOpen(true)
			}
		})
	);

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{vertical: vertical, horizontal: horizontal}}>
			<Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>{notification}</Alert>
		</Snackbar>
	)


});

export default Notification;