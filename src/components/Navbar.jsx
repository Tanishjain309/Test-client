import React, {useState} from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import LogoutIcon from '@mui/icons-material/Logout';
import {useNavigate} from "react-router-dom";
import useUserStore from '../store';
import instance from "../utils/axios";
import {toast} from "react-hot-toast";
const Navbar = () => {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const setLoggedIn = useUserStore((state) => state.setLoggedIn);
    const nav = useNavigate();
    const handleLoginClick = () => {
        nav("/login");
    }
    const [dropdown, setDropdown] = useState(null);
    const open = Boolean(dropdown);

    const handleMenuClick = (event) => {
        setDropdown(event.currentTarget);
    };

    const handleClose = () => {
        setDropdown(null);
    };

    const handleLogout = async () => {
        try {
            const response = await instance.post("/api/auth/logout");
            if(response.status === 201){
                toast.success(response.data.message);
                setLoggedIn(false);
                setUser(null);
                nav("/login")
            }
        } catch (err) {
            toast.error(err.message);
        }
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
            <Box sx={{ flexGrow: 1, display: 'flex' }}>
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{
                        mr: 2, 
                        fontSize: '16px', 
                        fontWeight: 400, 
                        textDecoration: 'underline',
                        '&:hover': {
                            color: 'lightgray',
                            textDecoration: 'none',
                            cursor: 'pointer',
                        }
                    }}>
                    My Projects
                </Typography>
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{
                        fontSize: '16px', 
                        fontWeight: 400, 
                        textDecoration: 'underline',
                        '&:hover': {
                            color: 'lightgray',
                            textDecoration: 'none',
                            cursor: 'pointer',
                        }
                    }}>
                        My Collaborations
                </Typography>
                </Box>
                {user ? (
                        <>
                            <IconButton onClick={handleMenuClick} sx={{ p: 0 }}>
                                <Avatar alt={user.name} />
                            </IconButton>
                            <Menu
                                dropdown={dropdown}
                                open={open}
                                onClose={handleClose}
                                sx={{ mt: '45px' }}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <MenuItem onClick={handleClose}>
                                    <Typography textAlign="center">{user.name}</Typography>
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleLogout}>
                                    <LogoutIcon sx={{ mr: 1 }} />
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Button onClick={handleLoginClick} color="inherit">Login</Button>
                    )}
            </Toolbar>
        </AppBar>
        </Box>
    )
}

export default Navbar
