import { createBrowserRouter } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import GenericLayout from "../Layout/GenericLayout";
import UserLayout from "../Layout/UserLayout";
import KanbanDashboard from "../Pages/Dashboard/Dashboard";
import BarcodeScan from "../Pages/BarcodeScan/BarcodeScan";
import AssignCategory from "../Pages/AssignCategory/AssignCategory";

const router = createBrowserRouter([
    {
        path: "/",
        element: <ScrollToTop><GenericLayout /></ScrollToTop>,
        children: [
            {
                path: "/",
                element: <UserLayout />,
                children: [
                    {
                        path: '/',
                        element: <KanbanDashboard/>
                    },
                    {
                        path: '/barcode_scan',
                        element: <BarcodeScan/>
                    },
                    {
                        path: '/asign_category',
                        element: <AssignCategory/>
                    },

                ]
            },
           
            // {
            //     path: "*",
            //     element: <ErrorPage />
            // }
        ]
    }
]);

export default router;