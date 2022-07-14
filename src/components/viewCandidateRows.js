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
                <TableCell>{assignedTo}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.date_of_birth.substr(0, 16)}</TableCell>
                <TableCell>{row.date_of_Joining.substr(0, 16)}</TableCell>
                <TableCell>{row.pan_no}</TableCell>                
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
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, }} colSpan={10}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
                            Salary Details
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Basic Salary</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>DA</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>HRA</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Bonus</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Conveyance</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>others</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Professional Tax</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Employee PF</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Employer PF</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Advance TDS/TAX</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Other Tax</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Payment Terms</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={row._id}>
                                        <TableCell component="th" scope="row" style={{textAlign:"center" }}>{'₹'+row.Basic.substr(0, 16)}</TableCell>
                                        <TableCell style={{textAlign:"center" }}>{'₹'+row.D_allow}</TableCell>
                                        <TableCell style={{textAlign:"center" }}>{'₹'+row.HR_allow}</TableCell>
                                        <TableCell style={{textAlign:"center" }}>{'₹'+row.Bonus}</TableCell>
                                        <TableCell style={{textAlign:"center" }}>{'₹'+row.conveyance}</TableCell>
                                        <TableCell style={{textAlign:"center" }}>{'₹'+row.others}</TableCell>
                                        <TableCell style={{textAlign:"center" }}>{'₹'+row.prof_tax}</TableCell>
                                        <TableCell style={{textAlign:"center" }}>{'₹'+row.p_f_employee}</TableCell>
                                        <TableCell style={{textAlign:"center" }}>{'₹'+row.p_f_employer}</TableCell>
                                        <TableCell style={{textAlign:"center" }}>{'₹'+row.td_S}</TableCell>
                                        <TableCell style={{textAlign:"center" }}>{'₹'+row.other_tax}</TableCell>
                                        <TableCell style={{textAlign:"center" }}>{row.payment_terms}</TableCell>
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