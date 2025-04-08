import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    Box,
    CircularProgress,
    IconButton,
    InputAdornment,
    Alert,
    Slide,
    useTheme,
    Divider,
    Paper
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import {
    Visibility,
    VisibilityOff,
    ArrowBack,
    CheckCircle,
    ErrorOutline,
    AccountBalanceWallet,
    Info
} from '@mui/icons-material';
import { API } from '../API/api';
import { setAlertMessage, setAlertOn, setAlertSeverity } from '../../Redux/alertBackdropSlice';
import { useDispatch } from 'react-redux';
import { triggerWallet } from '../../Redux/walletSlice';
import { decryptAndTransferEscrow } from '../../BlockChain/main';

// Define transition for the dialog
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// Define props interface
interface PaymentModalProps {
    open: boolean;
    onClose: () => void;
    amount: number;
    currencySymbol?: string;
    onPaymentComplete?: (success: boolean) => void;
    walletAddress: string;
}

// Define wallet info interface
interface WalletInfo {
    balance: number;
    address: string;
    isLoading: boolean;
    error: string | null;
}

// Define payment states
type PaymentStep = 'wallet' | 'amount' | 'password' | 'processing' | 'success' | 'failure';

export const PaymentModal: React.FC<PaymentModalProps> = ({
    open,
    onClose,
    amount,
    currencySymbol = 'SC', // Default SwapCoin symbol
    onPaymentComplete,
    walletAddress
}) => {
    const theme = useTheme();
    const [step, setStep] = useState<PaymentStep>('wallet');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [walletInfo, setWalletInfo] = useState<WalletInfo>({
        balance: 0,
        address: '',
        isLoading: true,
        error: null
    });
    const [transactionId, setTransactionId] = useState('');

    const dispatch = useDispatch();

    // Fetch wallet information when modal opens
    useEffect(() => {
        if (open) {
            fetchWalletInfo();
        }
    }, [open]);

    const fetchWalletInfo = async () => {
        setWalletInfo(prev => ({ ...prev, isLoading: true, error: null }));
        try {
            const { data } = await API.get("wallet/balance/");

            setWalletInfo({
                balance: Number(data.balance),
                address: walletAddress,
                isLoading: false,
                error: null
            });
        } catch (error) {
            console.error("❌ Failed to fetch wallet info:", error);
            setWalletInfo(prev => ({
                ...prev,
                isLoading: false,
                error: "Failed to load wallet information. Please try again."
            }));
            dispatch(setAlertMessage(`Error: Failed to fetch wallet details.`));
            dispatch(setAlertOn(true));
            dispatch(setAlertSeverity("error"));
        }
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

            // Simulate failed payment
            setTimeout(() => {
                setStep('failure');
                setError("Transaction authorization failed. Please check your password and try again.");
                if (onPaymentComplete) {
                    onPaymentComplete(false);
                }
            }, 2000);

            throw error;
        }
    };

    // Process payment
    const processPayment = async () => {
        try {
            setStep('processing');
            const initTransfer = await initiateFeeTransfer();
            const tx = await decryptAndTransferEscrow(Number(amount), initTransfer.treasuryKey, initTransfer.rpcUrl, initTransfer.mintAddress, password, initTransfer.encKey);
            setTransactionId(tx)
            
        } catch (error) {
            console.error("❌ Payment processing failed:", error);
            // Error handling is already done in initiateFeeTransfer
        }
    };

    const handleWalletProceed = () => {
        if (walletInfo.balance < amount) {
            setError("Insufficient SwapCoin balance. Please top up your wallet before proceeding.");
            return;
        }
        setError('');
        setStep('amount');
    };

    const handleConfirmAmount = async () => {
        // Double-check balance before proceeding
        try {
            const { data } = await API.get("wallet/balance/");
            if (Number(data.balance) < Number(amount)) {
                setError("Insufficient SwapCoin balance. Please top up before proceeding.");
                setStep('wallet'); // Go back to wallet screen
                return;
            } else {
                setStep('password');
                setError('');
            }
        } catch (error) {
            console.error("❌ Failed to fetch balance:", error);
            setError("Failed to verify balance. Please try again.");
        }
    };

    const handlePasswordSubmit = () => {
        if (!password) {
            setError('Please enter your password');
            return;
        }
        setError('');
        processPayment();
    };

    const handleClose = () => {
        // Reset state on close
        setStep('wallet');
        setPassword('');
        setError('');
        setShowPassword(false);
        onClose();
    };

    const handleBack = () => {
        if (step === 'password') {
            setStep('amount');
            setPassword('');
            setError('');
        } else if (step === 'amount') {
            setStep('wallet');
            setError('');
        }
    };

    const handleTopUp = () => {
        // Redirect to wallet top-up page or open top-up modal
        dispatch(setAlertMessage("Redirecting to wallet top-up page..."));
        dispatch(setAlertOn(true));
        dispatch(setAlertSeverity("info"));
        dispatch(triggerWallet());
        // Close current modal
        handleClose();
    };

    const renderStepContent = () => {
        switch (step) {
            case 'wallet':
                return (
                    <>
                        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                            <Typography variant="h5" fontWeight={600}>
                                <AccountBalanceWallet sx={{ mr: 1, verticalAlign: 'bottom' }} />
                                Wallet Information
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            {walletInfo.isLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                    <CircularProgress size={40} thickness={4} />
                                </Box>
                            ) : walletInfo.error ? (
                                <Alert severity="error" sx={{ my: 2 }}>
                                    {walletInfo.error}
                                </Alert>
                            ) : (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    py: 2
                                }}>
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            p: 3,
                                            width: '100%',
                                            borderRadius: 2,
                                            mb: 3,
                                            background: theme.palette.background.paper,
                                            border: `1px solid ${theme.palette.divider}`
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                                            Wallet Address
                                        </Typography>
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                background: theme.palette.background.default,
                                                borderRadius: 1,
                                                fontFamily: 'monospace',
                                                fontSize: '0.9rem',
                                                wordBreak: 'break-all'
                                            }}
                                        >
                                            {walletInfo.address}
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                Available Balance
                                            </Typography>
                                            <Typography
                                                variant="h5"
                                                fontWeight={700}
                                                sx={{ color: theme.palette.secondary.main }}
                                            >
                                                {currencySymbol} {walletInfo.balance.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Paper>

                                    <Box sx={{ width: '100%', mb: 2 }}>
                                        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                                            Payment Details
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2">Amount to Pay:</Typography>
                                            <Typography variant="body2" fontWeight={600}>
                                                {currencySymbol} {amount.toFixed(2)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2">Conversion Rate:</Typography>
                                            <Typography variant="body2">1 {currencySymbol} = $2.00</Typography>
                                        </Box>
                                    </Box>

                                    {walletInfo.balance < amount && (
                                        <Alert
                                            severity="warning"
                                            icon={<Info />}
                                            sx={{ width: '100%', mb: 2 }}
                                        >
                                            <Typography variant="body2" fontWeight={500}>
                                                Insufficient balance! You need {currencySymbol} {(amount - walletInfo.balance).toFixed(2)} more to complete this transaction.
                                            </Typography>
                                        </Alert>
                                    )}

                                    {error && (
                                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                                            {error}
                                        </Alert>
                                    )}
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={handleClose}
                                sx={{ minWidth: '120px' }}
                            >
                                Cancel
                            </Button>

                            {walletInfo.balance < amount ? (
                                <Button
                                    variant="gradient"
                                    onClick={handleTopUp}
                                    sx={{ minWidth: '120px' }}
                                >
                                    Top Up Wallet
                                </Button>
                            ) : (
                                <Button
                                    variant="gradient"
                                    onClick={handleWalletProceed}
                                    sx={{ minWidth: '120px' }}
                                    disabled={walletInfo.isLoading || !!walletInfo.error}
                                >
                                    Proceed
                                </Button>
                            )}
                        </DialogActions>
                    </>
                );

            case 'amount':
                return (
                    <>
                        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                            <Box sx={{ position: 'relative' }}>
                                <IconButton
                                    sx={{ position: 'absolute', left: -12, top: -8 }}
                                    onClick={handleBack}
                                >
                                    <ArrowBack />
                                </IconButton>
                                <Typography variant="h5" fontWeight={600}>Pay with SwapCoin</Typography>
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                py: 2
                            }}>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    You are about to pay:  (1 swapcoin = $2)
                                </Typography>
                                <Box sx={{
                                    background: theme.palette.gradient.primary,
                                    borderRadius: 2,
                                    p: 3,
                                    mb: 2,
                                    width: '100%',
                                    textAlign: 'center'
                                }}>
                                    <Typography
                                        variant="h4"
                                        fontWeight={700}
                                        sx={{ color: theme.palette.primary.contrastText }}
                                    >
                                        {currencySymbol} {amount.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                    Your Asset is safe. Payment will be held at escrow. The same will be credited to seller's wallet after the ownership is transferred.
                                </Typography>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={handleClose}
                                sx={{ minWidth: '120px' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="gradient"
                                onClick={handleConfirmAmount}
                                sx={{ minWidth: '120px' }}
                            >
                                Confirm
                            </Button>
                        </DialogActions>
                    </>
                );

            case 'password':
                return (
                    <>
                        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                            <Box sx={{ position: 'relative' }}>
                                <IconButton
                                    sx={{ position: 'absolute', left: -12, top: -8 }}
                                    onClick={handleBack}
                                >
                                    <ArrowBack />
                                </IconButton>
                                <Typography variant="h5" fontWeight={600}>Authenticate Payment</Typography>
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                py: 2
                            }}>
                                <Typography variant="body1" sx={{ mb: 3 }}>
                                    Please enter your SwapCoin password to complete the payment of:
                                </Typography>
                                <Typography
                                    variant="h5"
                                    fontWeight={600}
                                    sx={{ color: theme.palette.secondary.main, mb: 3 }}
                                >
                                    {currencySymbol} {amount.toFixed(2)}
                                </Typography>

                                <TextField
                                    fullWidth
                                    label="Password"
                                    variant="outlined"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    error={!!error}
                                    helperText={error}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handlePasswordSubmit();
                                        }
                                    }}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={handleClose}
                                sx={{ minWidth: '120px' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="gradient"
                                onClick={handlePasswordSubmit}
                                sx={{ minWidth: '120px' }}
                            >
                                Pay Now
                            </Button>
                        </DialogActions>
                    </>
                );

            case 'processing':
                return (
                    <>
                        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                            <Typography variant="h5" fontWeight={600}>Processing Payment</Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                py: 4
                            }}>
                                <CircularProgress
                                    size={60}
                                    thickness={4}
                                    sx={{ color: theme.palette.accent.main, mb: 3 }}
                                />
                                <Typography variant="body1">
                                    Please wait while we process your payment...
                                </Typography>
                            </Box>
                        </DialogContent>
                    </>
                );

            case 'success':
                return (
                    <>
                        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                            <Typography variant="h5" fontWeight={600}>Payment Successful</Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                py: 3
                            }}>
                                <CheckCircle
                                    sx={{
                                        fontSize: 80,
                                        color: theme.palette.accent.main,
                                        mb: 3
                                    }}
                                />
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    Your payment of {currencySymbol} {amount.toFixed(2)} was successful!
                                </Typography>
                                <Alert
                                    severity="success"
                                    sx={{
                                        width: '100%',
                                        mt: 2
                                    }}
                                >
                                    Transaction ID: {transactionId || `SC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`}
                                </Alert>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                            <Button
                                variant="gradient"
                                onClick={handleClose}
                                sx={{ minWidth: '160px' }}
                            >
                                Done
                            </Button>
                        </DialogActions>
                    </>
                );

            case 'failure':
                return (
                    <>
                        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                            <Typography variant="h5" fontWeight={600}>Payment Failed</Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                py: 3
                            }}>
                                <ErrorOutline
                                    sx={{
                                        fontSize: 80,
                                        color: theme.palette.primary.main,
                                        mb: 3
                                    }}
                                />
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    We couldn't process your payment of {currencySymbol} {amount.toFixed(2)}.
                                </Typography>
                                <Alert
                                    severity="error"
                                    sx={{
                                        width: '100%',
                                        mt: 2
                                    }}
                                >
                                    {error || "Something went wrong. Please try again later."}
                                </Alert>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={handleClose}
                                sx={{ minWidth: '120px' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="gradient"
                                onClick={() => setStep('wallet')}
                                sx={{ minWidth: '120px' }}
                            >
                                Try Again
                            </Button>
                        </DialogActions>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => {
                // Only allow closing on certain steps
                if (['wallet', 'amount', 'success', 'failure'].includes(step)) {
                    handleClose();
                }
            }}
            TransitionComponent={Transition}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: 3,
                }
            }}
        >
            {renderStepContent()}
        </Dialog>
    );
};

// Usage example component with a PayNow button
interface PaymentProps {
    amount: number;
    walletAddress: string;
}

export const Payment: React.FC<PaymentProps> = ({ amount, walletAddress }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="contained"
                onClick={() => setOpen(true)}
                sx={{ ml: 2 }}
            >
                Pay Now
            </Button>

            <PaymentModal
                open={open}
                onClose={() => setOpen(false)}
                amount={amount}
                walletAddress={walletAddress}
                onPaymentComplete={(success) => {
                    console.log(`Payment ${success ? 'successful' : 'failed'}`);
                    // You can perform additional actions here based on payment status
                }}
            />
        </>
    );
};

export default Payment;