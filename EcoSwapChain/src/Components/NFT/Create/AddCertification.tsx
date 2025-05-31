import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";

// Define types

interface CertificationError {
    name?: string;
    description?: string;
    certificationNumber?: string;
}

interface Certification {
    name: string;
    description: string;
    certificationNumber: string;
}


interface CertificationModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (certification: Certification) => void;
}

// Certification Modal Component
const CertificationModal: React.FC<CertificationModalProps> = ({ open, onClose, onSave }) => {
    const [certification, setCertification] = useState<Certification>({
        name: "",
        description: "",
        certificationNumber: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCertification((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const [errors, setErrors] = useState<Partial<CertificationError>>({});

    const validateForm = () => {
        const newErrors: Partial<CertificationError> = {};
        if (!certification.name) {
            newErrors.name = "Name is required";
        }
        if (!certification.description) {
            newErrors.description = "Description is required";
        }
        if (!certification.certificationNumber) {
            newErrors.certificationNumber = "Certification Number is required";
        }

        setErrors(newErrors);

        // return Object.keys(newErrors).length === 0;
        return true
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave(certification);
            setCertification({ name: "", description: "", certificationNumber: "" });
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 4, bgcolor: "white", width: 400, mx: "auto", mt: "20vh", borderRadius: 2 }}>
                <h2>Add Certification</h2>
                <TextField fullWidth name="name" label="Name" onChange={handleChange} value={certification.name} margin="normal"error={!!errors.name} helperText={errors.name} />   
                <TextField fullWidth name="description" label="Description" onChange={handleChange} value={certification.description} margin="normal" error={!!errors.description} helperText={errors.description} />
                <TextField fullWidth name="certificationNumber" label="Certification Number" onChange={handleChange} value={certification.certificationNumber} margin="normal"  error={!!errors.certificationNumber} helperText={errors.certificationNumber} />
                <Box mt={2}>
                    <Button variant="contained" onClick={handleSubmit}>Save</Button>
                    <Button onClick={onClose} sx={{ ml: 1 }}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
};


export default CertificationModal;