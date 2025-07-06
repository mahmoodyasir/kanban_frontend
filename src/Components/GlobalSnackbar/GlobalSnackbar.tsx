import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { Alert, type AlertColor } from '@mui/material';



type snackBarPositionProps = {
    verticalPosition: any;
    horizontalPosition: any;
    message: string;
    alertType: AlertColor;
    onfinish: () => void;
}


const GlobalSnackbar = (props: snackBarPositionProps) => {

    const {verticalPosition='top', horizontalPosition='center', message, alertType, onfinish} = props;
    const [open, setOpen] = useState<boolean>(true);
    
    const [snackState, setSnackState] = React.useState({
        vertical: verticalPosition,
        horizontal: horizontalPosition,
    });

    const { vertical, horizontal } = snackState;

    
    const handleClose = () => {
        console.log("Clicked Close")
        setOpen(false);
        setSnackState({ ...snackState });
        onfinish();
    };

    return (
        <div>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                onClose={handleClose}
                autoHideDuration={2000}
                key={vertical + horizontal}
            >
                <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
                
        </div>
    )
}

export default GlobalSnackbar
