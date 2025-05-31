import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Box,
    Typography,
    Stepper,
    Step,
    StepLabel,
    CircularProgress,
    Fade,
    Alert,
    IconButton,
    Divider,
    InputAdornment,
    Slider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { API } from '../API/api';

// Types
interface CoinSelectionModalProps {
    open: boolean;
    onClose: () => void;
    onCoinSelected: (amount: number) => void;
    coinConversionRate?: number;
}

interface PaymentModalProps {
    open: boolean;
    onClose: () => void;
    amount: number;
    coinAmount: number;
    currency?: string;
    onPaymentComplete?: () => void;
    walletAddress: string;
}

interface CardDetails {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
}

interface CardErrors {
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
}

// Styled Components
const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(3),
}));

const PaymentSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    marginTop: theme.spacing(2),
}));

const CardRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
    },
}));

const AnimationContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    minHeight: '300px',
}));

const SecureText = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
}));

const CoinSelectionSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    padding: theme.spacing(2, 0),
}));

const CoinPackageBox = styled(Box)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    '&:hover': {
        borderColor: theme.palette.primary.main,
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[2],
    },
    '&.selected': {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light || 'rgba(0, 123, 255, 0.05)',
    }
}));

const CoinAmountBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
}));

// Utility functions
const validateCardNumber = (cardNumber: string): boolean => {
    const sanitizedNumber = cardNumber.replace(/\s/g, '');
    const regex = /^[0-9]{16}$/;
    return regex.test(sanitizedNumber);
};

const validateExpiryDate = (expiryDate: string): boolean => {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(expiryDate)) return false;

    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    const expYear = parseInt(year);
    const expMonth = parseInt(month);

    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;

    return true;
};

const validateCVV = (cvv: string): boolean => {
    const regex = /^[0-9]{3,4}$/;
    return regex.test(cvv);
};

const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
        return parts.join(' ');
    } else {
        return value;
    }
};

