import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSpinner, FaSearch } from "react-icons/fa";

// Fake data (simulating what your backend would return)
const FAKE_SOURCES = [
  { sourceID: 1, sourceName: "Ministry of Education (MOE)" },
  { sourceID: 2, sourceName: "National University Commission (NUC)" },
  { sourceID: 3, sourceName: "World Health Organization (WHO)" },
  {
    sourceID: 4,
    sourceName: "Joint Admissions and Matriculation Board (JAMB)",
  },
  { sourceID: 5, sourceName: "University Senate Curriculum Committee" },
  { sourceID: 6, sourceName: "Faculty of Health Sciences" },
  { sourceID: 7, sourceName: "Accreditation Council" },
  { sourceID: 8, sourceName: "External Examiner Report" },
];

const CourseSourcesEditor = () => {
  const [sources, setSources] = useState(FAKE_SOURCES);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Simulate async delay
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Create new source
  const createSource = async (sourceName: string) => {
    await delay(600);
    const newSource = {
      sourceID: Math.max(...sources.map((s) => s.sourceID)) + 1,
      sourceName: sourceName.trim(),
    };
    setSources((prev) => [newSource, ...prev]);
    return newSource;
  };

  // Update source
  const updateSource = async (id: number, sourceName: string) => {
    await delay(600);
    setSources((prev) =>
      prev.map((s) =>
        s.sourceID === id ? { ...s, sourceName: sourceName.trim() } : s
      )
    );
  };

  // Delete source
  const deleteSource = async (id: number) => {
    await delay(400);
    setSources((prev) => prev.filter((s) => s.sourceID !== id));
  };

  const filteredSources = sources.filter(
    (source) =>
      source.sourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      source.sourceID.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen p-8 transition-colors duration-300 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Course Sources
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Manage course source references ({sources.length} total)
            </p>
          </div>
          <button
            onClick={() => document.getElementById("add-modal")?.showModal()}
            disabled={saving}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 disabled:opacity-50 flex items-center gap-3"
          >
            <FaPlus className="text-xl" />
            Add Source
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search sources by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white dark:bg-gray-800 transition-all duration-300"
          />
        </div>
      </div>

      {/* Sources Table */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <tr>
                <th className="px-8 py-6 text-left font-bold text-lg">ID</th>
                <th className="px-8 py-6 text-left font-bold text-lg">
                  Source Name
                </th>
                <th className="px-8 py-6 text-right font-bold text-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSources.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-8 py-20 text-center text-gray-500 dark:text-gray-400 text-lg"
                  >
                    {searchTerm
                      ? "No sources match your search"
                      : "No course sources found"}
                  </td>
                </tr>
              ) : (
                filteredSources.map((source) => (
                  <tr
                    key={source.sourceID}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200"
                  >
                    <td className="px-8 py-6 font-mono font-bold text-xl bg-indigo-50 dark:bg-indigo-900/50">
                      {source.sourceID}
                    </td>
                    <td className="px-8 py-6 font-semibold text-lg max-w-md">
                      {source.sourceName}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() =>
                            document
                              .getElementById(`edit-modal-${source.sourceID}`)
                              ?.showModal()
                          }
                          className="p-3 rounded-2xl text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                          title="Edit"
                        >
                          <FaEdit className="text-xl" />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`Delete "${source.sourceName}"?`)) {
                              setSaving(true);
                              await deleteSource(source.sourceID);
                              setSaving(false);
                            }
                          }}
                          disabled={saving}
                          className="p-3 rounded-2xl text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                          title="Delete"
                        >
                          <FaTrash className="text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <dialog id="add-modal" className="backdrop:bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4">
          <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent text-center">
            Add Course Source
          </h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const sourceName = formData.get("sourceName") as string;

              if (!sourceName?.trim()) {
                alert("Source name is required");
                return;
              }

              setSaving(true);
              try {
                await createSource(sourceName.trim());
                (e.target as HTMLFormElement).reset();
                (
                  document.getElementById("add-modal") as HTMLDialogElement
                ).close();
              } catch (err) {
                alert("Failed to create source");
              } finally {
                setSaving(false);
              }
            }}
          >
            <div className="space-y-6">
              <input
                name="sourceName"
                type="text"
                placeholder="e.g., WHO Guidelines"
                className="w-full p-5 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg bg-gray-50 dark:bg-gray-700 transition-all"
                required
                maxLength={100}
              />
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    (
                      document.getElementById("add-modal") as HTMLDialogElement
                    )?.close()
                  }
                  className="flex-1 py-4 px-6 rounded-2xl font-bold bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition-all text-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg transition-all text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? <FaSpinner className="animate-spin" /> : null}
                  {saving ? "Creating..." : "Create Source"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </dialog>

      {/* Edit Modals */}
      {sources.map((source) => (
        <dialog
          key={source.sourceID}
          id={`edit-modal-${source.sourceID}`}
          className="backdrop:bg-black/50 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4">
            <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent text-center">
              Edit Course Source
            </h3>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8 font-mono bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl">
              ID:{" "}
              <span className="font-bold text-indigo-600">
                {source.sourceID}
              </span>
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const sourceName = formData.get("sourceName") as string;

                if (!sourceName?.trim()) {
                  alert("Source name is required");
                  return;
                }

                setSaving(true);
                try {
                  await updateSource(source.sourceID, sourceName.trim());
                  (
                    document.getElementById(
                      `edit-modal-${source.sourceID}`
                    ) as HTMLDialogElement
                  ).close();
                } catch (err) {
                  alert("Failed to update source");
                } finally {
                  setSaving(false);
                }
              }}
            >
              <div className="space-y-6">
                <input
                  name="sourceName"
                  type="text"
                  defaultValue={source.sourceName}
                  placeholder="Enter source name"
                  className="w-full p-5 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg bg-gray-50 dark:bg-gray-700 transition-all"
                  required
                  maxLength={100}
                />
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      (
                        document.getElementById(
                          `edit-modal-${source.sourceID}`
                        ) as HTMLDialogElement
                      )?.close()
                    }
                    className="flex-1 py-4 px-6 rounded-2xl font-bold bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition-all text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-4 px-6 rounded-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg transition-all text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving ? <FaSpinner className="animate-spin" /> : null}
                    {saving ? "Updating..." : "Update Source"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </dialog>
      ))}
    </div>
  );
};

export default CourseSourcesEditor;
