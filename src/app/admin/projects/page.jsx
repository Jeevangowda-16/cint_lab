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
    <main className="min-h-screen bg-gray-50 px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin: Projects</h1>

        <form onSubmit={onSubmit} className="bg-white border border-gray-100 rounded-xl p-6 space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" value={form.title} onChange={onChange} placeholder="Title" className="bg-gray-50 border border-gray-200 p-3 rounded-lg" />
            <input name="summary" value={form.summary} onChange={onChange} placeholder="Summary" className="bg-gray-50 border border-gray-200 p-3 rounded-lg" />
          </div>
          <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="status" value={form.status} onChange={onChange} className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
              <option value="ongoing">ongoing</option>
              <option value="review">review</option>
              <option value="completed">completed</option>
            </select>
            <input name="tags" value={form.tags} onChange={onChange} placeholder="tags, comma-separated" className="bg-gray-50 border border-gray-200 p-3 rounded-lg" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">{editingId ? "Update" : "Add"} Project</button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(""); setForm(initialForm); }} className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-semibold">
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
            <article key={project.id} className="bg-white border border-gray-100 rounded-lg p-4">
              <h2 className="text-xl font-bold text-gray-900">{project.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{project.summary}</p>
              <div className="mt-3 flex gap-3">
                <button type="button" onClick={() => startEdit(project)} className="text-blue-700 font-semibold">Edit</button>
                <button type="button" onClick={() => remove(project.id)} className="text-red-700 font-semibold">Delete</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
