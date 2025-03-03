import React, { useState, useEffect } from 'react';
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
    Alert,
    LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import TokenIcon from '@mui/icons-material/Token';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { motion } from 'framer-motion';
import { API } from '../../API/api';
import { decryptAndTransfer } from '../../../BlockChain/main';

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
    onConfirm: (password: string) => Promise<string>; // Modified to return transaction hash
}


interface NftBlkChainData {
    txHash: string;
    mintAddress: string;
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

const TransactionCard = styled(Box)(({ theme }) => ({
    background: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(2)
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

const floatVariants = {
    initial: { y: 0 },
    animate: {
        y: -10,
        transition: {
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse" as const,
            ease: "easeInOut"
        }
    }
};

// Main component
export const NFTMintingModal: React.FC<NFTMintingModalProps> = ({
    open,
    onClose,
    nftData,
}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transactionProgress, setTransactionProgress] = useState(0);
    const [transactionHash, setTransactionHash] = useState('');
    const [mintingProgress, setMintingProgress] = useState(0);
    const [treasuryPublicKey, setTreasuryPublicKey] = useState('');

    const [nftBlkChainData, setNftBlkChainData] = useState<NftBlkChainData>({
        txHash: "",
        mintAddress: ""
    })


    const steps = ['Review NFT', 'Confirm Payment', 'Sign Transaction', 'SwapCoin Transfer', 'Mint NFT'];

    const [userSwapCoinBalance, setUserSwapCoinBalance] = useState<number>(0)
    const [mintingFee, setMintingFee] = useState<number>(20)
    const [insufficientBalance, setInsufficientBalance] = useState<boolean>(true)
    
    const fetchBalance = async () => {
        try {
            const balanceResponse = await API.get('wallet/balance');
            const fetchedBalance = Number(balanceResponse.data.balance);

            setUserSwapCoinBalance(fetchedBalance);

            if (fetchedBalance < Number(mintingFee)) {
                setInsufficientBalance(true); // Should be `true` when balance is low
                alert("⚠️ Insufficient SwapCoin balance. Please top up before proceeding.");
            } else {
                setInsufficientBalance(false);
            }
        } catch (error) {
            console.error("❌ Error fetching balance:", error);
            alert("⚠️ Failed to fetch balance. Please try again.");
        }
    };

    const handleNext = async () => {
        if (activeStep === 0) {
            await fetchBalance();  // Ensure balance is fetched before proceeding
            if (!insufficientBalance) {
                setActiveStep(1);
            }
        } else if (activeStep === 2) {
            await handleConfirm(); // Ensure `handleConfirm()` runs asynchronously
        } else if (activeStep < 4) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };


    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const simulateTransactionProgress = () => {
        // Simulate transaction progress
        const interval = setInterval(() => {
            setTransactionProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 5;
            });
        }, 200);
    };

    const simulateMintingProgress = () => {
        // Simulate minting progress
        const interval = setInterval(() => {
            setMintingProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2;
            });
        }, 200);
    };

    // Watch for transaction progress completion and automatically move to next step
    useEffect(() => {
        if (transactionProgress === 100 && activeStep === 3) {
            setTimeout(() => setActiveStep(4), 1000);
        }
    }, [transactionProgress, activeStep]);

    // Watch for minting progress completion and automatically move to success
    useEffect(() => {
        if (mintingProgress === 100 && activeStep === 4) {
            setTimeout(() => setActiveStep(5), 1000);
        }
    }, [mintingProgress, activeStep]);

    const initiateFeeTransfer = async () => {
        try {
            const initResponse = await API.post("wallet/mintFee/tx/init", {
                password: password
            });

            console.log(initResponse);
            return initResponse.data; // Return the full response data
        } catch (error) {
            console.error("❌ Fee transfer initiation failed:", error);
            alert("Error: Failed to initiate fee transfer. Please try again.");
            throw error; // Re-throw to handle in `handleConfirm`
        }
    };

    const mintNFT = async (txHash: string) => {
        console.log(nftData.id);
        try {
            const mintResponse = await API.post('nfts/mint/', {
                txHash: txHash,
                id: nftData.id
            });

            console.log(mintResponse);
            setNftBlkChainData(mintResponse.data.tx)
            alert("✅ NFT successfully minted!");
        } catch (error) {
            console.error("❌ NFT minting failed:", error);
            alert("Error: Failed to mint NFT. Please try again.");
            throw error;
        }
    };

    const handleConfirm = async () => {
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            alert("⚠️ Password must be at least 6 characters long.");
            return;
        }

        try {
            setIsProcessing(true);
            setError(null);

            // Step 1: Initiate Fee Transfer
            const responseData = await initiateFeeTransfer();
            setTreasuryPublicKey(responseData.treasuryKey || "unknown_key");

            setActiveStep(3); // Move to transaction step
            simulateTransactionProgress();

            // Step 2: Transfer SwapCoin & Decrypt
            const txHash = await decryptAndTransfer(
                mintingFee,
                responseData.treasuryKey,
                responseData.rpcUrl,
                responseData.mintAddress,
                password,
                responseData.encKey
            );

            if (!txHash) {
                throw new Error("Transaction hash is missing. Transaction may have failed.");
            }

            setTransactionHash(txHash);
            alert(`✅ Transaction Successful! Tx Hash: ${txHash}`);

            simulateMintingProgress();

            // Step 3: Mint NFT
            await mintNFT(txHash);
        } catch (err) {
            console.error("❌ Transaction error:", err);
            alert(`Error: ${err instanceof Error ? err.message : "Transaction failed."}`);

            setActiveStep(2); 
            setIsProcessing(false);
        }
    };



    const handleClose = () => {

        setActiveStep(0);
        setPassword('');
        setError(null);
        setTransactionProgress(0);
        setMintingProgress(0);
        setTransactionHash('');
        setIsProcessing(false);
        onClose();
    };

    // Generate a mock transaction hash for the success screen

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
                                <img src={`http://localhost:8000/${nftData.imageUrl}`} alt={nftData.name} />
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
                                    {mintingFee} SWC
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

            case 3: // New SwapCoin Transfer Step
                return (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants}>
                            <Typography variant="h6" gutterBottom>
                                SwapCoin Transfer
                            </Typography>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            style={{ textAlign: 'center', marginBottom: '24px' }}
                        >
                            <motion.div
                                variants={floatVariants}
                                initial="initial"
                                animate="animate"
                            >
                                <AccountBalanceWalletIcon
                                    sx={{
                                        fontSize: 60,
                                        color: 'primary.main',
                                        mb: 1
                                    }}
                                />
                            </motion.div>

                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Transferring {nftData.swapCoinCost} SwapCoin to Treasury
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <TransactionCard>
                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">From:</Typography>
                                    <Typography variant="body2" fontWeight={500} sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        Your Wallet
                                    </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">To:</Typography>
                                    <Typography variant="body2" fontWeight={500} sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        Treasury ({treasuryPublicKey.substring(0, 6)}...{treasuryPublicKey.substring(treasuryPublicKey.length - 4)})
                                    </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">Amount:</Typography>
                                    <Typography variant="body2" fontWeight={600} color="primary.dark">
                                        {nftData.swapCoinCost} SWC
                                    </Typography>
                                </Stack>
                            </TransactionCard>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Transaction Progress
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={transactionProgress}
                                sx={{
                                    height: 8,
                                    borderRadius: 1,
                                    mb: 2,
                                    '& .MuiLinearProgress-bar': {
                                        background: (theme) => theme.palette.gradient.secondary
                                    }
                                }}
                            />
                            <Typography variant="caption" color="text.secondary" align="right" display="block">
                                {transactionProgress}% Complete
                            </Typography>
                        </motion.div>

                        {transactionProgress === 100 && (
                            <motion.div
                                variants={itemVariants}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Alert severity="success" sx={{ mt: 2 }}>
                                    `Transaction Successful! ${transactionHash} Proceeding to NFT minting...``
                                </Alert>
                            </motion.div>
                        )}
                    </motion.div>
                );

            case 4: // NFT Minting Step
                return (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants}>
                            <Typography variant="h6" gutterBottom>
                                Minting Your NFT
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <NFTImage>
                                <motion.div
                                    initial={{ filter: 'blur(10px) grayscale(100%)' }}
                                    animate={{
                                        filter: `blur(${10 - (mintingProgress / 10)}px) grayscale(${100 - mintingProgress}%)`
                                    }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <img src={`http://localhost:8000/${nftData.imageUrl}`} alt={nftData.name} />
                                </motion.div>
                                <GlowBadge>
                                    <TokenIcon fontSize="small" />
                                    Minting...
                                </GlowBadge>
                            </NFTImage>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Your transaction was successful! Now minting your NFT on the blockchain...
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Minting Progress
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={mintingProgress}
                                sx={{
                                    height: 8,
                                    borderRadius: 1,
                                    mb: 2,
                                    '& .MuiLinearProgress-bar': {
                                        background: (theme) => theme.palette.gradient.primary
                                    }
                                }}
                            />
                            <Typography variant="caption" color="text.secondary" align="right" display="block">
                                {mintingProgress}% Complete
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <TransactionCard>
                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">Transaction Hash:</Typography>
                                </Stack>
                                <Typography
                                    variant="body2"
                                    fontWeight={500}
                                    sx={{
                                        wordBreak: 'break-all',
                                        fontFamily: 'monospace',
                                        bgcolor: 'background.paper',
                                        p: 1,
                                        borderRadius: 1,
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    {nftBlkChainData.txHash}
                                </Typography>
                            </TransactionCard>
                        </motion.div>

                        {mintingProgress === 100 && (
                            <motion.div
                                variants={itemVariants}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Alert severity="success" sx={{ mt: 2 }}>
                                    NFT successfully minted! Completing process...
                                </Alert>
                            </motion.div>
                        )}
                    </motion.div>
                );

            case 5: // Success Step (previously case 3)
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
                                Transaction hash: {nftBlkChainData.txHash}
                            </Typography>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Mint Address: {nftBlkChainData.mintAddress}
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
                p: 2,
                height: "80%"
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

                    {activeStep < 5 && (
                        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                            {steps.map((label, index) => (
                                <Step key={label}>
                                    <StepLabel>{index < 3 ? label : ''}</StepLabel>
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
                                    {isProcessing ? 'Processing...' : `Pay ${mintingFee} SwapCoin`}
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