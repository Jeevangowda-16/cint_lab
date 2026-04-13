"use client";

import { useCallback, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { addProject, deleteProject, getProjects, updateProject } from "@/services/projectService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Project" : "Add Project"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="title" value={form.title} onChange={onChange} placeholder="Title" />
            <Input name="summary" value={form.summary} onChange={onChange} placeholder="Summary" />
          </div>
          <Textarea name="description" value={form.description} onChange={onChange} placeholder="Description" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={form.status} onValueChange={(value) => setForm((previous) => ({ ...previous, status: value }))}>
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ongoing">ongoing</SelectItem>
                <SelectItem value="review">review</SelectItem>
                <SelectItem value="completed">completed</SelectItem>
              </SelectContent>
            </Select>
            <Input name="tags" value={form.tags} onChange={onChange} placeholder="tags, comma-separated" />
          </div>
          <div className="flex gap-3">
            <Button type="submit">{editingId ? "Update" : "Add"} Project</Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={() => { setEditingId(""); setForm(initialForm); }}>
                Cancel
              </Button>
            )}
          </div>
          {feedback && <p className="text-sm text-gray-700">{feedback}</p>}
            </form>
          </CardContent>
        </Card>

        {loading && <p className="text-gray-600">Loading projects...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold text-gray-900">{project.title}</h2>
                <p className="text-sm text-gray-700 mt-1">{project.summary}</p>
                <div className="mt-3 flex gap-3">
                  <Button type="button" variant="link" className="px-0" onClick={() => startEdit(project)}>Edit</Button>
                  <Button type="button" variant="link" className="px-0 text-gray-700" onClick={() => remove(project.id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
