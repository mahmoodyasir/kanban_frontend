import { ExitToApp, Favorite, Dashboard, QrCode2Outlined } from "@mui/icons-material"
import CategoryIcon from '@mui/icons-material/Category';
import { Breadcrumbs, Button, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { convertToTitle } from "../Utils/utils";
// import { useAppDispatch } from "../Redux/app/hooks";
// import { setLogOut } from "../Redux/features/userSlice";


const UserLayout = () => {

    // const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, link: '/' },
        { text: 'Barcode Scan', icon: <QrCode2Outlined />, link: '/barcode_scan' },
        { text: 'Assign Product Category', icon: <CategoryIcon />, link: '/asign_category' },
    ];

    const location = useLocation();

    const pathnames = location.pathname.split("/").filter((x) => x);


    const handleLogOut = () => {
        localStorage.setItem('access-token', '');
        localStorage.setItem('refresh-token', '');
        // dispatch(setLogOut())
        navigate('/login')
    }


    const sidebarContent = (
        <List>
            {menuItems.map((item, index) => (
                <Button onClick={() => navigate(item?.link)} key={index} className="w-full text-black">
                    <ListItem>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                </Button>
            ))}
        </List>
    );

    return (
        <div className=" bg-gray-100">

            {/* <section>
                <IconButton className="md:hidden" onClick={() => setDrawerOpen(true)} aria-label="menu">
                    <MenuIcon />
                </IconButton>
            </section> */}

            <section className="flex min-h-screen">
                {/* Sidebar Drawer for Mobile */}
                {/* <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    className="md:hidden"
                >
                    {sidebarContent}
                </Drawer> */}

                {/* Sidebar for Desktop */}
                <aside className="hidden md:block w-64 bg-white shadow-lg">
                    {sidebarContent}
                    <Button className="w-full text-black" onClick={() => handleLogOut()}>
                        <ListItem className=" text-red-700">
                            <ListItemIcon><ExitToApp className=" text-red-700" /></ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </Button>
                </aside>

                {/* Content Area */}
                <div className="flex-1 p-4 sm:p-6">
                    {/* Breadcrumbs Navigation */}
                    <Breadcrumbs aria-label="breadcrumb" className="mb-2 sm:mb-4">
                        <Link to="/" className="text-gray-500 hover:text-gray-700">Dashboard</Link>

                        {pathnames.map((value, index) => {
                            const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                            const isLast = index === pathnames.length - 1;
                            return isLast ? (
                                <Typography key={to} color="primary">
                                    {convertToTitle(value)}
                                </Typography>
                            ) : (
                                <Link key={to} to={to} className="text-gray-500 hover:text-gray-700">
                                    {convertToTitle(value)}
                                </Link>
                            );
                        })}
                    </Breadcrumbs>

                    {/* Main Content (Outlet) */}
                    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 h-fit overflow-y-auto">
                        <Outlet />
                    </div>
                </div>
            </section>

        </div>
    )
}

export default UserLayout
