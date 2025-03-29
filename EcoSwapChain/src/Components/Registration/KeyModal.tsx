import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Button,
    Typography,
    Paper,
    Fade,
    Grow,
    IconButton,
    Tooltip,
    Divider,
    Alert,
    Collapse,
    Checkbox
} from '@mui/material';
import { useNavigate } from 'react-router';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import KeyIcon from '@mui/icons-material/Key';
import { keyframes } from '@mui/system';

// Define pulse animation
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

interface KeyModalProps {
    passKey: string;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const KeyModal: React.FC<KeyModalProps> = ({ passKey, open, setOpen }) => {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [acknowledged, setAcknowledged] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [showAlert, setShowAlert] = useState(true);

    // Copy key to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(passKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    // Close modal and navigate
    const handleClose = () => {
        if (acknowledged) {
            setOpen(false);
            navigate('/');
        }
    };

    // Format key for better readability
    const formatKey = (key: string) => {
        // Split key into groups of 4 characters
        const groups = [];
        for (let i = 0; i < key.length; i += 4) {
            groups.push(key.slice(i, i + 4));
        }
        return groups.join('-');
    };

    // Countdown timer effect
    useEffect(() => {
        if (!open) return;

        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [open]);

    return (
        <Modal
            open={open}
            closeAfterTransition
        >
            <Fade in={open}>
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: 450 },
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 0,
                        overflow: 'hidden'
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            bgcolor: 'primary.main',
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1
                        }}
                    >
                        <KeyIcon sx={{ color: 'white', fontSize: 32 }} />
                        <Typography variant="h5" component="h2" color="white" fontWeight="bold">
                            Encryption Key Generated
                        </Typography>
                    </Box>

                    {/* Content */}
                    <Box sx={{ p: 3 }}>
                        <Collapse in={showAlert}>
                            <Alert
                                severity="warning"
                                icon={<WarningIcon fontSize="inherit" />}
                                sx={{ mb: 2 }}
                                onClose={() => setShowAlert(false)}
                            >
                                This key will never be shown again. Please save it now!
                            </Alert>
                        </Collapse>

                        <Typography variant="body1" mb={3}>
                            This encryption key is required for future transactions in the blockchain. It is not stored on our servers in plain text form for security reasons.
                        </Typography>

                        <Grow in={open} timeout={800}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 3,
                                    mb: 3,
                                    bgcolor: 'grey.100',
                                    border: '1px dashed',
                                    borderColor: 'primary.main',
                                    position: 'relative',
                                    animation: `${pulse} 2s infinite`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column'
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{
                                        fontFamily: 'monospace',
                                        letterSpacing: 1,
                                        fontWeight: 'bold',
                                        wordBreak: 'break-all',
                                        textAlign: 'center'
                                    }}
                                >
                                    {formatKey(passKey)}
                                </Typography>

                                <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                                    <IconButton
                                        color="primary"
                                        onClick={handleCopy}
                                        sx={{ mt: 1 }}
                                    >
                                        {copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                                    </IconButton>
                                </Tooltip>
                            </Paper>
                        </Grow>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Checkbox
                                    checked={acknowledged}
                                    onChange={(e) => setAcknowledged(e.target.checked)}
                                    color="primary"
                                />
                                <Typography>
                                    I understand that I must save this key and it won't be shown again
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleClose}
                                disabled={!acknowledged || countdown > 0}
                                endIcon={countdown > 0 && <Typography variant="caption">({countdown})</Typography>}
                            >
                                {acknowledged ? "I've Saved My Key" : "Acknowledge and Continue"}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Fade>
        </Modal>
    );
};

export default KeyModal;