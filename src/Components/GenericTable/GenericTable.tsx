import { TableContainer, Table, TableHead, TableRow, TableCell, Typography, TableBody, TableFooter, TablePagination } from "@mui/material";
import React, { type JSX } from "react";


type Props = {
  columns: Record<string, { width: number }>;
  data: JSX.Element[];
  total: number;
  rowsPerPage: number;
  page: number;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
  onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function GenericTable(props: Props) {
  const { columns, data, total, rowsPerPage, page, onChangePage, onChangeRowsPerPage } = props

  return (
    <TableContainer className="px-4" >
      <Table className="border-solid border-slate-300 border-2">
        <TableHead>
          <TableRow>
            {
              Object.entries(columns).map(([column, col_vals], index) => (
                <TableCell key={index} sx={{ width: col_vals.width }}>
                  <Typography className="font-semibold text-center">
                    {column}
                  </Typography>
                </TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody >{ data }</TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[1, 2, 3, 5, 10]}
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

export default GenericTable;