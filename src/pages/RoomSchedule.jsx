import dayjs from 'dayjs'; 
import React, { useState, useEffect } from 'react';

const RoomSchedule = () => {
  const weekStart = dayjs("2025-02-09"); // Changeable start date
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day"));
  
  const [scheduleData, setScheduleData] = useState({
    weekStart: weekStart.format("DD MMM YYYY"),
    weekEnd: weekDays[6].format("DD MMM YYYY"),
    data: []
  });
  
  const [rooms, setRooms] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  
  // Initialize data when component mounts
  useEffect(() => {
    // Load data from localStorage or initialize with mock data
    try {
      // Load rooms
      const roomsData = JSON.parse(localStorage.getItem("rooms") || "[]");
      setRooms(roomsData.length > 0 ? roomsData : initializeRooms());
      
      // Load shifts
      const shiftsData = JSON.parse(localStorage.getItem("shifts") || "[]");
      setShifts(shiftsData.length > 0 ? shiftsData : initializeShifts());
      
      // Load doctors
      const doctorsData = JSON.parse(localStorage.getItem("doctors") || "[]");
      setDoctors(doctorsData.length > 0 ? doctorsData : initializeDoctors());
      
      // Load schedule
      const storedSchedule = JSON.parse(localStorage.getItem("schedule") || "null");
      if (storedSchedule) {
        setScheduleData(storedSchedule);
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      // Initialize with defaults if error
      setRooms(initializeRooms());
      setShifts(initializeShifts());
      setDoctors(initializeDoctors());
    }
  }, []);
  
  // Initialize schedule data when rooms and shifts are available
  useEffect(() => {
    if (rooms.length > 0 && shifts.length > 0) {
      // Construct the weekly schedule
      const updatedData = weekDays.map((day) => {
        const dayName = day.format("dddd");
        const formattedDate = day.format("DD-MM-YY");
        
        // Initialize shifts for this day
        const dayShifts = shifts.map(shift => {
          // Initialize rooms for this shift
          const shiftRooms = rooms.map(room => {
            // Check if we have existing data for this cell
            const existingData = localStorage.getItem(`schedule_${dayName}_${shift.id}_${room.id}`);
            return {
              roomId: room.id,
              roomName: room.name,
              doctor: existingData ? JSON.parse(existingData) : null
            };
          });
          
          return {
            shiftId: shift.id,
            shiftName: shift.name,
            rooms: shiftRooms
          };
        });
        
        return {
          day: dayName,
          date: formattedDate,
          shifts: dayShifts
        };
      });
      
      setScheduleData(prev => ({ ...prev, data: updatedData }));
    }
  }, [rooms, shifts]);
  
  // Save schedule changes to localStorage
  useEffect(() => {
    if (scheduleData.data.length > 0) {
      localStorage.setItem("schedule", JSON.stringify(scheduleData));
      
      // Also save individual cell data for easier retrieval
      // scheduleData.data.forEach(dayData => {
      //   dayData.shifts.forEach(shift => {
      //     shift.rooms.forEach(room => {
      //       localStorage.setItem(
              
      //         JSON.stringify(room.doctor)
      //       );
      //     });
      //   });
      // });
    }
  }, [scheduleData]);
  

  

  const initializeDoctors = () => {
    const defaultDoctors = [
      { id: 1, name: 'Dr John' },
      { id: 2, name: 'Dr Sulaiman' },
      { id: 3, name: 'Dr Sarah' }
    ];
    
    return defaultDoctors;
  };
  
  // Handle cell click - open modal to add/remove doctor
  const handleCellClick = (day, shiftId, roomId, currentDoctor) => {
    setSelectedCell({ day, shiftId, roomId, currentDoctor });
    setShowModal(true);
  };
  
  // Add doctor to selected cell
  const assignDoctor = (doctorId) => {
    if (!selectedCell) return;
    
    const { day, shiftId, roomId } = selectedCell;
    const doctor = doctors.find(d => d.id === doctorId);
    
    setScheduleData(prev => {
      const updated = { ...prev };
      const dayIndex = updated.data.findIndex(d => d.day === day);
      if (dayIndex >= 0) {
        const shiftIndex = updated.data[dayIndex].shifts.findIndex(s => s.shiftId === shiftId);
        if (shiftIndex >= 0) {
          const roomIndex = updated.data[dayIndex].shifts[shiftIndex].rooms.findIndex(r => r.roomId === roomId);
          if (roomIndex >= 0) {
            updated.data[dayIndex].shifts[shiftIndex].rooms[roomIndex].doctor = {
              id: doctor.id,
              name: doctor.name
            };
            
          }
        }
      }
      return updated;
    });
    
    setShowModal(false);
  };
  
  // Remove doctor from selected cell
  const removeDoctor = () => {
    if (!selectedCell) return;
    
    const { day, shiftId, roomId } = selectedCell;
    
    setScheduleData(prev => {
      const updated = { ...prev };
      const dayIndex = updated.data.findIndex(d => d.day === day);
      if (dayIndex >= 0) {
        const shiftIndex = updated.data[dayIndex].shifts.findIndex(s => s.shiftId === shiftId);
        if (shiftIndex >= 0) {
          const roomIndex = updated.data[dayIndex].shifts[shiftIndex].rooms.findIndex(r => r.roomId === roomId);
          if (roomIndex >= 0) {
            updated.data[dayIndex].shifts[shiftIndex].rooms[roomIndex].doctor = null;
          }
        }
      }
      return updated;
    });
    
    setShowModal(false);
  };
  
  // Group rooms by building
  const buildingRooms = rooms.reduce((acc, room) => {
    if (!acc[room.blockName]) {
      acc[room.blockName] = [];
    }
    acc[room.blockName].push(room);
    return acc;
  }, {});
  
  // Doctor selection modal
  const DoctorModal = () => {
    if (!showModal) return null;
    
    const isAssigned = selectedCell?.currentDoctor !== null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-lg font-bold mb-4">
            {isAssigned ? 'Remove Doctor' : 'Add Doctor'}
          </h3>
          
          {isAssigned ? (
            <div>
              <p className="mb-4">Current assignment: {selectedCell?.currentDoctor?.name}</p>
              <button 
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={removeDoctor}
              >
                Remove
              </button>
            </div>
          ) : (
            <div>
              <p className="mb-2">Select a doctor:</p>
              <div className="space-y-2 mb-4">
                {doctors.map(doctor => (
                  <button 
                    key={doctor.id}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                    onClick={() => assignDoctor(doctor.id)}
                  >
                    {doctor.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <button 
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-4 text-center">
        <h2 className="text-xl font-bold">Room Schedule</h2>
        <p>{scheduleData.weekStart} - {scheduleData.weekEnd}</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Header row with building and room information */}
          <thead>
            <tr>
              <th className="border p-2"></th>
              {Object.entries(buildingRooms).map(([blockName, blockRooms]) => (
                <th
                  key={blockName}
                  className="border p-2 bg-gray-200 text-center"
                  colSpan={blockRooms.length}
                >
                  {blockName}
                </th>
              ))}
            </tr>
            <tr>
              <th className="border p-2"></th>
              {rooms.map(room => (
                <th key={room.id} className="border p-2 bg-gray-200 text-center">
                  {room.name}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {scheduleData.data.map((dayData) => (

                <React.Fragment key={dayData.day}>
                  <tr>
                    <td 
                      className="border p-2 bg-gray-200 font-medium"
                      colSpan={rooms.length + 1}
                    >
                      {dayData.day}
                    </td>
                  </tr>
                  
                  {dayData.shifts.map(shift => (
                    <tr key={`${dayData.day}-${shift.shiftId}`}>
                      <td className="border p-2">{shift.shiftName}</td>
                      
                      {shift.rooms.map(room => {
                        const hasDoctor = room.doctor !== null;
                        
                        return (
                          <td
                            key={`${dayData.day}-${shift.shiftId}-${room.roomId}`}
                            className={`border p-2 ${hasDoctor ? 'bg-green-300' : 'bg-yellow-200'} text-center cursor-pointer`}
                            onClick={() => handleCellClick(dayData.day, shift.shiftId, room.roomId, room.doctor)}
                          >
                            {hasDoctor && (
                              <div className="flex justify-between items-center">
                                <span>{room.doctor.name}</span>
                                <span className="text-gray-600">×</span>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              
            ))}
          </tbody>
        </table>
      </div>
      
      <DoctorModal />
    </div>
  );
};

export default RoomSchedule;