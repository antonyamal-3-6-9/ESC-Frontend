import React from "react";
import NFTCreationForm from "./NFTCreationForm";
import { Container } from "@mui/material"


const CreateNFT: React.FC =  () => {
    return (
        <>
            <Container maxWidth="lg">
                <NFTCreationForm />
            </Container>
        </>
    )
}

export default CreateNFT