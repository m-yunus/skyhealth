import React, { useState, useEffect, useMemo } from 'react';

// Configuration constants
const INITIAL_SCHEDULE = {
  blocks: ['Old Building', 'New Building'],
  rooms: {
    'Old Building': ['Room 1'],
    'New Building': ['Room 1', 'Room 2']
  },
  shifts: ['9am-1pm', '2pm-3pm', '5pm-6pm'],
  days: ['Sunday', 'Monday', 'Wednesday', 'Thursday']
};

const DOCTORS_LIST = ['Dr. Sulaiman', 'Dr. John', 'Dr. Sarah'];

// Helper function to initialize schedule data
const initializeScheduleData = () => {
  const savedSchedule = localStorage.getItem('roomSchedule');
  if (savedSchedule) return JSON.parse(savedSchedule);

  const initialData = { ...INITIAL_SCHEDULE, data: {} };
  
  // Pre-populate data structure
  INITIAL_SCHEDULE.days.forEach(day => {
    initialData.data[day] = {};
    INITIAL_SCHEDULE.blocks.forEach(block => {
      initialData.data[day][block] = {};
      INITIAL_SCHEDULE.rooms[block].forEach(room => {
        initialData.data[day][block][room] = {};
        INITIAL_SCHEDULE.shifts.forEach(shift => {
          initialData.data[day][block][room][shift] = { 
            doctor: '', 
            status: 'yellow' 
          };
        });
      });
    });
  });

  return initialData;
};

const RoomSchedule = () => {
  const [scheduleData, setScheduleData] = useState(initializeScheduleData);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Persist schedule changes to localStorage
  useEffect(() => {
    localStorage.setItem('roomSchedule', JSON.stringify(scheduleData));
  }, [scheduleData]);

  // Memoized doctor assignment handler
  const handleDoctorAssignment = useMemo(() => (doctor) => {
    if (!selectedCell) return;

    const { day, block, room, shift } = selectedCell;
    setScheduleData(prev => {
      const updated = { ...prev };
      updated.data[day][block][room][shift] = { 
        doctor, 
        status: 'green' 
      };
      return updated;
    });

    setSelectedCell(null);
    setIsModalOpen(false);
  }, [selectedCell]);

  // Memoized doctor removal handler
  const handleDoctorRemoval = useMemo(() => (day, block, room, shift) => {
    setScheduleData(prev => {
      const updated = { ...prev };
      updated.data[day][block][room][shift] = { 
        doctor: '', 
        status: 'yellow' 
      };
      return updated;
    });
  }, []);

  // Open doctor selection modal
  const openDoctorModal = (cellDetails) => {
    setSelectedCell(cellDetails);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h2 className="text-xl font-bold mb-4 text-center">Select Doctor</h2>
            <div className="space-y-2">
              {DOCTORS_LIST.map(doctor => (
                <button 
                  key={doctor} 
                  onClick={() => handleDoctorAssignment(doctor)}
                  className="w-full p-2 border rounded hover:bg-blue-50 transition-colors"
                >
                  {doctor}
                </button>
              ))}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full p-2 border rounded bg-red-100 hover:bg-red-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <h1 className="text-2xl font-bold p-4 bg-gray-100 border-b">Room Schedule Management</h1>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-200">Shift</th>
              {scheduleData.blocks.flatMap(block => 
                scheduleData.rooms[block].map(room => (
                  <th 
                    key={`${block}-${room}`} 
                    className="border p-2 bg-gray-200"
                  >
                    {block} - {room}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {scheduleData.days.map(day => (
              <React.Fragment key={day}>
                <tr>
                  <td 
                    colSpan={scheduleData.blocks.length * 
                    scheduleData.rooms[scheduleData.blocks[0]].length + 1} 
                    className="bg-blue-100 text-center font-bold p-2"
                  >
                    {day}
                  </td>
                </tr>
                {scheduleData.shifts.map(shift => (
                  <tr key={`${day}-${shift}`}>
                    <td className="border p-2 bg-gray-50">{shift}</td>
                    {scheduleData.blocks.flatMap(block => 
                      scheduleData.rooms[block].map(room => {
                        const cellData = scheduleData.data[day]?.[block]?.[room]?.[shift];
                        return (
                          <td 
                            key={`${day}-${block}-${room}-${shift}`}
                            className={`border p-2 text-center 
                              ${cellData?.status === 'green' 
                                ? 'bg-green-100 hover:bg-green-200' 
                                : 'bg-yellow-100 hover:bg-yellow-200'}
                              cursor-pointer transition-colors relative
                            `}
                            onClick={() => openDoctorModal({ 
                              day, block, room, shift 
                            })}
                          >
                            <div className="flex items-center justify-center">
                              <span>{cellData?.doctor || 'Add'}</span>
                              {cellData?.doctor && (
                                <button 
                                  className="ml-2 text-red-500 hover:text-red-700 absolute right-1 top-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDoctorRemoval(day, block, room, shift);
                                  }}
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </td>
                        );
                      })
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomSchedule;