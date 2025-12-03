import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";

const SingleBatchPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [formName, setFormName] = useState("");

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const fakeData = {
        id: Number(id),
        name: `Batch ${id}`,
      };
      setBatch(fakeData);
      setFormName(fakeData.name);
      setLoading(false);
    }, 600);
  }, [id]);

  const handleBack = () => navigate(-1);

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this batch? This action cannot be undone."
      )
    ) {
      alert(`Batch "${batch.name}" deleted (simulated).`);
      navigate(-1);
    }
  };

  const handleEditToggle = () => {
    setShowEdit(!showEdit);
    setFormName(batch?.name || "");
  };

  const handleSave = () => {
    if (!formName.trim()) {
      alert("Name cannot be empty.");
      return;
    }
    setBatch({ ...batch, name: formName });
    setShowEdit(false);
    alert("Batch updated (simulated).");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        Loading...
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 bg-gray-50 dark:bg-gray-900">
        Batch not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 px-12 py-10">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-3 mb-8 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
        >
          <FaArrowLeft />
          Back to Batch List
        </button>

        {/* Header */}
        <h2 className="text-4xl font-extrabold mb-10 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Batch Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Batch ID Box */}
          <div className="bg-blue-50 dark:bg-blue-900/30 p-8 rounded-2xl border border-blue-100 dark:border-blue-700 flex flex-col items-center justify-center space-y-2">
            <span className="font-mono text-6xl font-bold text-blue-600 dark:text-blue-400 select-none">
              #{batch.id}
            </span>
            <p className="uppercase text-sm font-semibold text-blue-700 dark:text-blue-300 tracking-wider select-none">
              Batch ID
            </p>
          </div>

          {/* Batch Name Section */}
          <div className="md:col-span-2 flex flex-col justify-center">
            <label className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
              Batch Name
            </label>
            {!showEdit ? (
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {batch.name}
              </div>
            ) : (
              <input
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition mb-6 text-lg text-gray-900 dark:text-gray-100"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                autoFocus
              />
            )}

            {/* Buttons */}
            <div className="flex gap-6">
              {!showEdit ? (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-400 text-yellow-900 font-semibold hover:bg-yellow-500 transition-shadow shadow-md"
                  >
                    <FaEdit />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-shadow shadow-md"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-shadow shadow-md"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="px-6 py-3 rounded-xl bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold hover:bg-gray-400 dark:hover:bg-gray-700 transition-shadow shadow-md"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBatchPage;
