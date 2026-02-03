"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Tags, FolderKanban, MapPin, Plus, Pencil, Trash2, MoreVertical, Search } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useAuth } from "@/context/AuthContext";
import { organizationService, Location } from "@/services/organizationService";
import { Tag, Project } from "@/types";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import toast from "react-hot-toast";

type TabId = "tags" | "projects" | "locations";

export default function OrganizationPageClient() {
  const { user } = useAuth();
  const familyId = user?.family?.id;

  const [activeTab, setActiveTab] = useState<TabId>("tags");
  const [tags, setTags] = useState<Tag[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const fetchAll = useCallback(() => {
    if (!familyId) return;
    setIsLoading(true);
    Promise.all([
      organizationService.getTags(familyId),
      organizationService.getProjects(familyId),
      organizationService.getLocations(familyId).catch(() => []),
    ])
      .then(([t, p, l]) => {
        setTags(t);
        setProjects(p);
        setLocations(l);
      })
      .catch((e) => {
        console.error(e);
        toast.error("Failed to load organization data");
      })
      .finally(() => setIsLoading(false));
  }, [familyId]);

  useEffect(() => {
    if (familyId) fetchAll();
  }, [familyId, fetchAll]);

  const openAdd = () => {
    setEditingTag(null);
    setEditingProject(null);
    setEditingLocation(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTag(null);
    setEditingProject(null);
    setEditingLocation(null);
    fetchAll();
  };

  const filteredTags = tags.filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredProjects = projects.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredLocations = locations.filter((l) => l.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
            Tags & Projects
          </h1>
          <p className="text-gray-500 font-medium italic">
            Organize transactions with tags, projects, and locations.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-4">
        {[
          { id: "tags" as TabId, label: "Tags", icon: Tags },
          { id: "projects" as TabId, label: "Projects", icon: FolderKanban },
          { id: "locations" as TabId, label: "Locations", icon: MapPin },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all ${
              activeTab === id
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>

      {/* Search + Add */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-5 h-5" /> Add {activeTab === "tags" ? "Tag" : activeTab === "projects" ? "Project" : "Location"}
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-3xl" />
          ))}
        </div>
      ) : (
        <>
          {activeTab === "tags" && (
            <TagList
              tags={filteredTags}
              onEdit={(tag) => {
                setEditingTag(tag);
                setModalOpen(true);
              }}
              onDelete={async (id) => {
                if (!confirm("Delete this tag?")) return;
                try {
                  await organizationService.deleteTag(id);
                  toast.success("Tag deleted");
                  fetchAll();
                } catch {
                  toast.error("Failed to delete tag");
                }
              }}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
            />
          )}
          {activeTab === "projects" && (
            <ProjectList
              projects={filteredProjects}
              onEdit={(p) => {
                setEditingProject(p);
                setModalOpen(true);
              }}
              onDelete={async (id) => {
                if (!confirm("Delete this project?")) return;
                try {
                  await organizationService.deleteProject(id);
                  toast.success("Project deleted");
                  fetchAll();
                } catch {
                  toast.error("Failed to delete project");
                }
              }}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
            />
          )}
          {activeTab === "locations" && (
            <LocationList
              locations={filteredLocations}
              onEdit={(l) => {
                setEditingLocation(l);
                setModalOpen(true);
              }}
              onDelete={async (id) => {
                if (!confirm("Delete this location?")) return;
                try {
                  await organizationService.deleteLocation(id);
                  toast.success("Location deleted");
                  fetchAll();
                } catch {
                  toast.error("Failed to delete location");
                }
              }}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
            />
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} className="max-w-xl p-10">
        <div className="mb-8">
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">
            {activeTab === "tags" && (editingTag ? "Edit Tag" : "Add Tag")}
            {activeTab === "projects" && (editingProject ? "Edit Project" : "Add Project")}
            {activeTab === "locations" && (editingLocation ? "Edit Location" : "Add Location")}
          </h3>
        </div>
        {activeTab === "tags" && familyId && (
          <TagForm
            familyId={familyId}
            tag={editingTag}
            onSuccess={closeModal}
            onCancel={closeModal}
          />
        )}
        {activeTab === "projects" && familyId && (
          <ProjectForm
            familyId={familyId}
            project={editingProject}
            onSuccess={closeModal}
            onCancel={closeModal}
          />
        )}
        {activeTab === "locations" && familyId && (
          <LocationForm
            familyId={familyId}
            location={editingLocation}
            onSuccess={closeModal}
            onCancel={closeModal}
          />
        )}
      </Modal>
    </div>
  );
}

// --- Tag list & form ---
function TagList({
  tags,
  onEdit,
  onDelete,
  activeMenu,
  setActiveMenu,
}: {
  tags: Tag[];
  onEdit: (t: Tag) => void;
  onDelete: (id: string) => void;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
}) {
  if (tags.length === 0) {
    return (
      <div className="text-center py-16 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <Tags className="w-14 h-14 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">No tags yet</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add tags to categorize transactions.</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="flex items-center justify-between p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-3">
            {tag.color && (
              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: tag.color }} />
            )}
            <span className="text-lg font-bold text-gray-900 dark:text-white">{tag.name}</span>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveMenu(activeMenu === tag.id ? null : tag.id)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white dropdown-toggle"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            <Dropdown isOpen={activeMenu === tag.id} onClose={() => setActiveMenu(null)} className="absolute right-0 top-full mt-1 z-50 min-w-[120px]">
                <DropdownItem onClick={() => { onEdit(tag); setActiveMenu(null); }}>
                  <div className="flex items-center gap-2"><Pencil className="w-4 h-4" /> Edit</div>
                </DropdownItem>
                <DropdownItem onClick={() => { onDelete(tag.id); setActiveMenu(null); }} className="text-red-600 dark:text-red-400">
                  <div className="flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</div>
                </DropdownItem>
              </Dropdown>
          </div>
        </div>
      ))}
    </div>
  );
}

