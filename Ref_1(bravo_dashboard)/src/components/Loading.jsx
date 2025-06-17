import CircularProgress from '@mui/material/CircularProgress';


const Loading = () => {
  return (
    <div className="fixed w-full h-full bg-[#00000067] left-0 top-0 flex items-center justify-center z-50" style={{ zIndex: 9999 }}>
      <CircularProgress sx={{ color: "#2a2f3e" }} className='z-50'/>
    </div>
  );
};

export default Loading;
