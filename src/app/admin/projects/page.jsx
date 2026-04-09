"use client";

import { useCallback, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { addProject, deleteProject, getProjects, updateProject } from "@/services/projectService";

const initialForm = {
  title: "",
  summary: "",
  description: "",
  status: "ongoing",
  tags: "",
};

export default function AdminProjectsPage() {
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [feedback, setFeedback] = useState("");

  const fetchProjects = useCallback(() => getProjects(), []);
  const { data, loading, error, refresh } = useAsyncData(fetchProjects);
  const projects = data || [];

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFeedback("");

    const payload = {
      title: form.title,
      summary: form.summary,
      description: form.description,
      status: form.status,
      tags: form.tags.split(",").map((item) => item.trim()).filter(Boolean),
    };

    if (editingId) {
      await updateProject(editingId, payload);
      setFeedback("Project updated.");
    } else {
      await addProject(payload);
      setFeedback("Project added.");
    }

    setForm(initialForm);
    setEditingId("");
    await refresh();
  };

  const startEdit = (project) => {
    setEditingId(project.id);
    setForm({
      title: project.title || "",
      summary: project.summary || "",
      description: project.description || "",
      status: project.status || "ongoing",
      tags: (project.tags || []).join(", "),
    });
  };

  const remove = async (projectId) => {
    await deleteProject(projectId);
    await refresh();
  };

  return (
    <main className="min-h-screen bg-gray-100 px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Admin: Projects</h1>

        <form onSubmit={onSubmit} className="bg-white border border-gray-300 rounded p-6 space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" value={form.title} onChange={onChange} placeholder="Title" className="bg-white border border-gray-300 p-3 rounded" />
            <input name="summary" value={form.summary} onChange={onChange} placeholder="Summary" className="bg-white border border-gray-300 p-3 rounded" />
          </div>
          <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="w-full bg-white border border-gray-300 p-3 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="status" value={form.status} onChange={onChange} className="bg-white border border-gray-300 p-3 rounded">
              <option value="ongoing">ongoing</option>
              <option value="review">review</option>
              <option value="completed">completed</option>
            </select>
            <input name="tags" value={form.tags} onChange={onChange} placeholder="tags, comma-separated" className="bg-white border border-gray-300 p-3 rounded" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded border border-blue-800 font-semibold hover:bg-blue-800">{editingId ? "Update" : "Add"} Project</button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(""); setForm(initialForm); }} className="bg-white border border-gray-300 text-gray-900 px-6 py-2 rounded font-semibold hover:bg-gray-100">
                Cancel
              </button>
            )}
          </div>
          {feedback && <p className="text-sm text-gray-700">{feedback}</p>}
        </form>

        {loading && <p className="text-gray-600">Loading projects...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="space-y-4">
          {projects.map((project) => (
            <article key={project.id} className="bg-white border border-gray-300 rounded p-4">
              <h2 className="text-xl font-semibold text-gray-900">{project.title}</h2>
              <p className="text-sm text-gray-700 mt-1">{project.summary}</p>
              <div className="mt-3 flex gap-3">
                <button type="button" onClick={() => startEdit(project)} className="text-blue-700 font-semibold hover:text-blue-800">Edit</button>
                <button type="button" onClick={() => remove(project.id)} className="text-gray-700 font-semibold hover:text-gray-900">Delete</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
