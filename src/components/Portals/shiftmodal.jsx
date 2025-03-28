import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
const ShiftModal = ({ isOpen, onClose, onSave, shift }) => {
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
  
    // Update state when shift (editingShift) changes
    useEffect(() => {
      if (shift) {
        const [start, end] = shift.name.split(" - ");
        setStartTime(dayjs(`2000-01-01 ${start}`).format("HH:mm"));
        setEndTime(dayjs(`2000-01-01 ${end}`).format("HH:mm"));
      } else {
        setStartTime("");
        setEndTime("");
      }
    }, [shift]);
  
    if (!isOpen) return null;
  
    return ReactDOM.createPortal(
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-bold mb-4">{shift ? "Edit Shift" : "Add New Shift"}</h2>
          <label className="block mb-2">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <label className="block mb-2">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <div className="flex justify-end space-x-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
            <button onClick={() => onSave(startTime, endTime)} className="px-4 py-2 bg-blue-600 text-white rounded">
              Save
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };
  export default ShiftModal;