'use client'

import { useEffect, useMemo, useState } from 'react'
import AdminNavbar from '@/components/AdminNavbar'
import AdminSidebar from '@/components/AdminSidebar'

/**
 * @typedef {'solo' | 'group'} MemberType
 * @typedef {'active' | 'pending' | 'expired'} MemberStatus
 *
 * @typedef {Object} Member
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {MemberType} type
 * @property {MemberStatus} status
 * @property {string=} groupId
 * @property {string=} groupName
 * @property {string=} timeSlot
 * @property {string=} court
 * @property {'paid' | 'due'} paymentStatus
 * @property {string=} paymentDate
 * @property {string} joinedAt
 * @property {string} avatarInitials
 *
 * @typedef {Object} Group
 * @property {string} id
 * @property {string} name
 * @property {string} court
 * @property {string} timeSlot
 * @property {string[]} members
 * @property {number} maxCapacity
 */

const TABS = ['All', 'Solo Members', 'Group Members', 'Pending', 'Expired']
const MONTHLY_FEE = 1500

export default function AdminMembersPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [groups, setGroups] = useState([])
  const [showAddMember, setShowAddMember] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberPhone, setNewMemberPhone] = useState('')
  const [newMemberPrice, setNewMemberPrice] = useState('1500')
  const [newMemberGroupId, setNewMemberGroupId] = useState('')
  const [formError, setFormError] = useState('')
  const [showEditMember, setShowEditMember] = useState(false)
  const [showAssignMember, setShowAssignMember] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editError, setEditError] = useState('')
  const [assignGroupId, setAssignGroupId] = useState('')
  const [assignError, setAssignError] = useState('')

  const normalizeMember = (member) => {
    const isGrouped = Boolean(member.groupId)
    return {
      ...member,
      type: isGrouped ? 'group' : 'solo',
      status: member.status || 'active',
      paymentStatus: member.paymentStatus || 'paid',
      paymentDate: member.paymentDate
        ? new Date(member.paymentDate).toLocaleDateString()
        : null,
      joinedAt: member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : '—',
      avatarInitials:
        member.avatarInitials ||
        (member.name
          ? member.name
              .split(' ')
              .filter(Boolean)
              .map((part) => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
          : 'MB'),
    }
  }

  const loadMembers = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/members', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('Failed to load members')
      }
      const data = await response.json()
      const normalized = Array.isArray(data?.members) ? data.members : []
      setMembers(normalized.map((member) => normalizeMember(member)))
    } catch (err) {
      setError('Unable to load members right now.')
    } finally {
      setLoading(false)
    }
  }

  const loadGroups = async () => {
    try {
      const response = await fetch('/api/groups', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('Failed to load groups')
      }
      const data = await response.json()
      setGroups(Array.isArray(data?.groups) ? data.groups : [])
    } catch (err) {
      setGroups([])
    }
  }

  useEffect(() => {
    loadMembers()
    loadGroups()
  }, [])

  const resetNewMember = () => {
    setNewMemberName('')
    setNewMemberEmail('')
    setNewMemberPhone('')
    setNewMemberPrice('1500')
    setNewMemberGroupId('')
    setFormError('')
  }

  const handleAddMember = async () => {
    const trimmedName = newMemberName.trim()
    const trimmedEmail = newMemberEmail.trim()
    const trimmedPhone = newMemberPhone.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\d{10}$/

    if (!trimmedName || !trimmedEmail || !trimmedPhone) {
      setFormError('Name, email, and phone are required.')
      return
    }

    if (!emailRegex.test(trimmedEmail)) {
      setFormError('Enter a valid email address.')
      return
    }

    if (!phoneRegex.test(trimmedPhone)) {
      setFormError('Enter a 10-digit phone number.')
      return
    }

    setFormError('')
    try {
      const response = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          phone: `+91${trimmedPhone}`,
          price: Number(newMemberPrice) || 0,
          groupId: newMemberGroupId || null,
          plan: 'cash',
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Unable to add member')
      }

      const data = await response.json().catch(() => null)
      if (data?.member) {
        const nextMember = normalizeMember(data.member)
        setMembers((prev) => [nextMember, ...prev])
      } else {
        await loadMembers()
      }
      setShowAddMember(false)
      resetNewMember()
    } catch (err) {
      setFormError(err?.message || 'Unable to add member right now.')
    }
  }

  const openEditModal = (member) => {
    setSelectedMember(member)
    setEditName(member.name || '')
    setEditEmail(member.email || '')
    const phoneValue = member.phone ? member.phone.replace(/\D/g, '').slice(-10) : ''
    setEditPhone(phoneValue)
    setEditError('')
    setShowEditMember(true)
  }

  const openAssignModal = (member) => {
    setSelectedMember(member)
    setAssignGroupId(member.groupId || '')
    setAssignError('')
    setShowAssignMember(true)
  }

  const handleEditMember = async () => {
    const trimmedName = editName.trim()
    const trimmedEmail = editEmail.trim()
    const trimmedPhone = editPhone.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\d{10}$/

    if (!selectedMember?.membershipId) {
      setEditError('Membership not found.')
      return
    }

    if (!trimmedName || !trimmedEmail || !trimmedPhone) {
      setEditError('Name, email, and phone are required.')
      return
    }

    if (!emailRegex.test(trimmedEmail)) {
      setEditError('Enter a valid email address.')
      return
    }

    if (!phoneRegex.test(trimmedPhone)) {
      setEditError('Enter a 10-digit phone number.')
      return
    }

    setEditError('')
    try {
      const response = await fetch('/api/admin/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          membershipId: selectedMember.membershipId,
          name: trimmedName,
          email: trimmedEmail,
          phone: `+91${trimmedPhone}`,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Unable to update member')
      }

      const data = await response.json().catch(() => null)
      if (data?.member) {
        const nextMember = normalizeMember(data.member)
        setMembers((prev) =>
          prev.map((member) =>
            member.membershipId === nextMember.membershipId ? nextMember : member
          )
        )
      } else {
        await loadMembers()
      }
      setShowEditMember(false)
    } catch (err) {
      setEditError(err?.message || 'Unable to update member right now.')
    }
  }

  const handleAssignGroup = async () => {
    if (!selectedMember?.membershipId) {
      setAssignError('Membership not found.')
      return
    }

    setAssignError('')
    try {
      const response = await fetch('/api/admin/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          membershipId: selectedMember.membershipId,
          groupId: assignGroupId || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Unable to assign group')
      }

      const data = await response.json().catch(() => null)
      if (data?.member) {
        const nextMember = normalizeMember(data.member)
        setMembers((prev) =>
          prev.map((member) =>
            member.membershipId === nextMember.membershipId ? nextMember : member
          )
        )
      } else {
        await loadMembers()
      }
      setShowAssignMember(false)
    } catch (err) {
      setAssignError(err?.message || 'Unable to assign group right now.')
    }
  }

  const handleDeleteMember = async (member) => {
    if (!member?.membershipId) return
    const confirmed = window.confirm(`Delete membership for ${member.name}?`)
    if (!confirmed) return

    try {
      const response = await fetch('/api/admin/members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipId: member.membershipId }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Unable to delete membership')
      }

      const data = await response.json().catch(() => null)
      if (data?.membershipId) {
        setMembers((prev) =>
          prev.filter((member) => member.membershipId !== data.membershipId)
        )
      } else {
        await loadMembers()
      }
    } catch (err) {
      setError(err?.message || 'Unable to delete membership right now.')
    }
  }

  const stats = useMemo(() => {
    const totalMembers = members.length
    const activeMembers = members.filter((member) => member.status === 'active')
    const pendingMembers = members.filter((member) => member.status === 'pending')
    const revenue = members.filter((member) => member.paymentStatus === 'paid').length * MONTHLY_FEE

    return {
      totalMembers,
      activeThisMonth: activeMembers.length,
      pendingApproval: pendingMembers.length,
      revenue,
    }
  }, [members])

  const filteredMembers = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()

    return members.filter((member) => {
      const matchesSearch =
        !normalizedSearch ||
        member.name.toLowerCase().includes(normalizedSearch) ||
        member.email.toLowerCase().includes(normalizedSearch)

      if (!matchesSearch) return false

      if (activeTab === 'Solo Members') return member.type === 'solo'
      if (activeTab === 'Group Members') return member.type === 'group'
      if (activeTab === 'Pending') return member.status === 'pending'
      if (activeTab === 'Expired') return member.status === 'expired'

      return true
    })
  }, [activeTab, members, searchQuery])


  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <AdminSidebar />
      <AdminNavbar />

      <main className="ml-64 px-6 pb-24 pt-24">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Members</h1>
            <p className="mt-2 text-sm text-zinc-500">
              Manage member registrations, group assignments, and monthly payments
            </p>
          </div>
          <button
            className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-black hover:bg-green-400"
            onClick={() => setShowAddMember(true)}
          >
            + Add Member
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Members" value={stats.totalMembers} colorClass="text-cyan-400" />
          <StatCard
            label="Active This Month"
            value={stats.activeThisMonth}
            colorClass="text-green-400"
          />
          <StatCard
            label="Pending Approval"
            value={stats.pendingApproval}
            colorClass="text-orange-400"
          />
          <StatCard
            label="Revenue (Month)"
            value={`₹${stats.revenue.toLocaleString('en-IN')}`}
            colorClass="text-white"
          />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-3">
          <div className="flex flex-wrap gap-6">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold transition ${
                  activeTab === tab
                    ? 'border-b-2 border-green-400 text-white'
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search members or emails"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-white placeholder:text-zinc-500 md:w-72"
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="text-xs uppercase text-zinc-500">
              <tr className="border-b border-zinc-800">
                <th className="px-4 py-4">Member</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Group</th>
                <th className="px-4 py-4">Time Slot</th>
                <th className="px-4 py-4">Court</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Payment</th>
                <th className="px-4 py-4">Joined</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-sm text-zinc-500">
                    Loading members...
                  </td>
                </tr>
              ) : null}
              {!loading && filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-sm text-zinc-500">
                    No members found.
                  </td>
                </tr>
              ) : null}
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-b border-zinc-800 transition hover:bg-white/5">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold">
                        {member.avatarInitials}
                      </div>
                      <div>
                        <p className="font-medium text-white">{member.name}</p>
                        <p className="text-xs text-zinc-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                        member.type === 'solo'
                          ? 'border-orange-500/50 text-orange-300'
                          : 'border-cyan-500/50 text-cyan-300'
                      }`}
                    >
                      {member.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-zinc-200">{member.groupName || '—'}</td>
                  <td className="px-4 py-4 text-sm text-zinc-200">{member.timeSlot || '—'}</td>
                  <td className="px-4 py-4">
                    {member.court ? (
                      <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-200">
                        {member.court}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-500">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={member.status} />
                  </td>
                  <td className="px-4 py-4">
                    {member.paymentStatus === 'paid' ? (
                      <span className="text-sm font-semibold text-green-400">Paid</span>
                    ) : (
                      <div className="text-sm text-red-400">
                        <p className="font-semibold">Due</p>
                        <p className="text-xs text-red-300">{member.paymentDate || '—'}</p>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-zinc-200">{member.joinedAt}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <ActionButton label="Edit" onClick={() => openEditModal(member)}>
                        <span aria-hidden>✏️</span>
                      </ActionButton>
                      <ActionButton label="Assign group" onClick={() => openAssignModal(member)}>
                        <span aria-hidden>👥</span>
                      </ActionButton>
                      <ActionButton
                        label="Remove"
                        danger
                        onClick={() => handleDeleteMember(member)}
                      >
                        <span aria-hidden>🗑️</span>
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {showAddMember ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Add Member (Cash)</h3>
                  <p className="text-sm text-zinc-500">
                    Add a paid member and optionally assign a group.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddMember(false)
                    resetNewMember()
                  }}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Name
                  </label>
                  <input
                    value={newMemberName}
                    onChange={(event) => setNewMemberName(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-white"
                    placeholder="Member name"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Email
                  </label>
                  <input
                    value={newMemberEmail}
                    onChange={(event) => setNewMemberEmail(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-white"
                    placeholder="member@email.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Phone
                  </label>
                  <div className="mt-2 flex items-center rounded-lg border border-zinc-800 bg-zinc-950 px-3">
                    <span className="text-sm text-zinc-400">+91</span>
                    <input
                      value={newMemberPhone}
                      onChange={(event) =>
                        setNewMemberPhone(event.target.value.replace(/\D/g, '').slice(0, 10))
                      }
                      className="ml-2 w-full bg-transparent py-2 text-sm text-white outline-none"
                      placeholder="9000000000"
                      inputMode="numeric"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Cash amount
                  </label>
                  <input
                    value={newMemberPrice}
                    onChange={(event) => setNewMemberPrice(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-white"
                    placeholder="1500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Assign group (optional)
                  </label>
                  <select
                    value={newMemberGroupId}
                    onChange={(event) => setNewMemberGroupId(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-white"
                  >
                    <option value="">Unassigned</option>
                    {groups.map((group) => (
                      <option key={group._id || group.id} value={group._id || group.id}>
                        {group.name} · {group.court} · {group.time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formError ? (
                <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                  {formError}
                </div>
              ) : null}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAddMember(false)
                    resetNewMember()
                  }}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMember}
                  className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-black hover:bg-green-400"
                >
                  Save Member
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {showEditMember ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Edit Member</h3>
                  <p className="text-sm text-zinc-500">
                    Update name, email, or phone number.
                  </p>
                </div>
                <button
                  onClick={() => setShowEditMember(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Name
                  </label>
                  <input
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-white"
                    placeholder="Member name"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Email
                  </label>
                  <input
                    value={editEmail}
                    onChange={(event) => setEditEmail(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-white"
                    placeholder="member@email.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Phone
                  </label>
                  <div className="mt-2 flex items-center rounded-lg border border-zinc-800 bg-zinc-950 px-3">
                    <span className="text-sm text-zinc-400">+91</span>
                    <input
                      value={editPhone}
                      onChange={(event) =>
                        setEditPhone(event.target.value.replace(/\D/g, '').slice(0, 10))
                      }
                      className="ml-2 w-full bg-transparent py-2 text-sm text-white outline-none"
                      placeholder="9000000000"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </div>

              {editError ? (
                <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                  {editError}
                </div>
              ) : null}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowEditMember(false)}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditMember}
                  className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-black hover:bg-green-400"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {showAssignMember ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Assign Group</h3>
                  <p className="text-sm text-zinc-500">
                    Assign a member to a group or unassign them.
                  </p>
                </div>
                <button
                  onClick={() => setShowAssignMember(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Select group
                </label>
                <select
                  value={assignGroupId}
                  onChange={(event) => setAssignGroupId(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-white"
                >
                  <option value="">Unassigned</option>
                  {groups.map((group) => (
                    <option key={group._id || group.id} value={group._id || group.id}>
                      {group.name} · {group.court} · {group.time}
                    </option>
                  ))}
                </select>
              </div>

              {assignError ? (
                <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                  {assignError}
                </div>
              ) : null}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowAssignMember(false)}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignGroup}
                  className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-black hover:bg-green-400"
                >
                  Save Assignment
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}

function StatCard({ label, value, colorClass }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-xs uppercase text-zinc-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${colorClass} font-mono`}>{value}</p>
      <div className="mt-4 h-1 w-full rounded-full bg-zinc-800">
        <div className={`h-1 rounded-full ${colorClass.replace('text', 'bg')}`} />
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    active: 'border-green-500/30 text-green-400 bg-green-500/10',
    pending: 'border-orange-500/30 text-orange-400 bg-orange-500/10',
    expired: 'border-red-500/30 text-red-400 bg-red-500/10',
  }

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  )
}

function ActionButton({ children, label, danger, onClick }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`rounded-lg border px-2.5 py-2 text-sm ${
        danger
          ? 'border-red-500/30 bg-red-500/10 text-red-400'
          : 'border-zinc-700 bg-zinc-900 text-zinc-200'
      }`}
    >
      {children}
    </button>
  )
}
