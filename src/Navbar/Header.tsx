import { AppBar, Avatar, Box, Button, Container, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../static/images/board.png'
import { Dashboard, QrCode2Outlined } from "@mui/icons-material";
import CategoryIcon from '@mui/icons-material/Category';
import { useNavigate } from "react-router-dom";


const pages = [''];
const settings = ['Logout'];


const Header = () => {

    const [isMenu, setIsMenu] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();


    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, link: '/' },
        { text: 'Barcode Scan', icon: <QrCode2Outlined />, link: '/barcode_scan' },
        { text: 'Assign Product Category', icon: <CategoryIcon />, link: '/asign_category' },
    ];


    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    return (
        <AppBar position="static" className=" bg-amber-200 text-violet-500">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography sx={{ display: { xs: 'none', md: 'flex' }, }}>
                        <img className="w-10 h-10 mr-3" src={logo} alt="kanban logo" />
                    </Typography>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Kanban   Board
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={() => setIsMenu(true)}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>

                        <Drawer anchor="left" open={isMenu} onClose={() => setIsMenu(false)}>
                            <section style={{ height: "3.5rem", backgroundColor: "rgb(255 251 235)" }}>
                                {/* <Typography style={{ color: "black", padding: "15px" }}>
                                    {" "}
                                    Hello, {user.email}{" "}
                                </Typography> */}
                            </section>
                            <List>

                                {menuItems?.map((item, i) => (
                                    <ListItemButton
                                        onClick={() => [navigate(item?.link), setIsMenu(false)]}
                                        key={i}
                                    >
                                        {/* HERE */}
                                        <ListItemIcon>{item?.icon}</ListItemIcon>
                                        <ListItemText>{item?.text}</ListItemText>
                                    </ListItemButton>
                                ))}
                            </List>
                        </Drawer>
                        {/* <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography  sx={{ textAlign: 'center' }}>{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu> */}
                    </Box>

                    <Typography sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
                        <img className="w-10 h-10 mr-3" src={logo} alt="kanban logo" />
                    </Typography>
                    <Typography
                        className="text-xl md:text-2xl "
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Kanban   Board 2
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                className=" text-blue-500 text-base"
                                key={page}
                                onClick={() => setIsMenu(false)}
                                sx={{ my: 2, display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Header
