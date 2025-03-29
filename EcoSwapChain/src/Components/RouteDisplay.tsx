import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Home from '@mui/icons-material/Home';
import NavigateNext from '@mui/icons-material/NavigateNext';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';

const RouteDisplay = styled(Box)(({ theme }) => ({
    position: 'sticky',
    top: theme.spacing(11),
    zIndex: 10,
    backdropFilter: 'blur(10px)',
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(3),
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

export default function RouteDisplayC() {
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(segment => segment);

    const theme = useTheme();

    return (
        <RouteDisplay>
            <Breadcrumbs
                separator={<NavigateNext fontSize="small" />}
                aria-label="breadcrumb"
            >
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.palette.text.secondary,
                    textDecoration: 'none'
                }}>
                    <Home sx={{ mr: 0.5 }} fontSize="small" />
                    Home
                </Link>
                {pathSegments.map((segment, index) => {
                    const to = `/${pathSegments.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathSegments.length - 1;

                    return isLast ? (
                        <Typography
                            key={to}
                            color="primary"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: 600
                            }}
                        >
                            {segment.charAt(0).toUpperCase() + segment.slice(1)}
                        </Typography>
                    ) : (
                        <Button
                            key={to}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: theme.palette.text.secondary,
                                textDecoration: 'none'
                            }}
                        >
                            {segment.charAt(0).toUpperCase() + segment.slice(1)}
                        </Button>
                    );
                })}
            </Breadcrumbs>
        </RouteDisplay>
    );
}