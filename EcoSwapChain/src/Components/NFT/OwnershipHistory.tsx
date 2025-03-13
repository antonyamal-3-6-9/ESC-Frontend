import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    Chip,
    Paper,
    IconButton,
    Fade,
    Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { format, formatDistanceToNow, differenceInDays } from 'date-fns';

// Types
interface Transaction {
    transferedTo: string;
    transferedFrom: string;
    transactionHash: string;
    transactionType: 'mint' | 'transfer';
    timestamp: number; // Unix timestamp
    status: 'success' | 'failed';
}

interface NFTOwnershipHistoryModalProps {
    open: boolean;
    onClose: () => void;
    transactions: Transaction[];
}

// Styled Components
const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '24px',
        overflow: 'hidden',
        background: theme.palette.background.paper,
        maxWidth: '550px',
        width: '100%',
    },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: theme.palette.gradient.secondary,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(3),
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'rotate(90deg)',
        background: 'rgba(255, 255, 255, 0.1)',
    },
}));

const TransactionCard = styled(Paper)(({ theme }) => ({
    borderRadius: '16px',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: '1px solid rgba(0, 0, 0, 0.08)',
    position: 'relative',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[2],
    },
}));

const AddressChip = styled(Chip)(({ theme }) => ({
    background: theme.palette.surface.main,
    color: theme.palette.text.primary,
    borderRadius: '8px',
    fontWeight: 500,
    border: '1px solid rgba(0, 0, 0, 0.08)',
    maxWidth: '150px',
    '& .MuiChip-label': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
}));

