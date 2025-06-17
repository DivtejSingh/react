import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import CreateEventModal from "../../../components/Modal/CreateEventModal";
import {
  deleteEventApi,
  EventParticipantsApi,
  getAllEventsApi,
} from "../../../utils/service/EventService";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { Link } from "react-router-dom";
import { setParticipants } from "../../../store/Slice/EventParticipantsSlice";
import Loading from "../../../components/Loading";
import Pagination from "../../../components/Pagination";
// calendar website
// https://fullcalendar.io/
function Event_Participants() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const participantsData = useSelector(
    (state) => state.participants.participants
  );
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await EventParticipantsApi();

      if (response?.isSuccess) {
        dispatch(setParticipants(response));
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);
  return (
    <>
      {loading && <Loading />}
      <div className="flex justify-between sm:flex-col sm:gap-y-2 md:flex-col md:gap-y-2 lg:flex-col lg:gap-y-5">
        <h1 className="text-3xl font-bold sm:text-sm md:text-md lg:text-3xl">
          EVENTS MANAGEMENT
        </h1>
        <div className="flex gap-1 sm:flex-col sm:gap-y-1 md:flex-col md:gap-y-2 lg:gap-3">
          <Link to="/admin/calendar">
            {" "}
            <button className="bg-blue-900 text-white flex justify-center hover:border-[#ccc] sm:text-sm md:text-xl">
              <i className="my-0.4 pr-2 text-2xl sm:text-lg sm:my-0 md:text-md md:my-0 lg:my-2">
                {/* <IoMdAddCircleOutline /> */}
              </i>
              EVENTS CALENDAR
            </button>
          </Link>
        </div>
      </div>

      <div className="overflow-y-auto mainFormSection mt-6 sm:max-h-[60vh] boxShadow rounded-lg sm:mx-1 md:mx-1 lg:mx-1" style={{ height: "calc(100vh - 257px)" }}>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left">Event Name</th>
              <th className="text-left">Event Start Time</th>
              <th className="text-left">End Time</th>
              <th className="text-left">Participant Username</th>
              <th className="text-left">Participant Email</th>
              <th className="text-left">Participant Status</th>
              <th className="text-left">Location</th>
            </tr>
          </thead>

          {participantsData?.data?.map((item, index) => {
            return (
              <tbody key={item.event_id + index}>
                {item.participants?.map((subItem, subId) => {
                  return (
                    <tr key={item.event_id + subItem.user_id + subId}>
                      <td className="text-left">{item.title}</td>
                      <td className="text-left">{item.start_time}</td>
                      <td className="text-left">{item.end_time}</td>
                      <td className="text-left">{subItem.username}</td>
                      <td className="text-left">{subItem.email}</td>
                      <td className="text-left ">
                        {subItem?.status == "accepted" && (
                          <button className="bg-[#aaf1ba] border border-success text-green-700 hover:bg-green-200 font-bold py-2 px-4 rounded cursor-text text-sm  w-[80px]">
                            {subItem.status}
                          </button>
                        )}
                        {subItem?.status == "declined" && (
                          <button className="bg-[#f7a0a8] border border-danger text-red-700 hover:bg-red-200 font-bold py-2 px-4 rounded cursor-text text-sm w-[80px]">
                            {subItem.status}
                          </button>
                        )}
                        {subItem?.status == "invited" && (
                          <button className="bg-[#fce7a5] border border-[#866e1d] text-red-700 hover:bg-red-200 font-bold py-2 px-4 rounded cursor-text text-sm w-[80px]">
                            {subItem.status}
                          </button>
                        )}
                      </td>
                      {/* <td className="text-left">{subItem.status}</td> */}
                      <td className="text-left">{item.location}</td>
                    </tr>
                  );
                })}
              </tbody>
            );
          })}
          {/* </tbody> */}
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(value) => {
          setCurrentPage(1);
          setItemsPerPage(value);
        }}
      />
    </>
  );
}

export default Event_Participants;
