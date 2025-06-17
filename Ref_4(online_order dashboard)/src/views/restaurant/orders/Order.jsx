import React, { useState, useEffect, useContext } from "react";
import { CButton, CPagination, CPaginationItem, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from "@coreui/react";
import { OnlineContext } from "../../../Provider/OrderProvider";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./orders.css";

export default function Order() {
  const { orders } = useContext(OnlineContext);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Display 10 orders per page
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("today");
  const [placeIds, setPlaceIds] = useState({});
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const fetchPlaceIdForOrder = async (placename) => {
      const db = getFirestore();
      const placesCollection = collection(db, "Places");
      const q = query(placesCollection, where("placename", "==", placename));
      const querySnapshot = await getDocs(q);
      const placeIds = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      return placeIds.length > 0 ? placeIds[0].id : "-";
    };

    const fetchPlaceIds = async () => {
      const placeIdMap = await Promise.all(
        orders.map(async (order) => {
          const placeId = await fetchPlaceIdForOrder(order.location?.location?.placename || "");
          return { id: order.id, placeId };
        })
      );
      setPlaceIds(
        placeIdMap.reduce((acc, curr) => {
          acc[curr.id] = curr.placeId;
          return acc;
        }, {})
      );
    };

    if (orders.length > 0) {
      fetchPlaceIds();
    }
  }, [orders]);

  useEffect(() => {
    const filterOrders = () => {
      const now = new Date();
      const filtered = orders.filter((order) => {
        const orderDate = new Date(order.timestamp.seconds * 1000 + order.timestamp.nanoseconds / 1000000);
        switch (activeFilter) {
          case "today":
            return orderDate.toDateString() === now.toDateString();
          case "week":
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return orderDate >= startOfWeek && orderDate <= endOfWeek;
          case "month":
            return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
          default:
            return true; // Show all orders
        }
      });
      setFilteredOrders(filtered);
    };

    filterOrders();
  }, [orders, activeFilter]);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const exportToPDF = (order) => {
    if (!order) return;

    const doc = new jsPDF();
    const titleText = "Online Order";
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const titleX = 14;
    const paddingY = 12;
    const titleY = paddingY;
    const textHeight = 20;

    // Set the background color for the title
    doc.setFillColor("#212631");
    doc.rect(0, titleY - paddingY, pageWidth, textHeight, "F");

    // Set the title with white color
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text(titleText, titleX, titleY);

    // Reset text color to black for the rest of the content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    // Order ID on the left and Place Name / Username on the right
    doc.text(`Order ID: ${order.id}`, 14, 35);
    doc.text(`Place Name / Username: ${order.location.location ? order.location.location?.placename || "-" : order.location.Name}`, pageWidth - 100, 35);

    // Timestamp on a new line
    doc.text(`Timestamp: ${new Date(order.timestamp.seconds * 1000 + order.timestamp.nanoseconds / 1000000).toLocaleString()}`, 14, 42);

    // Set the start position for the table
    let y = 52;

    const tableColumn = ["Category", "Name"];
    const maxTableHeight = pageHeight - y - 10; // Max height for the table content

    // Font size adjustment based on content
    const adjustFontSize = () => {
      // Calculate max rows that can fit on the page
      const rowsPerPage = Math.floor(maxTableHeight / 12); // 12 is approximate height per row
      return Math.min(12, 7 - Math.floor(order.summary.length / rowsPerPage)); // Min font size to fit content
    };

    doc.setFontSize(adjustFontSize());

    order.summary.forEach((item, index) => {
      if (y + 20 > pageHeight) {
        // Check if it fits on the current page
        doc.addPage();
        y = 10; // Reset y coordinate for new page
      }

      doc.setFontSize(11);
      doc.text(item.mealName, 14, y);
      y += 2;

      const tableRows = item.data.map((mealDetail) => [mealDetail.enCategory, mealDetail.enName]);

      doc.autoTable({
        startY: y,
        head: [tableColumn],
        body: tableRows,
        theme: "grid",
        headStyles: {
          fillColor: "#212631",
          textColor: [255, 255, 255],
          fontSize: doc.internal.getFontSize(), // Dynamic font size
          fontStyle: "bold",
        },
        styles: {
          fontSize: doc.internal.getFontSize(), // Dynamic font size
        },
        margin: { top: y, bottom: 10 },
      });

      y = doc.previousAutoTable.finalY + 10; // Adjust y for next content
    });

    doc.save("online-order.pdf");
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="table_layout mb-3">
      <h1 className="text-center">Orders List</h1>
      <div className="filters">
        <CButton className={`filter-button ${activeFilter === "today" ? "active" : ""}`} color={activeFilter === "today" ? "info" : "secondary"} onClick={() => setActiveFilter("today")}>
          Today
        </CButton>
        <CButton className={`filter-button ${activeFilter === "week" ? "active" : ""}`} color={activeFilter === "week" ? "info" : "secondary"} onClick={() => setActiveFilter("week")}>
          This Week
        </CButton>
        <CButton className={`filter-button ${activeFilter === "month" ? "active" : ""}`} color={activeFilter === "month" ? "info" : "secondary"} onClick={() => setActiveFilter("month")}>
          This Month
        </CButton>
      </div>
      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Place ID</th>
                  <th>Timestamp</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{placeIds[order.id] !== "-" ? placeIds[order.id] : order.location?.Name || "-"}</td>
                    <td>{new Date(order.timestamp.seconds * 1000 + order.timestamp.nanoseconds / 1000000).toLocaleString()}</td>
                    <td>
                      <CButton color="primary" onClick={() => handleOpenModal(order)}>
                        View Details
                      </CButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="fixed_pagination">
            <CPagination aria-label="Page navigation example" align="end">
              <CPaginationItem aria-label="Previous" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                <span aria-hidden="true">&laquo;</span>
              </CPaginationItem>
              {Array.from({ length: totalPages }, (_, index) => (
                <CPaginationItem key={index} onClick={() => handlePageChange(index + 1)} active={currentPage === index + 1}>
                  {index + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem aria-label="Next" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                <span aria-hidden="true">&raquo;</span>
              </CPaginationItem>
            </CPagination>
          </div>

          {/* Modal for order details */}
          <CModal visible={isModalOpen} onClose={handleCloseModal} size="lg">
            <CModalHeader>
              <CModalTitle>Order Details</CModalTitle>
            </CModalHeader>
            <CModalBody style={{ maxHeight: "60vh", overflowY: "auto" }}>
              {selectedOrder && (
                <>
                  <div className="modal-order-info">
                    <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                    <p><strong>Place Name / Username:</strong> {selectedOrder.location.location ? selectedOrder.location.location?.placename || "-" : selectedOrder.location.Name}</p>
                    <p><strong>Timestamp:</strong> {new Date(selectedOrder.timestamp.seconds * 1000 + selectedOrder.timestamp.nanoseconds / 1000000).toLocaleString()}</p>
                  </div>
                  <div className="modal-summary">
                    {selectedOrder.summary.map((item, index) => (
                      <div key={index} className="modal-summary-item">
                        <h5 className="modal-summary-title">{item.mealName}</h5>
                        <table className="modal-summary-table">
                          <thead>
                            <tr>
                              <th>Category</th>
                              <th>Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.data.map((mealDetail, idx) => (
                              <tr key={idx}>
                                <td>{mealDetail.enCategory}</td>
                                <td>{mealDetail.enName}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={handleCloseModal}>
                Close
              </CButton>
              <CButton color="primary" onClick={() => exportToPDF(selectedOrder)}>
                Export to PDF
              </CButton>
            </CModalFooter>
          </CModal>
        </>
      )}
    </div>
  );
}
