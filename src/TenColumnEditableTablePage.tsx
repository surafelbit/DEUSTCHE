import React, { useMemo, useState } from "react";

// Full-page demo: 10-column dynamic table with single-row edit & bulk edit
// Tailwind CSS recommended for styling

const initialStudents = [
  {
    userId: 1,
    firstName: "John",
    lastName: "Doe",
    batch: "2022",
    class: "A",
    semester: "1",
    impairment: "none",
    maritalStatus: "single",
    score: 78,
    active: true,
  },
  {
    userId: 2,
    firstName: "Sara",
    lastName: "Kebede",
    batch: "2021",
    class: "B",
    semester: "2",
    impairment: "visual",
    maritalStatus: "single",
    score: 88,
    active: true,
  },
  {
    userId: 3,
    firstName: "Abel",
    lastName: "Bekele",
    batch: "2020",
    class: "C",
    semester: "1",
    impairment: "physical",
    maritalStatus: "married",
    score: 64,
    active: false,
  },
  {
    userId: 4,
    firstName: "Liya",
    lastName: "Yonas",
    batch: "2022",
    class: "B",
    semester: "2",
    impairment: "hearing",
    maritalStatus: "single",
    score: 93,
    active: true,
  },
  {
    userId: 5,
    firstName: "Mulu",
    lastName: "Hailu",
    batch: "2023",
    class: "A",
    semester: "1",
    impairment: "none",
    maritalStatus: "single",
    score: 71,
    active: true,
  },
];

// Column configuration (10 columns)
const ALL_COLUMNS = [
  { key: "userId", label: "ID", type: "text", width: "80px" },
  { key: "firstName", label: "First Name", type: "text" },
  { key: "lastName", label: "Last Name", type: "text" },
  {
    key: "batch",
    label: "Batch",
    type: "select",
    options: ["2020", "2021", "2022", "2023", "2024"],
  },
  { key: "class", label: "Class", type: "select", options: ["A", "B", "C"] },
  { key: "semester", label: "Semester", type: "select", options: ["1", "2"] },
  {
    key: "impairment",
    label: "Impairment",
    type: "select",
    options: ["none", "visual", "hearing", "physical"],
  },
  {
    key: "maritalStatus",
    label: "Marital Status",
    type: "select",
    options: ["single", "married"],
  },
  { key: "score", label: "Score", type: "number" },
  { key: "active", label: "Active", type: "boolean" },
];

