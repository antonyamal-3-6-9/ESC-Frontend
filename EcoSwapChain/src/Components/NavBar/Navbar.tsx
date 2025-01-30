import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Logo from "../logos/svg/logo-color.svg"
import { Link } from 'react-router';

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#2E5077', boxShadow: "3" }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
          {/* Logo */}
          <img src={Logo} height={"70px"} width={"70px"}/>
          {/* EcoSwapChain name */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#F6F4F0' }}>
            SwapChain
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', marginLeft: 'auto' }}>
          <Link to={"trader/login"}>
          <Button color="inherit"  sx={{ color: '#F6F4F0' }}>
            Login
          </Button>
          </Link>
          <Button color="inherit"  sx={{ color: '#F6F4F0' }}>
            Features
          </Button>
          <Button color="inherit"  sx={{ color: '#F6F4F0' }}>
            Contact
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
