"use client";

import { useCallback, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { addIntern, deleteIntern, getInterns, updateIntern } from "@/services/internService";
import { getProjects } from "@/services/projectService";
import { addTeamMember, deleteTeamMember, getTeamMembers, updateTeamMember } from "@/services/teamService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialInternForm = {
  name: "",
  program: "",
  cohort: "",
  projectId: "",
  college: "",
  email: "",
  phone: "",
  github: "",
  linkedin: "",
};

const initialTeamForm = {
  name: "",
  designation: "",
  email: "",
  profileUrl: "",
  imageUrl: "",
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
      imageUrl: teamForm.imageUrl,
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
      imageUrl: member.imageUrl || "",
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
      status: "active",
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
      projectId: intern.projectId || "",
      college: intern.college || "",
      email: intern.email || "",
      phone: intern.phone || "",
      github: intern.github || "",
      linkedin: intern.linkedin || "",
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

        <div className="mb-6">
          <div className="segmented-tabs">
            <Button
              type="button"
              onClick={() => setActiveTab("team")}
              variant="ghost"
              className={`segmented-tab-btn ${
                activeTab === "team"
                  ? "segmented-tab-btn-active"
                  : ""
              }`}
            >
              Team
            </Button>
            <Button
              type="button"
              onClick={() => setActiveTab("interns")}
              variant="ghost"
              className={`segmented-tab-btn ${
                activeTab === "interns"
                  ? "segmented-tab-btn-active"
                  : ""
              }`}
            >
              Interns
            </Button>
          </div>
        </div>

        {activeTab === "team" && (
          <section>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingTeamId ? "Edit Team Member" : "Add Team Member"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onTeamSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="name" value={teamForm.name} onChange={onTeamChange} placeholder="Name" />
                <Input name="designation" value={teamForm.designation} onChange={onTeamChange} placeholder="Designation" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="email" value={teamForm.email} onChange={onTeamChange} placeholder="Email" />
                <Input name="profileUrl" value={teamForm.profileUrl} onChange={onTeamChange} placeholder="Profile URL" />
              </div>
              <Input
                name="imageUrl"
                value={teamForm.imageUrl}
                onChange={onTeamChange}
                placeholder="Photo URL"
              />
              <div className="flex gap-3">
                <Button type="submit">{editingTeamId ? "Update" : "Add"} Member</Button>
                {editingTeamId && <Button type="button" variant="outline" onClick={() => { setEditingTeamId(""); setTeamForm(initialTeamForm); }}>Cancel</Button>}
              </div>
              {teamFeedback && <p className="text-sm text-gray-700">{teamFeedback}</p>}
                </form>
              </CardContent>
            </Card>

            {teamLoading && <p className="text-gray-600">Loading team...</p>}
            {teamError && <p className="text-red-600">{teamError}</p>}

            <div className="space-y-4">
              {members.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    {member.imageUrl && (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="mb-3 h-24 w-24 rounded border border-gray-300 object-cover"
                      />
                    )}
                    <h2 className="text-xl font-semibold text-gray-900">{member.name}</h2>
                    <p className="text-sm text-gray-700">{member.designation}</p>
                    {member.email && <p className="text-sm text-gray-700">{member.email}</p>}
                    {member.profileUrl && <p className="text-sm text-gray-700">{member.profileUrl}</p>}
                    <div className="mt-3 flex gap-3">
                      <Button type="button" variant="link" className="px-0" onClick={() => startEditTeam(member)}>Edit</Button>
                      <Button type="button" variant="link" className="px-0 text-gray-700" onClick={() => removeTeam(member.id)}>Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {activeTab === "interns" && (
          <section>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingInternId ? "Edit Intern" : "Add Intern"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onInternSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="name" value={internForm.name} onChange={onInternChange} placeholder="Name" />
                <Input name="program" value={internForm.program} onChange={onInternChange} placeholder="Program" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input name="cohort" value={internForm.cohort} onChange={onInternChange} placeholder="Cohort" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="college" value={internForm.college} onChange={onInternChange} placeholder="College" />
                <Input name="email" value={internForm.email} onChange={onInternChange} placeholder="Email" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="phone" value={internForm.phone} onChange={onInternChange} placeholder="Phone" />
                <Input name="github" value={internForm.github} onChange={onInternChange} placeholder="GitHub URL" />
              </div>
              <Input name="linkedin" value={internForm.linkedin} onChange={onInternChange} placeholder="LinkedIn URL" />
              <Select value={internForm.projectId || "none"} onValueChange={(value) => setInternForm((previous) => ({ ...previous, projectId: value === "none" ? "" : value }))}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select project</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-3">
                <Button type="submit">{editingInternId ? "Update" : "Add"} Intern</Button>
                {editingInternId && <Button type="button" variant="outline" onClick={() => { setEditingInternId(""); setInternForm(initialInternForm); }}>Cancel</Button>}
              </div>
                </form>
              </CardContent>
            </Card>

            {internLoading && <p className="text-gray-600">Loading interns...</p>}
            {internError && <p className="text-red-600">{internError}</p>}

            <div className="space-y-4">
              {interns.map((intern) => (
                <Card key={intern.id}>
                  <CardContent className="p-4">
                    <h2 className="text-xl font-semibold text-gray-900">{intern.name}</h2>
                    <p className="text-sm text-gray-700">{intern.program} • {intern.cohort}</p>
                    {intern.college && <p className="text-sm text-gray-700">{intern.college}</p>}
                    {intern.email && <p className="text-sm text-gray-700">{intern.email}</p>}
                    {intern.phone && <p className="text-sm text-gray-700">{intern.phone}</p>}
                    {intern.github && <p className="text-sm text-gray-700">{intern.github}</p>}
                    {intern.linkedin && <p className="text-sm text-gray-700">{intern.linkedin}</p>}
                    <div className="mt-3 flex gap-3">
                      <Button type="button" variant="link" className="px-0" onClick={() => startEditIntern(intern)}>Edit</Button>
                      <Button type="button" variant="link" className="px-0 text-gray-700" onClick={() => removeIntern(intern.id)}>Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}