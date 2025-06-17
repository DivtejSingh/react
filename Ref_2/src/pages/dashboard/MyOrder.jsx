import React, { useEffect, useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useMyOrderQuery } from '../../store/service/MyOrdersService';
import { getLocalStorage } from '../../utils/LocalStorageUtills';
import { useDispatch, useSelector } from 'react-redux';
import { setMyOrder } from '../../store/slice/CartSlice';
import Pagination from '../../components/Pagination';

const MyOrder = () => {
  const UserUniqId = getLocalStorage('user').unique_id;
  const { data: myOrder } = useMyOrderQuery(UserUniqId);
  const dispatch = useDispatch();
  const myOrderProduct = useSelector((state) => state?.ecom?.myOrder?.data)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (myOrder) {
      dispatch(setMyOrder(myOrder));
    }
  }, [myOrder, dispatch]);

  const totalPages = Math.ceil(myOrderProduct?.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = myOrderProduct?.slice(indexOfFirstItem, indexOfLastItem);

  const onPageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  return (
    <main className='mb-20'>
      <div className="container">
        <h1 className="py-5">My Order</h1>
        {currentItems?.map((item, index) => (
          <div key={index} className="bg-white mb-3 p-6 flex items-center justify-between border-[#e0e0e0] border order_lists">
            <div className="flex gap-5 Orders">
              <ShoppingCartIcon sx={{ fontSize: '40px' }} />
              <div className='order_details'>
                <h2>Order Id: {item.order_id}</h2>
                <p className="pt-1 sku_text">SKU: {item.sku}</p>
                <h2>
                  {item.currency} {item.totalAmount}
                </h2>
              </div>
            </div>
            <div className="text-center product_order">
              <h2 className="font-semibold">Products This Order</h2>
              <h2 className="pt-2">{item.totalProducts}</h2>
            </div>
            <div className="text-center status_processing">
              <h2 className="font-semibold">Status</h2>
              <h2 className="font-semibold">{item.status}</h2>
              <div className="text-center mt-3 gap-6 flex items-center justify-center eye_icon">
                <Link to={`${item.order_id}`}>
                  <RemoveRedEyeIcon sx={{ color: '#646ea6' }} />
                </Link>
              </div>
            </div>
          </div>
        ))}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          handleItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </main>
  );
};

export default MyOrder;
