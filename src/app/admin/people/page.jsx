"use client";

import { useCallback, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { addIntern, deleteIntern, getInterns, updateIntern } from "@/services/internService";
import { getProjects } from "@/services/projectService";
import { addTeamMember, deleteTeamMember, getTeamMembers, updateTeamMember } from "@/services/teamService";

const initialInternForm = {
  name: "",
  program: "",
  cohort: "",
  mentorId: "",
  focusArea: "",
  projectId: "",
  status: "active",
};

const initialTeamForm = {
  name: "",
  designation: "",
  email: "",
  profileUrl: "",
};

function deriveRoleCategory(designation) {
  const value = String(designation || "").toLowerCase();
  if (value.includes("alumni")) return "alumni";
  if (value.includes("professor")) return "lead";
  return "associate";
}

export default function AdminPeoplePage() {
  const [activeTab, setActiveTab] = useState("team");

  const [teamForm, setTeamForm] = useState(initialTeamForm);
  const [editingTeamId, setEditingTeamId] = useState("");
  const [teamFeedback, setTeamFeedback] = useState("");

  const [internForm, setInternForm] = useState(initialInternForm);
  const [editingInternId, setEditingInternId] = useState("");

  const fetchTeam = useCallback(() => getTeamMembers({ roleCategory: "all" }), []);
  const fetchInterns = useCallback(() => getInterns({ status: "all", cohort: "all" }), []);
  const fetchProjects = useCallback(() => getProjects(), []);

  const {
    data: teamData,
    loading: teamLoading,
    error: teamError,
    refresh: refreshTeam,
  } = useAsyncData(fetchTeam);

  const {
    data: internData,
    loading: internLoading,
    error: internError,
    refresh: refreshInterns,
  } = useAsyncData(fetchInterns);

  const { data: projectData } = useAsyncData(fetchProjects);

  const members = teamData || [];
  const interns = internData || [];
  const projects = projectData || [];

  const onTeamChange = (event) => {
    const { name, value, type, checked } = event.target;
    setTeamForm((previous) => ({ ...previous, [name]: type === "checkbox" ? checked : value }));
  };

  const onTeamSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      name: teamForm.name,
      designation: teamForm.designation,
      email: teamForm.email,
      profileUrl: teamForm.profileUrl,
      roleCategory: deriveRoleCategory(teamForm.designation),
      active: true,
    };

    if (editingTeamId) {
      await updateTeamMember(editingTeamId, payload);
      setTeamFeedback("Team member updated.");
    } else {
      await addTeamMember(payload);
      setTeamFeedback("Team member added.");
    }

    setTeamForm(initialTeamForm);
    setEditingTeamId("");
    await refreshTeam();
  };

  const startEditTeam = (member) => {
    setEditingTeamId(member.id);
    setTeamForm({
      name: member.name || "",
      designation: member.designation || "",
      email: member.email || "",
      profileUrl: member.profileUrl || "",
    });
    setActiveTab("team");
  };

  const removeTeam = async (memberId) => {
    await deleteTeamMember(memberId);
    await refreshTeam();
  };

  const onInternChange = (event) => {
    const { name, value } = event.target;
    setInternForm((previous) => ({ ...previous, [name]: value }));
  };

  const onInternSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...internForm,
      project: internForm.program,
    };

    if (editingInternId) {
      await updateIntern(editingInternId, payload);
    } else {
      await addIntern(payload);
    }
    setInternForm(initialInternForm);
    setEditingInternId("");
    await refreshInterns();
  };

  const startEditIntern = (intern) => {
    setEditingInternId(intern.id);
    setInternForm({
      name: intern.name || "",
      program: intern.program || intern.project || "",
      cohort: intern.cohort || "",
      mentorId: intern.mentorId || "",
      focusArea: intern.focusArea || "",
      projectId: intern.projectId || "",
      status: intern.status || "active",
    });
    setActiveTab("interns");
  };

  const removeIntern = async (internId) => {
    await deleteIntern(internId);
    await refreshInterns();
  };

  return (
    <main className="min-h-screen bg-gray-100 px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Admin: People</h1>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("team")}
            className={`px-5 py-2 rounded font-semibold border ${
              activeTab === "team" ? "bg-blue-700 text-white border-blue-800" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Team
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("interns")}
            className={`px-5 py-2 rounded font-semibold border ${
              activeTab === "interns" ? "bg-blue-700 text-white border-blue-800" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Interns
          </button>
        </div>

        {activeTab === "team" && (
          <section>
            <form onSubmit={onTeamSubmit} className="bg-white border border-gray-300 rounded p-6 space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" value={teamForm.name} onChange={onTeamChange} placeholder="Name" className="bg-white border border-gray-300 p-3 rounded" />
                <input name="designation" value={teamForm.designation} onChange={onTeamChange} placeholder="Designation" className="bg-white border border-gray-300 p-3 rounded" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="email" value={teamForm.email} onChange={onTeamChange} placeholder="Email" className="bg-white border border-gray-300 p-3 rounded" />
                <input name="profileUrl" value={teamForm.profileUrl} onChange={onTeamChange} placeholder="Profile URL" className="bg-white border border-gray-300 p-3 rounded" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded border border-blue-800 font-semibold hover:bg-blue-800">{editingTeamId ? "Update" : "Add"} Member</button>
                {editingTeamId && <button type="button" onClick={() => { setEditingTeamId(""); setTeamForm(initialTeamForm); }} className="bg-white border border-gray-300 text-gray-900 px-6 py-2 rounded font-semibold hover:bg-gray-100">Cancel</button>}
              </div>
              {teamFeedback && <p className="text-sm text-gray-700">{teamFeedback}</p>}
            </form>

            {teamLoading && <p className="text-gray-600">Loading team...</p>}
            {teamError && <p className="text-red-600">{teamError}</p>}

            <div className="space-y-4">
              {members.map((member) => (
                <article key={member.id} className="bg-white border border-gray-300 rounded p-4">
                  <h2 className="text-xl font-semibold text-gray-900">{member.name}</h2>
                  <p className="text-sm text-gray-700">{member.designation}</p>
                  {member.email && <p className="text-sm text-gray-700">{member.email}</p>}
                  {member.profileUrl && <p className="text-sm text-gray-700">{member.profileUrl}</p>}
                  <div className="mt-3 flex gap-3">
                    <button type="button" onClick={() => startEditTeam(member)} className="text-blue-700 font-semibold hover:text-blue-800">Edit</button>
                    <button type="button" onClick={() => removeTeam(member.id)} className="text-gray-700 font-semibold hover:text-gray-900">Delete</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === "interns" && (
          <section>
            <form onSubmit={onInternSubmit} className="bg-white border border-gray-300 rounded p-6 space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" value={internForm.name} onChange={onInternChange} placeholder="Name" className="bg-white border border-gray-300 p-3 rounded" />
                <input name="program" value={internForm.program} onChange={onInternChange} placeholder="Program" className="bg-white border border-gray-300 p-3 rounded" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="cohort" value={internForm.cohort} onChange={onInternChange} placeholder="Cohort" className="bg-white border border-gray-300 p-3 rounded" />
                <input name="mentorId" value={internForm.mentorId} onChange={onInternChange} placeholder="Mentor ID" className="bg-white border border-gray-300 p-3 rounded" />
                <select name="status" value={internForm.status} onChange={onInternChange} className="bg-white border border-gray-300 p-3 rounded">
                  <option value="active">active</option>
                  <option value="completed">completed</option>
                </select>
              </div>
              <select name="projectId" value={internForm.projectId} onChange={onInternChange} className="w-full bg-white border border-gray-300 p-3 rounded">
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
              <textarea name="focusArea" value={internForm.focusArea} onChange={onInternChange} placeholder="Focus area" className="w-full bg-white border border-gray-300 p-3 rounded" />
              <div className="flex gap-3">
                <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded border border-blue-800 font-semibold hover:bg-blue-800">{editingInternId ? "Update" : "Add"} Intern</button>
                {editingInternId && <button type="button" onClick={() => { setEditingInternId(""); setInternForm(initialInternForm); }} className="bg-white border border-gray-300 text-gray-900 px-6 py-2 rounded font-semibold hover:bg-gray-100">Cancel</button>}
              </div>
            </form>

            {internLoading && <p className="text-gray-600">Loading interns...</p>}
            {internError && <p className="text-red-600">{internError}</p>}

            <div className="space-y-4">
              {interns.map((intern) => (
                <article key={intern.id} className="bg-white border border-gray-300 rounded p-4">
                  <h2 className="text-xl font-semibold text-gray-900">{intern.name}</h2>
                  <p className="text-sm text-gray-700">{intern.program} • {intern.cohort}</p>
                  <div className="mt-3 flex gap-3">
                    <button type="button" onClick={() => startEditIntern(intern)} className="text-blue-700 font-semibold hover:text-blue-800">Edit</button>
                    <button type="button" onClick={() => removeIntern(intern.id)} className="text-gray-700 font-semibold hover:text-gray-900">Delete</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}