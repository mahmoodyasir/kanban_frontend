import { useEffect, useRef, useState } from 'react';
import {
    BrowserMultiFormatReader,
    type IScannerControls,
} from '@zxing/browser';
import { Button, TableCell, TableRow, Typography } from '@mui/material';
import PublishIcon from '@mui/icons-material/Publish';
import type { snackBarDataType, TProduct } from '../../Utils/utils';
import { getAllProduct, insertProduct } from '../../ApiGateways/product';
import GenericTable from '../../Components/GenericTable/GenericTable';
import GlobalSnackbar from '../../Components/GlobalSnackbar/GlobalSnackbar';
import { useLocation } from 'react-router-dom';

const BarcodeScan = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const location = useLocation();
    const [barcode, setBarcode] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [scanning, setScanning] = useState<boolean>(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [allProduct, setAllProduct] = useState<TProduct[]>([]);
    const [totalProduct, setTotalProduct] = useState(0);
    const [snackbarState, setSnackbarState] = useState<snackBarDataType>({
        isActive: false,
        verticalPosition: "top",
        horizontalPosition: "center",
        message: "",
        alertType: "success",
    });
    const isScanned = useRef(false);

    const columns = {
        SN: { width: 50 },
        Material: { width: 100 },
        Barcode: { width: 100 },
        Category: { width: 100 },
        Description: { width: 150 },
    };

    const codeReader = useRef(
        new BrowserMultiFormatReader(undefined, {
            delayBetweenScanAttempts: 1000,
        })
    );
    const controls = useRef<IScannerControls | null>(null);

    useEffect(() => {
        let cancelled = false;

        const startScanner = async () => {
            try {
                if (barcode === '' && !cancelled) {
                    const devices = await BrowserMultiFormatReader.listVideoInputDevices();
                    if (devices.length === 0) {
                        setError('No camera devices found');
                        return;
                    }

                    controls.current = await codeReader.current.decodeFromVideoDevice(
                        devices[0].deviceId,
                        videoRef.current!,
                        (result, err) => {
                            if (cancelled) return;

                            if (result && !isScanned.current) {
                                const text = result.getText();
                                if (/^\d{8,14}$/.test(text)) {
                                    isScanned.current = true;
                                    setBarcode(text);
                                    setScanning(false);
                                    setError('');
                                    controls.current?.stop();
                                }
                            }

                            if (err && err.name !== 'NotFoundException') {
                                setError('Error scanning barcode');
                            }
                        }
                    );
                }
            } catch (err) {
                console.error(err);
                setError('Failed to start scanner');
            }
        };

        if (scanning) {
            isScanned.current = false;
            startScanner();
        }

        return () => {
            cancelled = true;
            controls.current?.stop();
            const stream = videoRef.current?.srcObject as MediaStream;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                videoRef.current!.srcObject = null;
            }
        };
    }, [scanning]);



    useEffect(() => {
        return () => {
            try {
                console.log("Cleaning up scanner...");

                // Stop ZXing scanner
                controls.current?.stop();

                // Stop the media tracks (camera)
                const stream = videoRef.current?.srcObject as MediaStream;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    videoRef.current!.srcObject = null;
                }

            } catch (err) {
                console.warn('Scanner cleanup failed on route change', err);
            }
        };
    }, [location.pathname]);

    useEffect(() => {
        getAllProduct(
            page + 1,
            rowsPerPage,
            "",
            "",
            false,
            (data) => {
                setAllProduct(data?.data);
                setTotalProduct(data?.meta?.total);
            },
            (res) => console.log(res)
        )
    }, []);


    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
        newPage: number
    ) => {
        getAllProduct(
            newPage + 1,
            rowsPerPage,
            "",
            "",
            false,
            (data) => {
                console.log(data);
                setAllProduct(data?.data);
                setTotalProduct(data?.meta?.total);

            },
            (res) => console.log(res)
        );
        setPage(newPage);

    };


    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        getAllProduct(
            1,
            +event.target.value,
            "",
            "",
            false,
            (data) => {
                setAllProduct(data?.data);
                setTotalProduct(data?.meta?.total);

            },
            (res) => console.log(res)
        );
        setRowsPerPage(+event.target.value);
    };


    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async () => {
            try {
                if (typeof reader.result === 'string') {
                    const result = await codeReader.current.decodeFromImageUrl(reader.result);
                    const text = result.getText();
                    if (/^\d{8,14}$/.test(text)) {
                        isScanned.current = true;
                        setBarcode(text);
                        setScanning(false);
                        setError('');
                        controls.current?.stop();
                    } else {
                        setError('Invalid barcode detected');
                    }
                }
            } catch (err) {
                console.error(err);
                setError('Failed to decode barcode from image');
            }
        };

        reader.readAsDataURL(file);
    };

    const createTableRows = (products: TProduct[]) =>
        products?.map((product: TProduct, index: number) => (
            <TableRow key={index}>
                <TableCell sx={{ textAlign: "center" }}>{index + 1}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{product?.material}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{product?.barcode}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{product?.category}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{product?.description}</TableCell>
            </TableRow>
        ));


    const productInsert = () => {

        const body = {
            barcode: barcode
        }
        insertProduct(body,
            (data) => {
                if (data?.success === true) {
                    setAllProduct([data?.data, ...allProduct]);
                    setSnackbarState({
                        isActive: true,
                        verticalPosition: "top",
                        horizontalPosition: "center",
                        message: "Product Inserted Succesfully !",
                        alertType: "success"
                    });
                }
            },
            (res) => {
                setSnackbarState({
                    isActive: true,
                    verticalPosition: "top",
                    horizontalPosition: "center",
                    message: String(res?.message),
                    alertType: "error"
                });
            }
        )
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-4 overflow-x-auto">

            {snackbarState?.isActive && (
                <GlobalSnackbar
                    verticalPosition={snackbarState?.verticalPosition}
                    horizontalPosition={snackbarState?.horizontalPosition}
                    message={snackbarState?.message}
                    alertType={snackbarState?.alertType}
                    onfinish={() => {
                        setSnackbarState({ ...snackbarState, isActive: false })
                    }}
                />
            )}
            {/* Scanner Card */}
            <div className="max-w-2xl mx-auto p-4 border rounded-lg shadow bg-white">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">📷 Barcode Scanner</h2>

                <Typography className="text-center mb-4 text-sm sm:text-base">
                    <span className="font-semibold">Note:</span> Please, put the camera very close to the barcode. Surroundings should not be visible.
                </Typography>

                {scanning ? (
                    <div className="w-full aspect-video border rounded overflow-hidden mb-4">
                        <video ref={videoRef} className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-center text-sm sm:text-base">
                        ✅ Barcode Scanned: <strong>{barcode}</strong>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center gap-2 mb-4">
                        <div className="text-red-500 text-sm text-center">{error}</div>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<PublishIcon />}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Upload Image Instead
                        </Button>
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />
                    </div>
                )}

                {!scanning && (
                    <button
                        onClick={() => {
                            isScanned.current = false;
                            setBarcode('');
                            setError('');
                            setScanning(true);
                        }}
                        className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
                    >
                        Scan Another
                    </button>
                )}
            </div>

            {/* Insert Product Button */}
            {barcode && (
                <div className="mt-4 flex justify-center">
                    <Button onClick={() => productInsert()} variant="contained" color="success">Insert Product</Button>
                </div>
            )}

            {/* Product Table */}
            <div className="mt-6 overflow-x-auto">
                <GenericTable
                    columns={columns}
                    data={createTableRows(allProduct)}
                    total={totalProduct}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </div>
        </div>

    );
};

export default BarcodeScan;
