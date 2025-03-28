import React, { useState, useEffect } from "react";

import Pagination from "../common/Pagination";
import RoomModal from "../components/Portals/RoomPortal";

// Modal Component

// Main Room Component
const Room = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 5;

  useEffect(() => {
    const storedRooms = JSON.parse(localStorage.getItem("rooms")) || [];
    const storedBlocks = JSON.parse(localStorage.getItem("blocks")) || [];
    setRooms(storedRooms);
    setFilteredRooms(storedRooms);
    setBlocks(storedBlocks);
  }, []);

  useEffect(() => {
    localStorage.setItem("rooms", JSON.stringify(rooms));
    setFilteredRooms(rooms);
  }, [rooms]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm) {
        setFilteredRooms(rooms.filter(room => room.name.toLowerCase().includes(searchTerm.toLowerCase())));
      } else {
        setFilteredRooms(rooms);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, rooms]);

  const handleSaveRoom = (name, blockId) => {
    if (!name.trim() || !blockId) return alert("Please enter a valid room name and select a block.");

    const selectedBlock = blocks.find(block => block.id === parseInt(blockId));

    const newRoom = {
      id: editingRoom ? editingRoom.id : Date.now(),
      name,
      blockId,
      blockName: selectedBlock && selectedBlock.name ,
    };

    setRooms(editingRoom ? rooms.map(r => (r.id === editingRoom.id ? newRoom : r)) : [...rooms, newRoom]);
    setShowModal(false);
    setEditingRoom(null);
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setRooms(rooms.filter((r) => r.id !== id));
  };

  const paginatedRooms = filteredRooms.slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add Room
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Room Name</th>
              <th className="p-3 text-left">Block Name</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRooms.length > 0 ? (
              paginatedRooms.map((room) => (
                <tr key={room.id}>
                  <td className="p-3">{room.name}</td>
                  <td className="p-3">{room.blockName}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => handleEdit(room)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                    <button onClick={() => handleDelete(room.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-3 text-center">No rooms found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      <RoomModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleSaveRoom} room={editingRoom} blocks={blocks} />
    </div>
  );
};

export default Room;