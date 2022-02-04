import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid white',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
};

const DeleteModal = (props) => {
    const { openModal } = props
    const [modalOpen, setModalOpen] = useState(openModal);
    useEffect(() => {
        setModalOpen(openModal);
    }, [openModal])
    return (
        <div>
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Do you want to delete the entry ?
                    </Typography>
                    <Box sx={{alignSelf: 'flex-end', marginTop: '10px'}}>
                        <Button
                            sx={{ marginRight: '10px' }}
                            type="button"
                            variant='text'
                            color="error"
                            onClick={() => props.onCancel()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant='text'
                            color="primary"
                            onClick={() => props.onDelete()}
                        >
                            Confirm
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default DeleteModal