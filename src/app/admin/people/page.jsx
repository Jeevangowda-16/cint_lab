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
    if (editingInternId) {
      await updateIntern(editingInternId, internForm);
    } else {
      await addIntern(internForm);
    }
    setInternForm(initialInternForm);
    setEditingInternId("");
    await refreshInterns();
  };

  const startEditIntern = (intern) => {
    setEditingInternId(intern.id);
    setInternForm({
      name: intern.name || "",
      program: intern.program || "",
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
    <main className="min-h-screen bg-gray-50 px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin: People</h1>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("team")}
            className={`px-5 py-2 rounded-lg font-semibold ${
              activeTab === "team" ? "bg-blue-700 text-white" : "bg-white border border-gray-200 text-gray-700"
            }`}
          >
            Team
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("interns")}
            className={`px-5 py-2 rounded-lg font-semibold ${
              activeTab === "interns" ? "bg-blue-700 text-white" : "bg-white border border-gray-200 text-gray-700"
            }`}
          >
            Interns
          </button>
        </div>

        {activeTab === "team" && (
          <section>
            <form onSubmit={onTeamSubmit} className="bg-white border border-gray-100 rounded-xl p-6 space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" value={teamForm.name} onChange={onTeamChange} placeholder="Name" className="bg-gray-50 border border-gray-200 p-3 rounded-lg" />
                <input name="designation" value={teamForm.designation} onChange={onTeamChange} placeholder="Designation" className="bg-gray-50 border border-gray-200 p-3 rounded-lg" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="email" value={teamForm.email} onChange={onTeamChange} placeholder="Email" className="bg-gray-50 border border-gray-200 p-3 rounded-lg" />
                <input name="profileUrl" value={teamForm.profileUrl} onChange={onTeamChange} placeholder="Profile URL" className="bg-gray-50 border border-gray-200 p-3 rounded-lg" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">{editingTeamId ? "Update" : "Add"} Member</button>
                {editingTeamId && <button type="button" onClick={() => { setEditingTeamId(""); setTeamForm(initialTeamForm); }} className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-semibold">Cancel</button>}
              </div>
              {teamFeedback && <p className="text-sm text-gray-700">{teamFeedback}</p>}
            </form>

            {teamLoading && <p className="text-gray-600">Loading team...</p>}
            {teamError && <p className="text-red-600">{teamError}</p>}

            <div className="space-y-4">
              {members.map((member) => (
                <article key={member.id} className="bg-white border border-gray-100 rounded-lg p-4">
                  <h2 className="text-xl font-bold text-gray-900">{member.name}</h2>
                  <p className="text-sm text-gray-600">{member.designation}</p>
                  {member.email && <p className="text-sm text-gray-600">{member.email}</p>}
                  {member.profileUrl && <p className="text-sm text-gray-600">{member.profileUrl}</p>}
                  <div className="mt-3 flex gap-3">
                    <button type="button" onClick={() => startEditTeam(member)} className="text-blue-700 font-semibold">Edit</button>
                    <button type="button" onClick={() => removeTeam(member.id)} className="text-red-700 font-semibold">Delete</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === "interns" && (
          <section>
            <form onSubmit={onInternSubmit} className="bg-white border border-gray-100 rounded-xl p-6 space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" value={internForm.name} onChange={onInternChange} placeholder="Name" className="bg-gray-50 border border-gray-200 p-3 rounded-lg" />
                <input name="program" value={internForm.program} onChange={onInternChange} placeholder="Program" className="bg-gray-50 border border-gray-200 p-3 rounded-lg" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="cohort" value={internForm.cohort} onChange={onInternChange} placeholder="Cohort" className="bg-gray-50 border border-gray-200 p-3 rounded-lg" />
                <input name="mentorId" value={internForm.mentorId} onChange={onInternChange} placeholder="Mentor ID" className="bg-gray-50 border border-gray-200 p-3 rounded-lg" />
                <select name="status" value={internForm.status} onChange={onInternChange} className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                  <option value="active">active</option>
                  <option value="completed">completed</option>
                </select>
              </div>
              <select name="projectId" value={internForm.projectId} onChange={onInternChange} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg">
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
              <textarea name="focusArea" value={internForm.focusArea} onChange={onInternChange} placeholder="Focus area" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg" />
              <div className="flex gap-3">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">{editingInternId ? "Update" : "Add"} Intern</button>
                {editingInternId && <button type="button" onClick={() => { setEditingInternId(""); setInternForm(initialInternForm); }} className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-semibold">Cancel</button>}
              </div>
            </form>

            {internLoading && <p className="text-gray-600">Loading interns...</p>}
            {internError && <p className="text-red-600">{internError}</p>}

            <div className="space-y-4">
              {interns.map((intern) => (
                <article key={intern.id} className="bg-white border border-gray-100 rounded-lg p-4">
                  <h2 className="text-xl font-bold text-gray-900">{intern.name}</h2>
                  <p className="text-sm text-gray-600">{intern.program} • {intern.cohort}</p>
                  <div className="mt-3 flex gap-3">
                    <button type="button" onClick={() => startEditIntern(intern)} className="text-blue-700 font-semibold">Edit</button>
                    <button type="button" onClick={() => removeIntern(intern.id)} className="text-red-700 font-semibold">Delete</button>
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