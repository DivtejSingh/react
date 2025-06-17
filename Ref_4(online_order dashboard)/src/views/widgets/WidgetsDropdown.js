import React, { useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import { OnlineContext } from "../../Provider/OrderProvider";
import { CRow, CCol, CDropdown, CDropdownMenu, CDropdownItem, CDropdownToggle, CWidgetStatsA } from "@coreui/react";
import { getStyle } from "@coreui/utils";
import { CChartBar, CChartLine } from "@coreui/react-chartjs";
import CIcon from "@coreui/icons-react";
import { cilArrowBottom, cilArrowTop, cilOptions } from "@coreui/icons";
import { Link } from "react-router-dom";

const WidgetsDropdown = (props) => {
  const { getmeal, getAllcategory, getAllproducts, foodprod, allcategorie, orders } = useContext(OnlineContext);

  const totalpro = foodprod.length;
  const totalsub = allcategorie.length;
  const totalorders = orders.length;

  const widgetChartRef1 = useRef(null);
  const widgetChartRef2 = useRef(null);

  useEffect(() => {
    document.documentElement.addEventListener("ColorSchemeChange", () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle("--cui-primary");
          widgetChartRef1.current.update();
        });
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle("--cui-info");
          widgetChartRef2.current.update();
        });
      }
    });
    getAllcategory();
    getAllproducts();
  }, [widgetChartRef1, widgetChartRef2]);

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <Link to="/restaurant/addmeals" style={{ textDecoration: "none", color: "inherit" }}>
          <CWidgetStatsA
            color="primary"
            value={
              <>
                {totalsub}
                <span className="fs-6 fw-normal"></span>
              </>
            }
            title="Category"
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="text-white p-0"></CDropdownToggle>
              </CDropdown>
            }
            chart={<CChartLine ref={widgetChartRef1} className="mt-3 mx-3" style={{ height: "70px" }} />}
          />
        </Link>
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <Link to="/restaurant/allproducts" style={{ textDecoration: "none", color: "inherit" }}>
          <CWidgetStatsA color="info" value={<>{totalpro}</>} title="Products" action={<CDropdown alignment="end"></CDropdown>} chart={<CChartLine ref={widgetChartRef2} className="mt-3 mx-3" style={{ height: "70px" }} />} />
        </Link>
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <Link to="/restaurant/orders" style={{ textDecoration: "none", color: "inherit" }}>
          <CWidgetStatsA color="warning" value={<>{totalorders}</>} title="Orders" action={<CDropdown alignment="end"></CDropdown>} chart={<CChartLine className="mt-3" style={{ height: "70px" }} />} />
        </Link>
      </CCol>
    </CRow>
  );
};

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
};

export default WidgetsDropdown;
