"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";
import GroupCard from "@/components/GroupCard";

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [members, setMembers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupCourt, setNewGroupCourt] = useState("Court 1");
  const [newGroupTime, setNewGroupTime] = useState("06:00 AM - 07:00 AM");
  const [newGroupMemberIds, setNewGroupMemberIds] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupCourt, setEditGroupCourt] = useState("");
  const [editGroupTime, setEditGroupTime] = useState("");
  const [editGroupMemberIds, setEditGroupMemberIds] = useState([]);
  const [addMemberIds, setAddMemberIds] = useState([]);

  useEffect(() => {
    const loadGroups = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/groups", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load groups");
        }
        const data = await response.json();
        setGroups(Array.isArray(data?.groups) ? data.groups : []);
      } catch (err) {
        setError("Unable to load groups right now.");
      } finally {
        setLoading(false);
      }
    };

    const loadMembers = async () => {
      try {
        const response = await fetch("/api/admin/members", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load members");
        }
        const data = await response.json();
        setMembers(Array.isArray(data?.members) ? data.members : []);
      } catch (err) {
        setMembers([]);
      }
    };

    loadGroups();
    loadMembers();
  }, []);

  const handleCreateGroup = async () => {
    const trimmedName = newGroupName.trim();
    if (!trimmedName) return;

    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          court: newGroupCourt,
          time: newGroupTime,
          maxMembers: 6,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to create group");
      }

      const data = await response.json();
      const created = data?.group;

      let createdGroup = created;
      if (created && newGroupMemberIds.length > 0) {
        const patchResponse = await fetch(`/api/groups/${created._id || created.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ addMemberIds: newGroupMemberIds }),
        });
        if (patchResponse.ok) {
          const patched = await patchResponse.json();
          createdGroup = patched?.group || created;
        }
      }

      setGroups((prev) => [createdGroup, ...prev]);
      setNewGroupName("");
      setNewGroupMemberIds([]);
      setShowCreate(false);
    } catch (err) {
      setError("Unable to create group.");
    }
  };

  const openEditGroup = (group) => {
    setActiveModal({ type: "edit", groupId: group._id || group.id });
    setEditGroupName(group.name || "");
    setEditGroupCourt(group.court || "Court 1");
    setEditGroupTime(group.time || "06:00 AM - 07:00 AM");
    const members = Array.isArray(group.members) ? group.members : [];
    const memberIds = members.map((member) =>
      typeof member === "string" ? member : member?._id || member?.id
    );
    setEditGroupMemberIds(memberIds.filter(Boolean));
  };

  const openAddMember = (group) => {
    setActiveModal({ type: "add", groupId: group._id || group.id });
    setAddMemberIds([]);
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditGroupName("");
    setEditGroupCourt("");
    setEditGroupTime("");
    setEditGroupMemberIds([]);
    setAddMemberIds([]);
  };

  const handleSaveGroup = async () => {
    if (!activeModal?.groupId) return;
    const trimmedName = editGroupName.trim();
    if (!trimmedName) return;

    try {
      const response = await fetch(`/api/groups/${activeModal.groupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          court: editGroupCourt,
          time: editGroupTime,
          members: editGroupMemberIds,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update group");
      }

      const data = await response.json();
      const updated = data?.group;

      setGroups((prev) =>
        prev.map((group) =>
          (group._id || group.id) === activeModal.groupId ? updated : group
        )
      );
      closeModal();
    } catch (err) {
      setError("Unable to update group.");
    }
  };

  const handleAddMember = async () => {
    if (!activeModal?.groupId) return;
    if (addMemberIds.length === 0) return;

    try {
      const response = await fetch(`/api/groups/${activeModal.groupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addMemberIds }),
      });

      if (!response.ok) {
        throw new Error("Unable to add members");
      }

      const data = await response.json();
      const updated = data?.group;

      setGroups((prev) =>
        prev.map((group) =>
          (group._id || group.id) === activeModal.groupId ? updated : group
        )
      );
      closeModal();
    } catch (err) {
      setError("Unable to add members.");
    }
  };

  const handleRemoveMember = async (groupId, memberId) => {
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ removeMemberIds: [memberId] }),
      });

      if (!response.ok) {
        throw new Error("Unable to remove member");
      }

      const data = await response.json();
      const updated = data?.group;

      setGroups((prev) =>
        prev.map((group) =>
          (group._id || group.id) === groupId ? updated : group
        )
      );
    } catch (err) {
      setError("Unable to remove member.");
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      const response = await fetch(`/api/groups/${groupId}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Unable to delete group");
      }
      setGroups((prev) => prev.filter((group) => (group._id || group.id) !== groupId));
    } catch (err) {
      setError("Unable to delete group.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background">
      <AdminSidebar />
      <AdminNavbar />

      <main className="ml-64 min-h-screen px-8 pb-12 pt-24">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-headline text-3xl font-black uppercase tracking-tight">
              Groups
            </h2>
            <p className="font-label text-sm tracking-wide text-on-surface-variant">
              Assign members into court groups and manage team rosters.
            </p>
          </div>
          <button
            className="rounded-md bg-(--admin-accent-2) px-4 py-2 text-xs font-semibold text-black"
            onClick={() => setShowCreate((prev) => !prev)}
            type="button"
          >
            + Create Group
          </button>
        </div>

        {showCreate && (
          <div className="mb-10 rounded-xl border border-white/5 bg-[#141414] p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  Group name
                </label>
                <input
                  value={newGroupName}
                  onChange={(event) => setNewGroupName(event.target.value)}
                  placeholder="Group A"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-4 py-2 text-sm text-white placeholder:text-white/30"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  Members
                </label>
                <select
                  multiple
                  value={newGroupMemberIds}
                  onChange={(event) =>
                    setNewGroupMemberIds(
                      Array.from(event.target.selectedOptions).map((option) => option.value)
                    )
                  }
                  className="mt-2 h-28 w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-3 py-2 text-xs text-white"
                >
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} {member.email ? `(${member.email})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                    Court
                  </label>
                  <select
                    value={newGroupCourt}
                    onChange={(event) => setNewGroupCourt(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-3 py-2 text-xs text-white"
                  >
                    <option value="Court 1">Court 1</option>
                    <option value="Court 2">Court 2</option>
                    <option value="Court 3">Court 3</option>
                    <option value="Court 4">Court 4</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                    Time slot
                  </label>
                  <input
                    value={newGroupTime}
                    onChange={(event) => setNewGroupTime(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-3 py-2 text-xs text-white"
                    placeholder="06:00 AM - 07:00 AM"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleCreateGroup}
                  className="rounded-lg bg-(--admin-accent) px-4 py-2 text-xs font-semibold text-black"
                  type="button"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-white/10 bg-[#141414] p-6 text-sm text-white/60">
            Loading groups...
          </div>
        ) : null}

        {!loading && groups.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#141414] p-6 text-sm text-white/60">
            No groups yet. Create your first group.
          </div>
        ) : null}

        {groups.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {groups.map((group, index) => {
              const groupName = group.name || `Group ${index + 1}`;
              const groupMembers = Array.isArray(group.members) ? group.members : [];
              const groupId = group._id || group.id;
              const memberLabels = groupMembers.map((memberId) => {
                const resolved = members.find(
                  (member) => member.id === memberId.toString()
                );
                return resolved || { id: memberId.toString(), name: "Member" };
              });
              const isFull = memberLabels.length >= (group.maxMembers || 6);

              return (
                <GroupCard
                  key={groupId || index}
                  badge={group.court || "Court"}
                  time={group.time || "—"}
                  title={groupName}
                  capacity={memberLabels.length}
                  capacityTotal={group.maxMembers || 6}
                  members={memberLabels}
                  isFull={isFull}
                  onEdit={() => openEditGroup(group)}
                  onAddMember={() => openAddMember(group)}
                  onRemoveMember={(memberId) => handleRemoveMember(groupId, memberId)}
                  onDelete={() => handleDeleteGroup(groupId)}
                />
              );
            })}
          </div>
        ) : null}

        {error ? (
          <div className="mt-8 rounded-xl border border-white/10 bg-[#141414] p-6 text-center">
            <p className="text-sm font-semibold text-error">{error}</p>
          </div>
        ) : null}

        {activeModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#141414] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {activeModal.type === "edit" ? "Edit Group" : "Add Member"}
                  </h3>
                  <p className="text-sm text-white/40">
                    {activeModal.type === "edit"
                      ? "Update group name and members"
                      : "Add a new member to this group"}
                  </p>
                </div>
                <button onClick={closeModal} className="text-white/40 hover:text-white">
                  ✕
                </button>
              </div>

              {activeModal.type === "edit" ? (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                      Group name
                    </label>
                    <input
                      value={editGroupName}
                      onChange={(event) => setEditGroupName(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-4 py-2 text-sm text-white placeholder:text-white/30"
                      placeholder="Group A"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                      Members
                    </label>
                    <select
                      multiple
                      value={editGroupMemberIds}
                      onChange={(event) =>
                        setEditGroupMemberIds(
                          Array.from(event.target.selectedOptions).map((option) => option.value)
                        )
                      }
                      className="mt-2 h-28 w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-3 py-2 text-xs text-white"
                    >
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name} {member.email ? `(${member.email})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                        Court
                      </label>
                      <select
                        value={editGroupCourt}
                        onChange={(event) => setEditGroupCourt(event.target.value)}
                        className="mt-2 w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-3 py-2 text-xs text-white"
                      >
                        <option value="Court 1">Court 1</option>
                        <option value="Court 2">Court 2</option>
                        <option value="Court 3">Court 3</option>
                        <option value="Court 4">Court 4</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                        Time slot
                      </label>
                      <input
                        value={editGroupTime}
                        onChange={(event) => setEditGroupTime(event.target.value)}
                        className="mt-2 w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-3 py-2 text-xs text-white"
                        placeholder="06:00 AM - 07:00 AM"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                    Add members
                  </label>
                  <select
                    multiple
                    value={addMemberIds}
                    onChange={(event) =>
                      setAddMemberIds(
                        Array.from(event.target.selectedOptions).map((option) => option.value)
                      )
                    }
                    className="mt-2 h-28 w-full rounded-lg border border-white/10 bg-[#0f0f0f] px-3 py-2 text-xs text-white"
                  >
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} {member.email ? `(${member.email})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70"
                >
                  Cancel
                </button>
                <button
                  onClick={activeModal.type === "edit" ? handleSaveGroup : handleAddMember}
                  className="rounded-lg bg-(--admin-accent) px-4 py-2 text-sm font-semibold text-black"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
