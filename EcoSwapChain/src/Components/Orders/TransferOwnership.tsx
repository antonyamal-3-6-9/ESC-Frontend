import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Box,
    Typography,
    CircularProgress,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { API } from '../API/api';
import { setAlertMessage, setAlertOn, setAlertSeverity } from '../../Redux/alertBackdropSlice';
import { useDispatch } from 'react-redux';
import { decryptAndTransferNFT } from '../../BlockChain/main';

// Enum to track modal steps
enum TransferStep {
    CONFIRMATION,
    PASSWORD,
    PROCESSING,
    SUCCESS,
    FAILURE
}

interface TransferOwnershipModalProps {
    onTransferComplete: (tx: string) => void;
    entityName?: string;
    orderId: string;
    buyerAddress: string;
    mintAddress: string;
}

const TransferOwnershipModal: React.FC<TransferOwnershipModalProps> = ({
    onTransferComplete,
    entityName = "this asset",
    buyerAddress,
    mintAddress,
}) => {
    // State
    const [open, setOpen] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<TransferStep>(TransferStep.CONFIRMATION);
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [processingMessage, setProcessingMessage] = useState<string>('Processing your request...');

    const dispatch = useDispatch();

    // Handlers
    const handleOpen = () => {
        setOpen(true);
        setCurrentStep(TransferStep.CONFIRMATION);
        setPassword('');
        setPasswordError('');
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        if (passwordError) setPasswordError('');
    };

    const handleConfirmation = () => {
        setCurrentStep(TransferStep.PASSWORD);
    };

    const initiateFeeTransfer = async () => {
        try {
            const initResponse = await API.post("wallet/mintFee/tx/init", {
                password: password
            });

            console.log(initResponse);

            return initResponse.data;
        } catch (error) {
            console.error("❌ Fee transfer initiation failed:", error);
            dispatch(setAlertMessage(`Error: Failed to initiate transfer. ${error}`));
            dispatch(setAlertOn(true));
            dispatch(setAlertSeverity("error"));
            throw error;
        }
    };

    const handlePasswordSubmit = async () => {
        // Step 1: Validate password input
        if (!password) {
            setPasswordError('Please enter your transaction password');
            return;
        }

        try {
            // Step 2: Move to processing step
            setCurrentStep(TransferStep.PROCESSING);

            // Step 3: Initiate fee transfer and decrypt wallet
            const init = await initiateFeeTransfer();


            try {
                const tx = await decryptAndTransferNFT(buyerAddress,
                    init.rpcUrl, mintAddress, password, init.encKey
                );
                setCurrentStep(TransferStep.SUCCESS);
                onTransferComplete(tx)
            } catch (error) {
                console.log(error)
                setCurrentStep(TransferStep.FAILURE);
            }
        } catch (error) {
            console.error("❌ Transfer failed:", error);
            setCurrentStep(TransferStep.FAILURE);
        }
    };



    const handleRetry = () => {
        setCurrentStep(TransferStep.PASSWORD);
        setPassword('');
    };

    // Modal title based on current step
    const getModalTitle = () => {
        switch (currentStep) {
            case TransferStep.CONFIRMATION:
                return "Transfer Ownership";
            case TransferStep.PASSWORD:
                return "Enter Transaction Password";
            case TransferStep.PROCESSING:
                return "Processing";
            case TransferStep.SUCCESS:
                return "Transfer Complete";
            case TransferStep.FAILURE:
                return "Transfer Failed";
        }
    };

    // Render different modal content based on current step
    const renderModalContent = () => {
        switch (currentStep) {
            case TransferStep.CONFIRMATION:
                return (
                    <>
                        <DialogContentText>
                            Are you sure you want to transfer ownership of {entityName}? This action cannot be undone.
                        </DialogContentText>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary" variant="outlined">
                                Cancel
                            </Button>
                            <Button onClick={handleConfirmation} color="primary" variant="contained">
                                Confirm
                            </Button>
                        </DialogActions>
                    </>
                );

            case TransferStep.PASSWORD:
                return (
                    <>
                        <DialogContentText sx={{ mb: 2 }}>
                            Please enter your transaction password to confirm the ownership transfer.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="password"
                            label="Transaction Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={password}
                            onChange={handlePasswordChange}
                            error={!!passwordError}
                            helperText={passwordError}
                        />
                        <DialogActions>
                            <Button onClick={handleClose} color="primary" variant="outlined">
                                Cancel
                            </Button>
                            <Button
                                onClick={handlePasswordSubmit}
                                color="primary"
                                variant="gradient"
                                disabled={!password}
                            >
                                Submit
                            </Button>
                        </DialogActions>
                    </>
                );

            case TransferStep.PROCESSING:
                return (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        py: 4
                    }}>
                        <CircularProgress size={60} sx={{ color: 'accent.main', mb: 3 }} />
                        <Typography variant="h6" align="center">
                            {processingMessage}
                        </Typography>
                        <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 1 }}>
                            Please do not close this window.
                        </Typography>
                    </Box>
                );

            case TransferStep.SUCCESS:
                return (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        py: 4
                    }}>
                        <CheckCircleOutlineIcon sx={{
                            fontSize: 80,
                            color: 'accent.main',
                            mb: 3
                        }} />
                        <Typography variant="h6" align="center">
                            Ownership Transfer Successful!
                        </Typography>
                        <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                            The ownership of {entityName} has been successfully transferred.
                        </Typography>
                        <Button
                            onClick={handleClose}
                            color="primary"
                            variant="contained"
                            sx={{ minWidth: 120 }}
                        >
                            Done
                        </Button>
                    </Box>
                );

            case TransferStep.FAILURE:
                return (
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        py: 4
                    }}>
                        <ErrorOutlineIcon sx={{
                            fontSize: 80,
                            color: 'error.main',
                            mb: 3
                        }} />
                        <Typography variant="h6" align="center">
                            Ownership Transfer Failed
                        </Typography>
                        <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                            We couldn't process your request. Please check your password and try again.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                onClick={handleClose}
                                color="primary"
                                variant="outlined"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleRetry}
                                color="primary"
                                variant="contained"
                            >
                                Try Again
                            </Button>
                        </Box>
                    </Box>
                );
        }
    };

    // Determine if close button should be shown
    const showCloseButton = currentStep !== TransferStep.PROCESSING;

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpen}
                sx={{
                    ml: 1,
                }}
            >
                Transfer Ownership
            </Button>

            <Dialog
                open={open}
                onClose={currentStep !== TransferStep.PROCESSING ? handleClose : undefined}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        bgcolor: 'background.paper',
                        boxShadow: 3,
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: currentStep === TransferStep.CONFIRMATION || currentStep === TransferStep.PASSWORD ? 1 : 0
                }}>
                    {getModalTitle()}
                    {showCloseButton && (
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{ color: 'text.secondary' }}
                        >
                            <CloseIcon />
                        </IconButton>
                    )}
                </DialogTitle>

                <DialogContent>
                    {renderModalContent()}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default TransferOwnershipModal;