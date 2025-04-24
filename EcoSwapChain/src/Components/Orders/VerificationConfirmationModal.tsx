import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
    Typography,
    Stack
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (isValid: boolean) => void; // Updated to pass isValid parameter
    isValid: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    open,
    onClose,
    onConfirm,
    isValid
}) => {
    // Handler that passes the isValid flag to the parent component
    const handleConfirm = () => {
        onConfirm(isValid);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    borderRadius: '20px',
                    padding: '16px',
                    maxWidth: '450px',
                    width: '100%'
                }
            }}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pb: 2,
                pt: 3
            }}>
                {isValid ? (
                    <CheckCircleOutlineIcon
                        sx={{
                            color: 'accent.main',
                            fontSize: 64,
                            mb: 2
                        }}
                    />
                ) : (
                    <ErrorOutlineIcon
                        sx={{
                            color: 'primary.main',
                            fontSize: 64,
                            mb: 2
                        }}
                    />
                )}
            </Box>

            <DialogTitle sx={{
                textAlign: 'center',
                pb: 1,
                pt: 0
            }}>
                <Typography variant="h2" sx={{ fontSize: '1.75rem' }}>
                    {isValid ? "Confirm Valid Action" : "Warning: Invalid Action"}
                </Typography>
            </DialogTitle>

            <DialogContent>
                <DialogContentText sx={{
                    textAlign: 'center',
                    color: 'text.primary'
                }}>
                    {isValid
                        ? "You're about to proceed with a valid action. Please confirm to continue."
                        : "The action you're attempting is invalid. Are you sure you want to proceed anyway?"}
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{
                justifyContent: 'center',
                pb: 3,
                px: 3,
                gap: 2
            }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    sx={{ fontWeight: 600 }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm} // Use local handler to pass isValid
                    variant={isValid ? "gradient" : "contained"}
                    color={isValid ? undefined : "primary"}
                    fullWidth
                    sx={{ fontWeight: 600 }}
                >
                    {isValid ? "Confirm" : "Proceed Anyway"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

interface ConfirmationModalDemoProps { 
    handleVerification: (isValid: boolean) => void;
}

export const ConfirmationModalDemo: React.FC<ConfirmationModalDemoProps> = ({ handleVerification }) => {
    const [openValid, setOpenValid] = useState(false);
    const [openInvalid, setOpenInvalid] = useState(false);

    // Single handler for both valid and invalid confirmations
    const handleConfirmation = (isValid: boolean) => {
        

        handleVerification(isValid)

        if (isValid) {
            console.log("Making API call for valid action");
            // apiService.performValidAction();
            setOpenValid(false);
        } else {
            console.log("Making API call for invalid action");
            // apiService.performInvalidAction();
            setOpenInvalid(false);
        }
    };

    // Function to close the appropriate modal
    const closeModal = (isValid: boolean) => {
        if (isValid) {
            setOpenValid(false);
        } else {
            setOpenInvalid(false);
        }
    };

    return (

            <Box sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                bgcolor: 'background.default',
            }}>
                <Typography variant="h1" sx={{ mb: 2 }}>
                    Confirm Product
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <Button
                        variant="gradient"
                        onClick={() => setOpenValid(true)}
                        size="large"
                    >
                        Product is Valid
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenInvalid(true)}
                        size="large"
                    >
                        Product is Invalid
                    </Button>
                </Stack>

                <ConfirmationModal
                    open={openValid}
                    onClose={() => closeModal(true)}
                    onConfirm={handleConfirmation} // Pass the single handler
                    isValid={true}
                />

                <ConfirmationModal
                    open={openInvalid}
                    onClose={() => closeModal(false)}
                    onConfirm={handleConfirmation} // Pass the same handler
                    isValid={false}
                />
            </Box>

    );
};

export default ConfirmationModalDemo;