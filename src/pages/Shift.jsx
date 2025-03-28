import React, { useState, useEffect, useCallback, useMemo } from "react";
import dayjs from "dayjs";
import Pagination from "../common/Pagination";
import ShiftModal from "../components/Portals/shiftmodal";

const SHIFTS_KEY = "shifts";

const Shift = () => {
  const [shifts, setShifts] = useState(() => JSON.parse(localStorage.getItem(SHIFTS_KEY)) || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const shiftsPerPage = 5;

  useEffect(() => {
    localStorage.setItem(SHIFTS_KEY, JSON.stringify(shifts));
  }, [shifts]);

  // Memoized filtered shifts to avoid unnecessary recalculations
  const filteredShifts = useMemo(() => {
    return searchTerm
      ? shifts.filter(shift => shift.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : shifts;
  }, [searchTerm, shifts]);

  // Handle Save Shift (Add or Edit)
  const handleSaveShift = useCallback((startTime, endTime) => {
    if (!startTime || !endTime) return alert("Please select a valid time range.");

    const newShift = {
      id: editingShift ? editingShift.id : Date.now(),
      startTime,
      endTime,
      name: `${dayjs(`2000-01-01 ${startTime}`).format("h:mm A")} - ${dayjs(`2000-01-01 ${endTime}`).format("h:mm A")}`,
    };

    setShifts(prevShifts =>
      editingShift ? prevShifts.map(s => (s.id === editingShift.id ? newShift : s)) : [...prevShifts, newShift]
    );

    setShowModal(false);
    setEditingShift(null);
  }, [editingShift]);

  const handleEdit = (shift) => {
    setEditingShift(shift);
    setShowModal(true);
  };

  const handleDelete = useCallback((id) => {
    setShifts(prevShifts => prevShifts.filter(s => s.id !== id));
  }, []);

  const paginatedShifts = useMemo(() => {
    const start = (currentPage - 1) * shiftsPerPage;
    return filteredShifts.slice(start, start + shiftsPerPage);
  }, [currentPage, filteredShifts, shiftsPerPage]);

  return (
    <div className="w-full p-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search shifts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add Shift
        </button>
      </div>

      {/* Shift Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Shift</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedShifts.length > 0 ? (
              paginatedShifts.map(shift => (
                <tr key={shift.id} className="border-b">
                  <td className="p-3">{shift.name}</td>
                  <td className="p-3 text-center space-x-2">
                    <button onClick={() => handleEdit(shift)} className="text-blue-600">✏️</button>
                    <button onClick={() => handleDelete(shift.id)} className="text-red-600">🗑️</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="p-4 text-center text-gray-500">No shifts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={Math.ceil(filteredShifts.length / shiftsPerPage)} onPageChange={setCurrentPage} />

      {/* Modal */}
      {showModal && (
        <ShiftModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingShift(null);
          }}
          onSave={handleSaveShift}
          shift={editingShift}
        />
      )}
    </div>
  );
};

export default React.memo(Shift);
