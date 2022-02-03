import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AdminDialogConfirm(props) {
    let p = props.p
    const handleClose = () => {
        p.openSet({open:false});

    };

    const handleConfirm = () => {
        p.confirmFunction()
        p.openSet({open:false})
    }

    return (
        <div>
            <Dialog
                open={p.open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {p.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {p.text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{p.dismissText}</Button>
                    <Button onClick={handleConfirm} autoFocus>
                        {p.confirmText}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}