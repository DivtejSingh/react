import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import CreateEventModal from "../../components/Modal/CreateEventModal";
import { deleteEventApi, EventParticipantsApi, getAllEventsApi } from "../../utils/service/EventService";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import { FaRegEye } from "react-icons/fa";
import { MdOutlineAssignmentInd } from "react-icons/md";
import {jwtDecode} from "jwt-decode";
import ViewEventModal from "../../components/Modal/ViewEventModal";
import AssignModal from "../../components/Modal/AssignModal";

// const today = format(new Date(), 'yyyy-MM-dd');

function Calendar() {
  const [loading, setLoading] = useState(false);
  const eventDataState = useSelector((state) => state.event.event);
  const [calenderModal, setCalenderModal] = useState(false);
  const [currentEventDate, setCurrentEventDate] = useState(null);
  const [eventData, setEventData] = useState([]);
  const [data, setData] = useState([""]);
  const [dataBackup, setDataBackup] = useState([""]);
  const [viewModalState, setViewModalState] = useState(false);
  const [assignModalState, setAssignModalState] = useState(false);
  const[eventdata,seteventdata] = useState([]);
  const[isLoading,setisLoading]  = useState(false);
  const[eventinfo,seteventInfo] = useState([]);
  const[eventid,seteventId] = useState("");
  const[tid,setrid] = useState();
  const Navigate=useNavigate();
  useEffect(()=>{
    const gettoken = localStorage.getItem('token');
const decode = jwtDecode(gettoken);

setrid(decode?.role);

if(decode?.role==2){
  Navigate('/')
}
  },[])
  const handleDateClick = (arg) => {
  if(tid!==3){
    setCalenderModal(true);
    setData([]);
    let date = arg.dateStr;
    setCurrentEventDate(date);
  }
  };

  const fetchAllEventsData = async () => {
    setLoading(true);
    const data = await getAllEventsApi();

    setLoading(false);

    let newData = [];
    if (data) {
      if (data?.data?.length != 0) {
        data?.data?.map((item) => {
          newData.push({
            title: item.title,
            start: item.start_time,
            end: item.end_time,
            id: item.event_id,
          });
        });
        setEventData(newData);
        setDataBackup(data.data);
      }
    }
  };
  const filterData = (id) => {
    return dataBackup.filter((item) => {
      return item.event_id == id;
    });
  };


  const viewevent = (event)=>{
   
    geteventParticipants(event.id);
    setViewModalState(true);
    seteventInfo(event);

  }
  const handleassign = (event)=>{
   
   
    setAssignModalState(true);
    seteventId(event?.id);
    setData(filterData(event.id));



  }


const geteventParticipants = async(id)=>{

  setisLoading(true);
  try{
let response = await EventParticipantsApi(id);

if(response?.isSuccess){
  setisLoading(false);
  seteventdata(response?.data);

   

}
  }catch(err){
    console.log(err)
  }
}

  const editEvent = (event) => {
    setCalenderModal(true);
    setData(filterData(event.id));
  };

  const deleteEvent = async (event) => {
    setLoading(true);
    const responce = await deleteEventApi({ event_id: event.id });
    setLoading(false);
    try {
      if (responce?.isSuccess) {
        toast.success(responce?.message);
        fetchAllEventsData();
      }
    } catch (error) {
      console.log(error);
    }
  };
const onassignevent = ()=>{
  fetchAllEventsData();
}
  useEffect(() => {
    fetchAllEventsData();
  }, [eventDataState]);
  return (
    <>
      {loading && <Loading />}

      <div className="flex justify-between sm:flex-col sm:gap-y-2  md:gap-y-2 w-full items-center">
        <h1 className="text-2xl font-bold sm:text-sm md:text-sm  sm:w-full">EVENTS MANAGEMENT</h1>
        <div className="flex gap-1 sm:flex-col sm:gap-y-1 md:flex-col md:gap-y-2 lg:gap-3 sm:w-full">
          <Link to="/admin/event_participants">
            {" "}
            {/* <button className="bg-blue-900 text-white sm:w-full md:w-full flex justify-center hover:border-[#ccc] md:text-sm ">
              <i className="my-0.4 pr-2 text-2xl  sm:my-0 md:text-md md:my-0 lg:my-2  md:text-sm"></i>
              EVENTS PARTICIPANTS
            </button> */}
          </Link>
        </div>
      </div>

      <div className="flex justify-center sm:w-[100%] sm:m-0  mx-auto sm:h-[75vh] my-4 sm:mt-4" style={{ height: "calc(100vh - 205px)" }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          events={eventData}
          dateClick={handleDateClick}
          eventContent={(eventInfo) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const eventDate = new Date(eventInfo.event.start);
           
        const eventenddate = new Date(eventInfo?.event?.end);
            // console.log(eventInfo,"eventibnfo")
            let eventClass = "";

            // Check if the event is a past event
            if (eventDate < today && eventenddate<today) {
              eventClass = "past-event";
            }
            // Check if the event is the current date and month
            else if (eventDate.getFullYear() === today.getFullYear() && eventDate.getMonth() === today.getMonth() && eventDate.getDate() === today.getDate()) {
              eventClass = "present-event";
            }
            // Otherwise, it's a future event
            else if(  eventDate <today && eventenddate>today){
              eventClass = "continue-event";
            }
            else if(eventDate>today){
              eventClass ="future-event";
            }

            return (
              <div
                className={`p-1 px-2 rounded-md text-sm flex gap-2 items-center justify-between sm:text-sm ${eventClass}`}
              >
                <div>
                  <b>{eventInfo.timeText} </b>
                  <i className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                    {eventInfo.event.title.length > 8
                      ? eventInfo.event.title.substring(0, 8) + "..."
                      : eventInfo.event.title}
                  </i>
                </div>
                <div className="flex pr-2 gap-2">
                  {tid!==3 &&(<i>
                    <MdOutlineAssignmentInd
                      className="cursor-pointer text-lg hover:text-blue-900 sm:text-[10px]"
                      title="assign to"
                      onClick={() => handleassign(eventInfo.event)}
                    />
                  </i>)}
                  <i>
                    <FaRegEye 
                      className="cursor-pointer text-lg hover:text-blue-900 sm:text-[10px]"
                      title="View"
                      onClick={() => viewevent(eventInfo.event)}
                    />
                  </i>
                  <i>
                    <TbEdit
                      className="cursor-pointer text-lg hover:text-blue-900 sm:text-[10px]"
                      title="Edit"
                      onClick={() => editEvent(eventInfo.event)}
                    />
                  </i>
                  <i>
                    <MdDelete
                      className="cursor-pointer text-lg hover:text-blue-900 sm:text-[10px]"
                      title="Delete"
                      onClick={() => deleteEvent(eventInfo.event)}
                    />
                  </i>
                </div>
              </div>
            );
          }}
        />
      </div>
      {/* viewModalData={viewModalData} */}
      <ViewEventModal eventinfo={eventinfo} isLoading={isLoading} viewModalData={eventdata} setViewModalState={setViewModalState} viewModalState={viewModalState} />
      <CreateEventModal calenderModal={calenderModal} setCalenderModal={setCalenderModal} currentEventDate={currentEventDate} eventDataToUpdate={data} />
      <AssignModal onassignevent={onassignevent} edata = {data} eid={eventid} assignModalState={assignModalState} setAssignModalState={setAssignModalState}></AssignModal>
     </>
  );
}

export default Calendar;
