import React, { useState } from 'react';
import {
    Typography,
    TextField,
    IconButton,
    Stack,
    TypographyProps
} from '@mui/material';
import {
    Edit as EditIcon,
    Check as CheckIcon,
    Close as CloseIcon
} from '@mui/icons-material';

interface EditableFieldProps extends TypographyProps {
    value: string;
    onSave: (value: string) => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
    value,
    onSave,
    variant,
    ...typographyProps
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);

    const handleSave = () => {
        onSave(editValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(value);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    variant="standard"
                    size="small"
                    autoFocus
                    fullWidth
                />
                <IconButton size="small" onClick={handleSave}>
                    <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleCancel}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Stack>
        );
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant={variant} {...typographyProps}>
                {value}
            </Typography>
            <IconButton
                size="small"
                onClick={() => setIsEditing(true)}
                sx={{ opacity: 0, transition: '0.2s', '&:hover': { opacity: 1 } }}
            >
                <EditIcon fontSize="small" />
            </IconButton>
        </Stack>
    );
};

export default EditableField;