function BulkEditModal({ open, onClose, onApply, visibleColumns }) {
  const columnOptions = ALL_COLUMNS.filter((c) =>
    visibleColumns.includes(c.key)
  );
  const [field, setField] = useState(columnOptions[0]?.key || "");
  const selectedCol = useMemo(
    () => ALL_COLUMNS.find((c) => c.key === field),
    [field]
  );
  const [value, setValue] = useState("");

  if (!open) return null;

  const handleApply = () => {
    // Coerce types
    let v = value;
    if (selectedCol?.type === "number") v = Number(value || 0);
    if (selectedCol?.type === "boolean") v = value === "true" || value === true;
    onApply(field, v);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Bulk Edit</h3>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Field</label>
            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="w-full rounded border px-3 py-2"
            >
              {columnOptions.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {selectedCol?.type === "select" && (
            <div>
              <label className="block text-sm mb-1">Value</label>
              <select
                value={String(value)}
                onChange={(e) => setValue(e.target.value)}
                className="w-full rounded border px-3 py-2"
              >
                <option value="">-- choose --</option>
                {selectedCol.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedCol?.type === "boolean" && (
            <div>
              <label className="block text-sm mb-1">Value</label>
              <select
                value={String(value)}
                onChange={(e) => setValue(e.target.value)}
                className="w-full rounded border px-3 py-2"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          )}

          {(selectedCol?.type === "text" || selectedCol?.type === "number") && (
            <div>
              <label className="block text-sm mb-1">Value</label>
              <input
                type={selectedCol?.type === "number" ? "number" : "text"}
                value={String(value)}
                onChange={(e) => setValue(e.target.value)}
                className="w-full rounded border px-3 py-2"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-4 py-2 rounded border">
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              Apply to Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TenColumnEditableTablePage() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    ALL_COLUMNS.map((c) => c.key)
  );

  // Single-row editing state
  const [editingRowId, setEditingRowId] = useState(null);
  const [draftRow, setDraftRow] = useState<any>({});

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState([]);
  const allSelected = useMemo(
    () => selectedIds.length > 0 && selectedIds.length === filtered.length,
    []
  );

  const [bulkOpen, setBulkOpen] = useState(false);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return students;
    return students.filter((st) =>
      [
        st.userId,
        st.firstName,
        st.lastName,
        st.batch,
        st.class,
        st.semester,
        st.impairment,
        st.maritalStatus,
        String(st.score),
        st.active ? "active" : "inactive",
      ]
        .join(" ")
        .toLowerCase()
        .includes(s)
    );
  }, [students, search]);

  const toggleColumn = (key) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const beginEdit = (row) => {
    setEditingRowId(row.userId);
    setDraftRow(row);
  };

  const cancelEdit = () => {
    setEditingRowId(null);
    setDraftRow({});
  };

  const saveEdit = () => {
    setStudents((prev) =>
      prev.map((s) =>
        s.userId === editingRowId ? { ...draftRow, userId: s.userId } : s
      )
    );
    cancelEdit();
  };

  const updateDraft = (key, value) => {
    setDraftRow((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const currentIds = filtered.map((s) => s.userId);
    const allSelectedNow = currentIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelectedNow ? [] : currentIds);
  };

  const applyBulk = (field, value) => {
    setStudents((prev) =>
      prev.map((s) =>
        selectedIds.includes(s.userId) ? { ...s, [field]: value } : s
      )
    );
    setBulkOpen(false);
    setSelectedIds([]);
  };

  const renderDisplayCell = (row, col) => {
    const v = row[col.key];
    if (col.type === "boolean") return v ? "Yes" : "No";
    return v ?? "-";
  };

  const renderEditCell = (row, col) => {
    const value = draftRow[col.key];
    if (col.type === "select") {
      return (
        <select
          value={value ?? ""}
          onChange={(e) => updateDraft(col.key, e.target.value)}
          className="w-full rounded border px-2 py-1"
        >
          <option value="">-- choose --</option>
          {col.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }
    if (col.type === "boolean") {
      return (
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => updateDraft(col.key, e.target.checked)}
          className="custom-checkbox"
        />
      );
    }
    return (
      <input
        type={col.type === "number" ? "number" : "text"}
        value={value ?? ""}
        onChange={(e) =>
          updateDraft(
            col.key,
            col.type === "number" ? Number(e.target.value) : e.target.value
          )
        }
        className="w-full rounded border px-2 py-1"
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6">
      <style>
        {`
          .custom-checkbox {
            appearance: none;
            width: 20px;
            height: 20px;
            border: 2px solid #3b82f6; /* Blue border */
            border-radius: 4px;
            background-color: white;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            position: relative;
            outline: none;
            display: inline-block;
            vertical-align: middle;
          }

          .custom-checkbox:checked {
            background-color: #3b82f6; /* Blue background when checked */
            border-color: #3b82f6;
          }

          .custom-checkbox:checked::after {
            content: '\\2713'; /* Checkmark */
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 14px;
            font-weight: bold;
          }

          .custom-checkbox:hover:not(:disabled) {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); /* Blue glow on hover */
          }

          .custom-checkbox:disabled {
            background-color: #e5e7eb;
            border-color: #d1d5db;
            cursor: not-allowed;
          }

          .custom-checkbox:focus {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); /* Blue focus ring */
          }
        `}
      </style>

      {/* Header */}
      <header className="max-w-7xl mx-auto mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">
          Students — 10 Column Dynamic Table
        </h1>
        <div className="flex items-center gap-2">
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border px-3 py-2 w-64 bg-white dark:bg-gray-900"
          />
          <button
            onClick={() => setBulkOpen(true)}
            disabled={selectedIds.length === 0}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
          >
            Bulk Edit ({selectedIds.length})
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6">
        {/* Column Picker */}
        <aside className="md:col-span-1 rounded-2xl bg-white dark:bg-gray-900 shadow p-4 h-fit">
          <h2 className="font-semibold mb-3">Visible Columns</h2>
          <div className="space-y-2">
            {ALL_COLUMNS.map((c) => (
              <label key={c.key} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(c.key)}
                  onChange={() => toggleColumn(c.key)}
                  className="custom-checkbox"
                />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Table */}
        <section className="md:col-span-3 rounded-2xl bg-white dark:bg-gray-900 shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-3 py-2 w-10">
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={
                        filtered.length > 0 &&
                        filtered.every((s) => selectedIds.includes(s.userId))
                      }
                      className="custom-checkbox"
                    />
                  </th>
                  {ALL_COLUMNS.filter((c) =>
                    visibleColumns.includes(c.key)
                  ).map((c) => (
                    <th
                      key={c.key}
                      className="px-3 py-2 text-left whitespace-nowrap"
                    >
                      {c.label}
                    </th>
                  ))}
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const isEditing = editingRowId === row.userId;
                  return (
                    <tr
                      key={row.userId}
                      className="border-t border-gray-200 dark:border-gray-800"
                    >
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(row.userId)}
                          onChange={() => toggleSelect(row.userId)}
                          className="custom-checkbox"
                        />
                      </td>
                      {ALL_COLUMNS.filter((c) =>
                        visibleColumns.includes(c.key)
                      ).map((col) => (
                        <td key={col.key} className="px-3 py-2 align-top">
                          {isEditing
                            ? renderEditCell(row, col)
                            : renderDisplayCell(row, col)}
                        </td>
                      ))}
                      <td className="px-3 py-2 text-right whitespace-nowrap">
                        {!isEditing ? (
                          <button
                            onClick={() => beginEdit(row)}
                            className="px-3 py-1 rounded border hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            Edit
                          </button>
                        ) : (
                          <div className="inline-flex gap-2">
                            <button
                              onClick={saveEdit}
                              className="px-3 py-1 rounded bg-green-600 text-white"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 rounded border"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={visibleColumns.length + 2}
                      className="px-3 py-8 text-center text-gray-500"
                    >
                      No results
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Bulk Edit Modal */}
      <BulkEditModal
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onApply={applyBulk}
        visibleColumns={visibleColumns}
      />
    </div>
  );
}
