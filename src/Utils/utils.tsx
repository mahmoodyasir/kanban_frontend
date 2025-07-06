import { type AlertColor } from "@mui/material";

export const convertToTitle = (str: string) => {
    const result = str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return result;
}

export type TProduct = {
    _id: string;
    material: number;
    barcode: string;
    description: string;
    category: string;
    createdAt: string | number | Date;
}

export type snackBarDataType = {
  isActive: boolean;
  verticalPosition: any;
  horizontalPosition: any;
  message: string;
  alertType: AlertColor;
}
