import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Row } from 'react-bootstrap';
import history from '../history';


const Rows = (props) => {
    const { row, assignedTo } = props
    const { deleteData } = props
    const [open, setOpen] = useState(false);

    const onDeleteData = () => {
        deleteData(row._id)
    }

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell>{row.date_of_Joining.substr(0, 16)}</TableCell>
                <TableCell>
                    <IconButton
                        aria-label="edit-candidate"
                        size='small'
                        onClick={() => history.push(`/candidate/${row._id}`)}
                    >
                        <EditIcon />
                    </IconButton>
                </TableCell>
                <TableCell>
                    <IconButton
                        aria-label="delete-candidate"
                        size='small'
                        onClick={onDeleteData}
                    >
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
                                Details
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Date of Birth</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Payment Terms</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Assigned To</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={row._id}>
                                        <TableCell component="th" scope="row">
                                            {row.email}
                                        </TableCell>
                                        <TableCell>{row.date_of_birth.substr(0, 16)}</TableCell>
                                        <TableCell>{row.payment_terms}</TableCell>
                                        <TableCell>{assignedTo}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        client_name: PropTypes.string.isRequired,
        date_of_contract: PropTypes.string.isRequired,
        billing_address: PropTypes.string.isRequired,
        shipping_address: PropTypes.string.isRequired,
        payment_terms: PropTypes.string.isRequired,
        terms: PropTypes.string.isRequired,
        notes: PropTypes.string.isRequired,
    })
}

export default Rows