// Coin Selection Modal Component
const SwapCoinSelectionModal: React.FC<CoinSelectionModalProps> = ({
    open,
    onClose,
    onCoinSelected,
    coinConversionRate = 0.1 // Default: $0.10 per SwapCoin
}) => {
    const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState<number>(100);
    const [isCustom, setIsCustom] = useState<boolean>(false);

    // Pre-defined SwapCoin packages
    const coinPackages = [
        { coins: 100, bonus: 0, price: 100 * coinConversionRate },
        { coins: 500, bonus: 50, price: 500 * coinConversionRate },
        { coins: 1000, bonus: 150, price: 1000 * coinConversionRate },
        { coins: 2500, bonus: 500, price: 2500 * coinConversionRate },
    ];

    // Reset state when modal opens
    useEffect(() => {
        if (open) {
            setSelectedPackage(null);
            setCustomAmount(100);
            setIsCustom(false);
        }
    }, [open]);

    const handlePackageSelect = (index: number) => {
        setSelectedPackage(index);
        setIsCustom(false);
    };

    const handleCustomSelect = () => {
        setSelectedPackage(null);
        setIsCustom(true);
    };

    const handleCustomAmountChange = (_event: Event, newValue: number | number[]) => {
        setCustomAmount(newValue as number);
    };

    const handleCustomInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        if (!isNaN(value) && value >= 10) {
            setCustomAmount(value > 10000 ? 10000 : value);
        }
    };

    const handleProceed = () => {
        let selectedAmount = 0;
        if (isCustom) {
            selectedAmount = customAmount;
        } else if (selectedPackage !== null) {
            selectedAmount = coinPackages[selectedPackage].coins + coinPackages[selectedPackage].bonus;
        }

        if (selectedAmount > 0) {
            const price = isCustom ?
                customAmount * coinConversionRate :
                coinPackages[selectedPackage as number].price;

            onCoinSelected(price);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    elevation: 3,
                    sx: { borderRadius: 4, overflow: 'hidden' }
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Typography variant="h6" component="div">
                    Purchase SwapCoins
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <Divider />

            <StyledDialogContent>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Select the amount of SwapCoins you would like to purchase:
                </Typography>

                <CoinSelectionSection>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        {coinPackages.map((pkg, index) => (
                            <CoinPackageBox
                                key={index}
                                className={selectedPackage === index ? 'selected' : ''}
                                onClick={() => handlePackageSelect(index)}
                            >
                                <MonetizationOnIcon color="primary" sx={{ fontSize: 36 }} />
                                <Typography variant="h6">{pkg.coins} SwapCoins</Typography>
                                {pkg.bonus > 0 && (
                                    <Typography variant="body2" sx={{ color: 'success.main' }}>
                                        +{pkg.bonus} Bonus Coins
                                    </Typography>
                                )}
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
                                    ₹{pkg.price.toFixed(2)}
                                </Typography>
                            </CoinPackageBox>
                        ))}
                    </Box>

                    <Box>
                        <CoinPackageBox
                            className={isCustom ? 'selected' : ''}
                            onClick={handleCustomSelect}
                            sx={{ mt: 2 }}
                        >
                            <Typography variant="h6">Custom Amount</Typography>

                            <Box sx={{ width: '100%', px: 2, mt: 2 }}>
                                <Slider
                                    value={customAmount}
                                    onChange={handleCustomAmountChange}
                                    aria-labelledby="swap-coin-slider"
                                    min={10}
                                    max={10000}
                                    step={10}
                                    disabled={!isCustom}
                                />

                                <CoinAmountBox>
                                    <TextField
                                        value={customAmount}
                                        onChange={handleCustomInputChange}
                                        size="small"
                                        type="number"
                                        inputProps={{ min: 10, max: 10000 }}
                                        disabled={!isCustom}
                                        sx={{ width: '100px' }}
                                    />
                                    <Typography>SwapCoins</Typography>
                                </CoinAmountBox>
                            </Box>

                            {isCustom && (
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                                    ${(customAmount * coinConversionRate).toFixed(2)}
                                </Typography>
                            )}
                        </CoinPackageBox>
                    </Box>
                </CoinSelectionSection>
            </StyledDialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleProceed}
                    disabled={selectedPackage === null && !isCustom}
                >
                    Continue to Payment
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Main Payment Modal Component
const MockPaymentModal: React.FC<PaymentModalProps> = ({
    open,
    onClose,
    amount,
    coinAmount,
    currency = 'USD',
    onPaymentComplete,
    walletAddress,
}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPaymentComplete, setIsPaymentComplete] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    const [cardDetails, setCardDetails] = useState<CardDetails>({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
    });

    const [errors, setErrors] = useState<CardErrors>({});

    const steps = ['Enter Details', 'Processing', 'Confirmation'];

    // Reset the state when modal opens
    useEffect(() => {
        if (open) {
            setActiveStep(0);
            setIsProcessing(false);
            setIsPaymentComplete(false);
            setPaymentError(null);
            setCardDetails({
                cardNumber: '',
                cardHolder: '',
                expiryDate: '',
                cvv: '',
            });
            setErrors({});
        }
    }, [open]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'cardNumber') {
            setCardDetails({ ...cardDetails, [name]: formatCardNumber(value) });
        } else if (name === 'expiryDate') {
            let formattedValue = value.replace(/[^\d]/g, '');
            if (formattedValue.length >= 3) {
                formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`;
            }
            setCardDetails({ ...cardDetails, [name]: formattedValue });
        } else {
            setCardDetails({ ...cardDetails, [name]: value });
        }

        // Clear error when typing
        if (errors[name as keyof CardErrors]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: CardErrors = {};

        if (!validateCardNumber(cardDetails.cardNumber)) {
            newErrors.cardNumber = 'Please enter a valid 16-digit card number';
        }

        if (!cardDetails.cardHolder.trim()) {
            newErrors.cardHolder = 'Cardholder name is required';
        }

        if (!validateExpiryDate(cardDetails.expiryDate)) {
            newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
        }

        if (!validateCVV(cardDetails.cvv)) {
            newErrors.cvv = 'CVV must be 3 or 4 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        setPaymentError(null);

        if (validateForm()) {
            setActiveStep(1);
            setIsProcessing(true);

            console.log(amount, walletAddress);
            try {
                await API.post("wallet/swapcoin/purchase/", {
                    amount: coinAmount,
                    user_wallet_address: walletAddress,
                });
                setIsProcessing(false);
                setIsPaymentComplete(true);
                setActiveStep(2);
                // Check if onPaymentComplete exists before calling it
                if (onPaymentComplete) {
                    onPaymentComplete();
                }
                onClose();
            } catch (error) {
                console.log(error);
                setPaymentError('Transaction failed. Please try again.');
                setIsProcessing(false);
                setActiveStep(0);
            }
        }
    };

    const renderPaymentForm = () => (
        <PaymentSection>
            <TextField
                fullWidth
                label="Card Number"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleInputChange}
                error={!!errors.cardNumber}
                helperText={errors.cardNumber}
                placeholder="1234 5678 9012 3456"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <CreditCardIcon color="primary" />
                        </InputAdornment>
                    ),
                    inputProps: {
                        maxLength: 19,
                    }
                }}
            />

            <TextField
                fullWidth
                label="Cardholder Name"
                name="cardHolder"
                value={cardDetails.cardHolder}
                onChange={handleInputChange}
                error={!!errors.cardHolder}
                helperText={errors.cardHolder}
                placeholder="John Doe"
            />

            <CardRow>
                <TextField
                    label="Expiry Date"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleInputChange}
                    error={!!errors.expiryDate}
                    helperText={errors.expiryDate}
                    placeholder="MM/YY"
                    inputProps={{ maxLength: 5 }}
                    fullWidth
                />

                <TextField
                    label="CVV"
                    name="cvv"
                    type="password"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                    error={!!errors.cvv}
                    helperText={errors.cvv}
                    placeholder="123"
                    inputProps={{ maxLength: 4 }}
                    fullWidth
                />
            </CardRow>

            {paymentError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {paymentError}
                </Alert>
            )}

            <SecureText>
                <LockIcon fontSize="small" />
                <Typography variant="body2">Secure payment processing</Typography>
            </SecureText>
        </PaymentSection>
    );

    const renderProcessing = () => (
        <AnimationContainer>
            <CircularProgress size={64} color="primary" />
            <Typography variant="h6" sx={{ mt: 3 }}>
                Processing Payment
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Please do not close this window...
            </Typography>
        </AnimationContainer>
    );

    const renderConfirmation = () => (
        <AnimationContainer>
            <Fade in={isPaymentComplete}>
                <CheckCircleIcon color="primary" sx={{ fontSize: 80 }} />
            </Fade>
            <Typography variant="h6" sx={{ mt: 3 }}>
                Payment Successful!
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
                Your transaction of {currency} {Number(amount).toFixed(2)} has been completed.
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
                {coinAmount} SwapCoins have been added to your account.
            </Typography>
        </AnimationContainer>
    );

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return renderPaymentForm();
            case 1:
                return renderProcessing();
            case 2:
                return renderConfirmation();
            default:
                return null;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={activeStep === 0 ? onClose : undefined}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    elevation: 3,
                    sx: { borderRadius: 4, overflow: 'hidden' }
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Typography variant="h6" component="div">
                    {activeStep === 2 ? 'Payment Complete' : 'Payment Details'}
                </Typography>
                {activeStep === 0 && (
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                )}
            </DialogTitle>

            <Divider />

            <Box sx={{ px: 3, pt: 2 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box sx={{ my: 1 }}>
                    <Typography variant="h5" fontWeight="bold" textAlign="center">
                        {currency} {Number(amount).toFixed(2)}
                    </Typography>
                    <Typography variant="body1" textAlign="center" color="text.secondary">
                        for {coinAmount} SwapCoins
                    </Typography>
                </Box>
            </Box>

            <StyledDialogContent>
                {renderStepContent()}
            </StyledDialogContent>

            {activeStep === 0 && (
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={onClose} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={isProcessing}
                    >
                        Pay Now
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
};

// Main component for SwapCoin purchase flow
export const SwapCoinPurchaseButton: React.FC<{
    coinConversionRate?: number;
    buttonName?: string;
    clicked?: boolean;
    onPurchaseComplete?: (coinAmount: number) => void;
    walletAddress: string;
}> = ({
    coinConversionRate = 0.1,
    buttonName = "Buy SwapCoins",
    clicked = false,
    onPurchaseComplete,
    walletAddress
}) => {
        const [isCoinSelectionOpen, setIsCoinSelectionOpen] = useState(false);
        const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
        const [selectedAmount, setSelectedAmount] = useState(0);
        const [coinAmount, setCoinAmount] = useState(0);

        const handleOpen = () => {
            setIsCoinSelectionOpen(true);
        };

        const handleCoinSelectionClose = () => {
            setIsCoinSelectionOpen(false);
        };

        const handlePaymentModalClose = () => {
            setIsPaymentModalOpen(false);
        };

        const handleCoinSelected = (price: number) => {
            setSelectedAmount(price);
            // Calculate the coin amount based on the price
            const coinsAmount = Math.round(price / coinConversionRate);
            setCoinAmount(coinsAmount);
            setIsCoinSelectionOpen(false);
            setIsPaymentModalOpen(true);
        };

        const handlePaymentComplete = () => {
            if (onPurchaseComplete) {
                onPurchaseComplete(coinAmount);
            }
        };

        return (
            <Box>
                <Button
                    variant='contained'
                    color='primary'
                    sx={{
                        py: 1.5,
                        borderRadius: '12px',
                        transform: clicked ? 'scale(0.98)' : 'scale(1)',
                        transition: 'transform 0.2s',
                        mb: 3
                    }}
                    onClick={handleOpen}
                    startIcon={<MonetizationOnIcon />}
                >
                    {buttonName}
                </Button>

                <SwapCoinSelectionModal
                    open={isCoinSelectionOpen}
                    onClose={handleCoinSelectionClose}
                    onCoinSelected={handleCoinSelected}
                    coinConversionRate={coinConversionRate}
                />

                <MockPaymentModal
                    open={isPaymentModalOpen}
                    onClose={handlePaymentModalClose}
                    amount={selectedAmount}
                    coinAmount={coinAmount}
                    currency="USD"
                    onPaymentComplete={handlePaymentComplete}
                    walletAddress={walletAddress}
                />
            </Box>
        );
    };

export default SwapCoinPurchaseButton;