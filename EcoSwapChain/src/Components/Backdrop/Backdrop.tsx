import React from 'react';
import { Backdrop as MuiBackdrop, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface BackdropProps {
  onClick?: () => void; // Optional click handler
  children?: React.ReactNode; // Optional content to display in the backdrop
}

const BackDrop: React.FC<BackdropProps> = ({ onClick, children }) => {

  const loading = useSelector((state: RootState) => state.alertBackdrop.loading); // Get the loading state from the store

  return (
    <MuiBackdrop
      open={loading}
      onClick={onClick}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure it appears above other elements
        color: '#fff', // Text and icon color
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
      }}
    >
      {children || <CircularProgress color="inherit" />} {/* Default to a loading spinner */}
    </MuiBackdrop>
  );
};

export default BackDrop;