const HashLink = styled('a')(({ theme }) => ({
    color: theme.palette.secondary.main,
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.75rem',
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
    },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const OwnershipPeriodChip = styled(Chip)(({ theme, isCurrent }: { theme: any; isCurrent: boolean }) => ({
    background: isCurrent ? theme.palette.accent.light : theme.palette.primary.light,
    color: isCurrent ? theme.palette.accent.contrastText : theme.palette.primary.contrastText,
    fontWeight: 600,
    animation: isCurrent ? 'pulse 2s infinite' : 'none',
    '@keyframes pulse': {
        '0%': {
            boxShadow: `0 0 0 0 rgba(121, 215, 190, 0.5)`,
        },
        '70%': {
            boxShadow: `0 0 0 10px rgba(121, 215, 190, 0)`,
        },
        '100%': {
            boxShadow: `0 0 0 0 rgba(121, 215, 190, 0)`,
        },
    },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatusChip = styled(Chip)(({ theme, status }: { theme: any; status: 'success' | 'failed' }) => ({
    background: status === 'success' ? 'rgba(121, 215, 190, 0.2)' : 'rgba(255, 99, 71, 0.2)',
    color: status === 'success' ? theme.palette.accent.dark : '#d32f2f',
    fontWeight: 500,
    fontSize: '0.75rem',
    height: '24px',
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypeIcon = styled(Box)(({ theme, transactionType }: { theme: any; transactionType: 'mint' | 'transfer' }) => ({
    backgroundColor: transactionType === 'mint' ? theme.palette.accent.main : theme.palette.primary.main,
    borderRadius: '50%',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.contrastText,
}));

// Utility Functions
const shortenAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const getExplorerUrl = (hash: string): string => {
    // Replace with the appropriate blockchain explorer URL
    return `https://etherscan.io/tx/${hash}`;
};

// Main Component
const NFTOwnershipHistoryModal: React.FC<NFTOwnershipHistoryModalProps> = ({
    open,
    onClose,
    transactions,
}) => {
    const [sortedTransactions, setSortedTransactions] = useState<Transaction[]>([]);
    const [ownershipDurations, setOwnershipDurations] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        // Sort transactions by timestamp (newest first)
        const sorted = [...transactions].sort((a, b) => b.timestamp - a.timestamp);
        setSortedTransactions(sorted);

        // Calculate ownership durations
        const durations: { [key: number]: string } = {};

        for (let i = 0; i < sorted.length; i++) {
            const currentTx = sorted[i];
            const nextTx = sorted[i + 1];

            if (!nextTx) {
                // First owner (after mint) - calculate from mint time to now
                const daysOwned = differenceInDays(new Date(), new Date(currentTx.timestamp));
                durations[currentTx.timestamp] = daysOwned > 0
                    ? `${daysOwned} days`
                    : formatDistanceToNow(new Date(currentTx.timestamp));
            } else {
                // Calculate duration between transactions
                const daysOwned = differenceInDays(
                    new Date(currentTx.timestamp),
                    new Date(nextTx.timestamp)
                );
                durations[nextTx.timestamp] = daysOwned > 0
                    ? `${daysOwned} days`
                    : formatDistanceToNow(new Date(nextTx.timestamp), { addSuffix: false });
            }
        }

        setOwnershipDurations(durations);
    }, [transactions]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
    };

    const transferCount = sortedTransactions.length > 0
        ? sortedTransactions.filter(tx => tx.transactionType === 'transfer').length
        : 0;

    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            fullWidth
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 500 }}
        >
            <StyledDialogTitle>
                <Box>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                        Ownership History
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {transferCount} transfers since minting
                    </Typography>
                </Box>
                <CloseButton aria-label="close" onClick={onClose}>
                    <CloseIcon />
                </CloseButton>
            </StyledDialogTitle>

            <DialogContent sx={{ p: 3 }}>
                {sortedTransactions.map((tx, index) => {
                    const isCurrentOwner = index === 0;
                    const isMint = tx.transactionType === 'mint';

                    return (
                        <Fade key={tx.transactionHash} in={true} timeout={(index + 1) * 300}>
                            <TransactionCard elevation={0}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                    <TypeIcon transactionType={tx.transactionType} theme={undefined}>
                                        {isMint ? <LocalOfferIcon /> : <SwapHorizIcon />}
                                    </TypeIcon>
                                    <Box sx={{ ml: 2, flex: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                {isMint ? 'Minted' : 'Transferred'}
                                            </Typography>
                                            <StatusChip
                                                status={tx.status}
                                                label={tx.status}
                                                size="small"
                                                icon={tx.status === 'success' ? <VerifiedIcon fontSize="small" /> : <ErrorOutlineIcon fontSize="small" />} theme={undefined}                                            />
                                        </Box>

                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {format(new Date(tx.timestamp), 'PPpp')}
                                        </Typography>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant="body2" sx={{ width: 80 }}>From:</Typography>
                                                <Tooltip title={tx.transferedFrom}>
                                                    <AddressChip
                                                        label={isMint ? 'Minting Contract' : shortenAddress(tx.transferedFrom)}
                                                        onClick={() => copyToClipboard(tx.transferedFrom)}
                                                        onDelete={() => copyToClipboard(tx.transferedFrom)}
                                                        deleteIcon={<ContentCopyIcon fontSize="small" />}
                                                    />
                                                </Tooltip>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant="body2" sx={{ width: 80 }}>To:</Typography>
                                                <Tooltip title={tx.transferedTo}>
                                                    <AddressChip
                                                        label={shortenAddress(tx.transferedTo)}
                                                        onClick={() => copyToClipboard(tx.transferedTo)}
                                                        onDelete={() => copyToClipboard(tx.transferedTo)}
                                                        deleteIcon={<ContentCopyIcon fontSize="small" />}
                                                    />
                                                </Tooltip>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <HashLink href={getExplorerUrl(tx.transactionHash)} target="_blank" rel="noopener">
                                                View on Explorer <OpenInNewIcon fontSize="small" sx={{ ml: 0.5 }} />
                                            </HashLink>

                                            {ownershipDurations[tx.timestamp] && (
                                                <OwnershipPeriodChip
                                                    isCurrent={isCurrentOwner}
                                                    label={`${isCurrentOwner ? 'Owned for ' : 'Held for '} ${ownershipDurations[tx.timestamp]}`}
                                                    size="small" theme={undefined}                                                />
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            </TransactionCard>
                        </Fade>
                    );
                })}
            </DialogContent>
        </StyledDialog>
    );
};

export default NFTOwnershipHistoryModal;