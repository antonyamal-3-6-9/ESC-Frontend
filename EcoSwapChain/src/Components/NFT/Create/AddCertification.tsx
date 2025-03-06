import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";

// Define types
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

    const handleSubmit = () => {
        if (certification.name && certification.description && certification.certificationNumber) {
            onSave(certification);
            setCertification({ name: "", description: "", certificationNumber: "" }); // Reset fields
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 4, bgcolor: "white", width: 400, mx: "auto", mt: "20vh", borderRadius: 2 }}>
                <h2>Add Certification</h2>
                <TextField fullWidth name="name" label="Name" onChange={handleChange} value={certification.name} margin="normal" />
                <TextField fullWidth name="description" label="Description" onChange={handleChange} value={certification.description} margin="normal" />
                <TextField fullWidth name="certificationNumber" label="Certification Number" onChange={handleChange} value={certification.certificationNumber} margin="normal" />
                <Box mt={2}>
                    <Button variant="contained" onClick={handleSubmit}>Save</Button>
                    <Button onClick={onClose} sx={{ ml: 1 }}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
};


export default CertificationModal;