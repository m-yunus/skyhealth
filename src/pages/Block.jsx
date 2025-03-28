import React, { useState, useEffect, useCallback } from "react";
import Pagination from "../common/Pagination";
import BlockModal from "../components/Portals/BlockPortal";

const BLOCKS_STORAGE_KEY = "blocks";
const BLOCKS_PER_PAGE = 5;

const Block = () => {
  const [blocks, setBlocks] = useState([]);
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch blocks from local storage
  useEffect(() => {
    const storedBlocks = JSON.parse(localStorage.getItem(BLOCKS_STORAGE_KEY)) || [];
    setBlocks(storedBlocks);
    setFilteredBlocks(storedBlocks);
  }, []);

  // Update local storage when blocks change
  useEffect(() => {
    if (blocks.length) {
      localStorage.setItem(BLOCKS_STORAGE_KEY, JSON.stringify(blocks));
    }
  }, [blocks]);

  // Search logic with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilteredBlocks(
        searchTerm
          ? blocks.filter((block) => block.name.toLowerCase().includes(searchTerm.toLowerCase()))
          : blocks
      );
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, blocks]);

  // Save or update a block
  const handleSaveBlock = useCallback(
    (name) => {
      if (!name.trim()) {
        alert("Please enter a valid block name.");
        return;
      }

      setBlocks((prevBlocks) => {
        const newBlock = { id: editingBlock?.id || Date.now(), name };
        const updatedBlocks = editingBlock
          ? prevBlocks.map((b) => (b.id === editingBlock.id ? newBlock : b))
          : [...prevBlocks, newBlock];

        return updatedBlocks;
      });

      setShowModal(false);
      setEditingBlock("");
    },
    [editingBlock]
  );

  // Delete a block
  const handleDelete = useCallback((id) => {
    setBlocks((prevBlocks) => prevBlocks.filter((b) => b.id !== id));
  }, []);

  // Edit a block
  const handleEdit = useCallback((block) => {
    setEditingBlock(block);
    setShowModal(true);
  }, []);

  const paginatedBlocks = filteredBlocks.slice(
    (currentPage - 1) * BLOCKS_PER_PAGE,
    currentPage * BLOCKS_PER_PAGE
  );

  return (
    <div className="w-full p-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search blocks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Block
        </button>
      </div>

      {/* Block Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Block Name</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBlocks.length > 0 ? (
              paginatedBlocks.map((block) => (
                <tr key={block.id} className="border-t">
                  <td className="p-3">{block.name}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(block)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(block.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="p-3 text-center text-gray-500">
                  No blocks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredBlocks.length / BLOCKS_PER_PAGE)}
        onPageChange={setCurrentPage}
      />

      {/* Modal for Adding/Editing Block */}
      <BlockModal
        isOpen={showModal}
        onClose={() => {setShowModal(false); setEditingBlock(null);}}
        onSave={handleSaveBlock}
        block={editingBlock}
      />
    </div>
  );
};

export default Block;
