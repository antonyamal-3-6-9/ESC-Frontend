import React from 'react';
import { Backdrop as MuiBackdrop, keyframes, styled } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Theme } from '@mui/material/styles';

interface BackdropProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.5; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Add spin animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled components
const SpinnerContainer = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const Spinner = styled('div')(({ theme }: { theme: Theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  position: 'relative',
  animation: `${pulse} 2s ease-in-out infinite, ${spin} 2s linear infinite`, // Added spin here
  
  '&:before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    border: `4px solid ${theme.palette.accent.main}`,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    animation: `${float} 1.5s linear infinite`,
  },
  
  '&:after': {
    content: '""',
    position: 'absolute',
    inset: 8,
    borderRadius: '50%',
    border: `4px solid ${theme.palette.primary.main}`,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    animation: `${float} 1.5s linear infinite reverse`,
  },
}));


const LoadingText = styled('div')(({ theme }: { theme: Theme }) => ({
  color: theme.palette.primary.contrastText,
  fontSize: '1.2rem',
  fontWeight: 500,
  letterSpacing: 1.1,
  textTransform: 'uppercase',
  opacity: 0.8,
  animation: `${pulse} 2s ease-in-out infinite`,
}));

const BackDrop: React.FC<BackdropProps> = ({ onClick, children }) => {
  const loading = useSelector((state: RootState) => state.alertBackdrop.loading);

  return (
    <MuiBackdrop
      open={loading}
      onClick={onClick}
      sx={(theme) => ({
        zIndex: theme.zIndex.drawer + 1,
        backdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      })}
    >
      {children || (
        <SpinnerContainer>
          <Spinner />
          <LoadingText>
            <span style={{ color: '#79D7BE' }}></span>
          </LoadingText>
        </SpinnerContainer>
      )}
    </MuiBackdrop>
  );
};

export default BackDrop;