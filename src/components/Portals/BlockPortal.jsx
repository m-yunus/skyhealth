import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
const BlockModal = ({ isOpen, onClose, onSave, block }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (block) {
      setName(block.name);
    } else {
      setName("");
    }
  }, [block]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">{block ? "Edit Block" : "Add New Block"}</h2>
        <label className="block mb-2">Block Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
          <button onClick={() => onSave(name)} className="px-4 py-2 bg-blue-600 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
export default BlockModal;