import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./route/Routing";
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
