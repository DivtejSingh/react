import * as React from 'react';
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
  border: '2px solid #000',
  boxShadow: 24,
  p: 3,
};

const Confirmation = ({ confirmation, setConfirmation }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Modal
        open={confirmation}
        onClose={() => setConfirmation(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Confirm Your Order
          </Typography>
          <div className='flex items-center justify-between pt-5'>
            <button type="button" className="main_btn mt-3 bg-blue-900 text-white text-xs font-semibold px-12 py-3 rounded-lg" >
              Cancel
            </button>
            <button type="button" className="main_btn mt-3 bg-blue-900 text-white text-xs font-semibold px-12 py-3 rounded-lg" >
              OK
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Confirmation