function TagForm({
  familyId,
  tag,
  onSuccess,
  onCancel,
}: {
  familyId: string;
  tag: Tag | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(tag?.name ?? "");
  const [color, setColor] = useState(tag?.color ?? "");
  const [description, setDescription] = useState((tag as Tag & { description?: string })?.description ?? "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSubmitting(true);
    try {
      if (tag) {
        await organizationService.updateTag(tag.id, { name: name.trim(), color: color || undefined, description: description || undefined });
        toast.success("Tag updated");
      } else {
        await organizationService.createTag({ family_id: familyId, name: name.trim(), color: color || undefined, description: description || undefined });
        toast.success("Tag added");
      }
      onSuccess();
    } catch {
      toast.error(tag ? "Failed to update tag" : "Failed to add tag");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest">Name *</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Groceries" className="rounded-2xl h-12" required />
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest">Color (hex)</Label>
        <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="#3B82F6" className="rounded-2xl h-12" />
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest">Description</Label>
        <TextArea value={description} onChange={setDescription} rows={2} placeholder="Optional" className="rounded-2xl" />
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={submitting} className="rounded-2xl px-6 py-3 font-bold bg-purple-600 hover:bg-purple-500 text-white border-0">
          {submitting ? "Saving…" : tag ? "Update Tag" : "Add Tag"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="rounded-2xl px-6 py-3 font-bold">Cancel</Button>
      </div>
    </form>
  );
}

// --- Project list & form ---
function ProjectList({
  projects,
  onEdit,
  onDelete,
  activeMenu,
  setActiveMenu,
}: {
  projects: Project[];
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
}) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <FolderKanban className="w-14 h-14 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">No projects yet</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add projects to group transactions (e.g. Trip, Wedding).</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {projects.map((p) => (
        <div
          key={p.id}
          className="flex items-center justify-between p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl hover:shadow-lg transition-all"
        >
          <div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">{p.name}</span>
            {p.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{p.description}</p>}
          </div>
          <div className="relative">
            <button type="button" onClick={() => setActiveMenu(activeMenu === p.id ? null : p.id)} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white dropdown-toggle">
              <MoreVertical className="w-5 h-5" />
            </button>
            <Dropdown isOpen={activeMenu === p.id} onClose={() => setActiveMenu(null)} className="absolute right-0 top-full mt-1 z-50 min-w-[120px]">
                <DropdownItem onClick={() => { onEdit(p); setActiveMenu(null); }}>
                  <div className="flex items-center gap-2"><Pencil className="w-4 h-4" /> Edit</div>
                </DropdownItem>
                <DropdownItem onClick={() => { onDelete(p.id); setActiveMenu(null); }} className="text-red-600 dark:text-red-400">
                  <div className="flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</div>
                </DropdownItem>
              </Dropdown>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectForm({
  familyId,
  project,
  onSuccess,
  onCancel,
}: {
  familyId: string;
  project: Project | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSubmitting(true);
    try {
      if (project) {
        await organizationService.updateProject(project.id, { name: name.trim(), description: description || undefined });
        toast.success("Project updated");
      } else {
        await organizationService.createProject({ family_id: familyId, name: name.trim(), description: description || undefined });
        toast.success("Project added");
      }
      onSuccess();
    } catch {
      toast.error(project ? "Failed to update project" : "Failed to add project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest">Name *</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Europe Trip" className="rounded-2xl h-12" required />
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest">Description</Label>
        <TextArea value={description} onChange={setDescription} rows={3} placeholder="Optional" className="rounded-2xl" />
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={submitting} className="rounded-2xl px-6 py-3 font-bold bg-purple-600 hover:bg-purple-500 text-white border-0">
          {submitting ? "Saving…" : project ? "Update Project" : "Add Project"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="rounded-2xl px-6 py-3 font-bold">Cancel</Button>
      </div>
    </form>
  );
}

// --- Location list & form ---
function LocationList({
  locations,
  onEdit,
  onDelete,
  activeMenu,
  setActiveMenu,
}: {
  locations: Location[];
  onEdit: (l: Location) => void;
  onDelete: (id: string) => void;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
}) {
  if (locations.length === 0) {
    return (
      <div className="text-center py-16 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <MapPin className="w-14 h-14 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">No locations yet</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add locations to tag where you spend (store, restaurant, etc.).</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {locations.map((loc) => (
        <div
          key={loc.id}
          className="flex items-center justify-between p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl hover:shadow-lg transition-all"
        >
          <div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">{loc.name}</span>
            {(loc.address || loc.city) && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{[loc.address, loc.city, loc.country].filter(Boolean).join(", ")}</p>
            )}
          </div>
          <div className="relative">
            <button type="button" onClick={() => setActiveMenu(activeMenu === loc.id ? null : loc.id)} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white dropdown-toggle">
              <MoreVertical className="w-5 h-5" />
            </button>
            <Dropdown isOpen={activeMenu === loc.id} onClose={() => setActiveMenu(null)} className="absolute right-0 top-full mt-1 z-50 min-w-[120px]">
                <DropdownItem onClick={() => { onEdit(loc); setActiveMenu(null); }}>
                  <div className="flex items-center gap-2"><Pencil className="w-4 h-4" /> Edit</div>
                </DropdownItem>
                <DropdownItem onClick={() => { onDelete(loc.id); setActiveMenu(null); }} className="text-red-600 dark:text-red-400">
                  <div className="flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</div>
                </DropdownItem>
              </Dropdown>
          </div>
        </div>
      ))}
    </div>
  );
}

function LocationForm({
  familyId,
  location,
  onSuccess,
  onCancel,
}: {
  familyId: string;
  location: Location | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(location?.name ?? "");
  const [address, setAddress] = useState(location?.address ?? "");
  const [city, setCity] = useState(location?.city ?? "");
  const [country, setCountry] = useState(location?.country ?? "");
  const [notes, setNotes] = useState(location?.notes ?? "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSubmitting(true);
    try {
      if (location) {
        await organizationService.updateLocation(location.id, { name: name.trim(), address: address || undefined, city: city || undefined, country: country || undefined, notes: notes || undefined });
        toast.success("Location updated");
      } else {
        await organizationService.createLocation({ family_id: familyId, name: name.trim(), address: address || undefined, city: city || undefined, country: country || undefined, notes: notes || undefined });
        toast.success("Location added");
      }
      onSuccess();
    } catch {
      toast.error(location ? "Failed to update location" : "Failed to add location");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest">Name *</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Whole Foods" className="rounded-2xl h-12" required />
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest">Address</Label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address" className="rounded-2xl h-12" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest">City</Label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="rounded-2xl h-12" />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest">Country</Label>
          <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="rounded-2xl h-12" />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest">Notes</Label>
        <TextArea value={notes} onChange={setNotes} rows={2} placeholder="Optional" className="rounded-2xl" />
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={submitting} className="rounded-2xl px-6 py-3 font-bold bg-purple-600 hover:bg-purple-500 text-white border-0">
          {submitting ? "Saving…" : location ? "Update Location" : "Add Location"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="rounded-2xl px-6 py-3 font-bold">Cancel</Button>
      </div>
    </form>
  );
}
