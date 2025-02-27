import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    Button,
    TextField,
    Stepper,
    Step,
    StepLabel,
    Fade,
    Paper,
    Stack,
    IconButton,
    Divider,
    CircularProgress,
    Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import TokenIcon from '@mui/icons-material/Token';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { motion } from 'framer-motion';

interface NFTMintingModalProps {
    open: boolean;
    onClose: () => void;
    nftData: {
        name: string;
        imageUrl: string;
        swapCoinCost: number;
        createdAt: string;
        id: number;
    };
    onConfirm: (password: string) => Promise<void>;
    userSwapCoinBalance: number;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(4),
    boxShadow: theme.shadows[2],
    width: '450px',
    maxWidth: '90vw',
    background: theme.palette.background.paper,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '6px',
        background: theme.palette.gradient.primary
    }
}));

const NFTImage = styled(Box)(({ theme }) => ({
    width: '100%',
    aspectRatio: '1/1',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.primary.light}`,
    background: theme.palette.grey[100],
    position: 'relative',
    '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.5s ease-in-out',
        '&:hover': {
            transform: 'scale(1.05)'
        }
    }
}));

const GlowBadge = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 10,
    right: 10,
    padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)}`,
    borderRadius: theme.shape.borderRadius,
    background: 'rgba(0, 0, 0, 0.7)',
    color: theme.palette.primary.contrastText,
    fontSize: '0.75rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    backdropFilter: 'blur(4px)',
    boxShadow: `0 0 10px ${theme.palette.accent.main}`,
    animation: 'pulse 2s infinite'
}));

const PasswordTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        background: theme.palette.background.default,
        '&.Mui-focused': {
            '& fieldset': {
                borderWidth: '2px',
            }
        }
    }
}));

const SwapCoinButton = styled(Button)(({ theme }) => ({
    background: theme.palette.gradient.secondary,
    fontWeight: 700,
    padding: theme.spacing(1.5, 3),
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[3]
    }
}));

// Animation variants for framer-motion
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 24
        }
    }
};

// Main component
export const NFTMintingModal: React.FC<NFTMintingModalProps> = ({
    open,
    onClose,
    nftData,
    onConfirm,
    userSwapCoinBalance
}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const steps = ['Review NFT', 'Confirm Payment', 'Sign Transaction'];
    const insufficientBalance = userSwapCoinBalance < nftData.swapCoinCost;

    const handleNext = () => {
        if (activeStep === 2) {
            handleConfirm();
        } else {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleConfirm = async () => {
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            setIsProcessing(true);
            setError(null);
            await onConfirm(password);
            setActiveStep(3); // Success state
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Transaction failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        // Reset state when modal closes
        setActiveStep(0);
        setPassword('');
        setError(null);
        onClose();
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants}>
                            <NFTImage>
                                <img src={nftData.imageUrl} alt={nftData.name} />
                                <GlowBadge>
                                    <TokenIcon fontSize="small" />
                                    Pending
                                </GlowBadge>
                            </NFTImage>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography variant="h5" fontWeight={700} gutterBottom>
                                {nftData.name}
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Created on {new Date(nftData.createdAt).toLocaleString()}
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Alert severity="info" sx={{ mt: 2 }}>
                                This NFT is waiting for your confirmation to be minted on the blockchain.
                            </Alert>
                        </motion.div>
                    </motion.div>
                );

            case 1:
                return (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants}>
                            <Typography variant="h6" gutterBottom>
                                Payment Details
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                <Typography variant="body1">SwapCoin Cost:</Typography>
                                <Typography variant="body1" fontWeight={600} color="primary.dark">
                                    {nftData.swapCoinCost} SWC
                                </Typography>
                            </Stack>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                                <Typography variant="body1">Your Balance:</Typography>
                                <Typography
                                    variant="body1"
                                    fontWeight={600}
                                    color={insufficientBalance ? "error" : "accent.dark"}
                                >
                                    {userSwapCoinBalance} SWC
                                </Typography>
                            </Stack>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Divider sx={{ my: 2 }} />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            {insufficientBalance ? (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    You don't have enough SwapCoin balance to complete this transaction.
                                </Alert>
                            ) : (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    You have sufficient balance to complete this transaction.
                                </Alert>
                            )}
                        </motion.div>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants}>
                            <Typography variant="h6" gutterBottom>
                                Sign Transaction
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography variant="body2" sx={{ mb: 3 }}>
                                Enter your transaction password to sign and complete the minting process.
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <PasswordTextField
                                fullWidth
                                type="password"
                                label="Transaction Password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError(null);
                                }}
                                error={!!error}
                                helperText={error}
                                InputProps={{
                                    startAdornment: <LockIcon color="primary" sx={{ mr: 1, opacity: 0.7 }} />,
                                }}
                                sx={{ mb: 2 }}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                This transaction will mint your NFT permanently on the blockchain and deduct {nftData.swapCoinCost} SwapCoin from your wallet.
                            </Alert>
                        </motion.div>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ textAlign: 'center' }}
                    >
                        <motion.div
                            variants={itemVariants}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            transition={{ type: 'spring', stiffness: 100 }}
                        >
                            <CheckCircleOutlineIcon
                                color="success"
                                sx={{ fontSize: 100, color: 'accent.main', mb: 2 }}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography variant="h5" fontWeight={700} gutterBottom>
                                NFT Successfully Minted!
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography variant="body1" gutterBottom>
                                Congratulations! Your NFT "{nftData.name}" is now on the blockchain.
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Transaction hash: {generateMockTxHash()}
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleClose}
                                sx={{ px: 4 }}
                            >
                                View My NFTs
                            </Button>
                        </motion.div>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    // Generate a mock transaction hash for the success screen
    const generateMockTxHash = () => {
        return `0x${Array.from({ length: 40 }, () =>
            Math.floor(Math.random() * 16).toString(16)).join('')}`;
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            aria-labelledby="nft-minting-modal"
            aria-describedby="modal-to-confirm-nft-minting"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2
            }}
        >
            <Fade in={open}>
                <StyledPaper>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 16,
                            top: 16,
                            color: 'text.secondary',
                            zIndex: 1
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {activeStep < 3 && (
                        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    )}

                    <Box sx={{ my: 2 }}>
                        {renderStepContent()}
                    </Box>

                    {activeStep < 3 && (
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button
                                color="inherit"
                                disabled={activeStep === 0 || isProcessing}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                            >
                                Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />

                            {activeStep === 2 ? (
                                <SwapCoinButton
                                    onClick={handleNext}
                                    disabled={password.length < 6 || isProcessing || insufficientBalance}
                                    startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <TokenIcon />}
                                >
                                    {isProcessing ? 'Processing...' : `Pay ${nftData.swapCoinCost} SwapCoin`}
                                </SwapCoinButton>
                            ) : (
                                <Button
                                    variant={activeStep === 1 ? "gradient" : "contained"}
                                    onClick={handleNext}
                                    disabled={insufficientBalance && activeStep === 1}
                                >
                                    {activeStep === 0 ? 'Continue' : 'Proceed to Sign'}
                                </Button>
                            )}
                        </Box>
                    )}
                </StyledPaper>
            </Fade>
        </Modal>
    );
};



export default NFTMintingModal;