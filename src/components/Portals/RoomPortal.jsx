import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
const RoomModal = ({ isOpen, onClose, onSave, room, blocks }) => {
  const [name, setName] = useState("");
  const [blockId, setBlockId] = useState("");

  useEffect(() => {
    if (room) {
      setName(room.name);
      setBlockId(room.blockId);
    } else {
      setName("");
      setBlockId("");
    }
  }, [room]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">{room ? "Edit Room" : "Add New Room"}</h2>
        <label className="block mb-2">Room Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <label className="block mb-2">Block</label>
        <select
          value={blockId}
          onChange={(e) => setBlockId(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="">Select Block</option>
          {blocks.map((block) => (
         <option key={block.id} value={block.id}>{block.name}</option>

          ))}
        </select>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
          <button onClick={() => onSave(name, blockId)} className="px-4 py-2 bg-blue-600 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
export default RoomModal; 