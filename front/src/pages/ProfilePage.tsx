import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Save, Trash2 } from "lucide-react";
import { AxiosError } from "axios";
import { useAuth } from "../contexts/AuthContext";
import { updateUser } from "../services/requests/users/updateUser";
import { deleteUser } from "../services/requests/users/deleteUser";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateUserData } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaveError("");
    setSaveSuccess(false);
    setIsSaving(true);
    try {
      const payload: { name?: string; email?: string } = {};
      if (name !== user.name) payload.name = name;
      if (email !== user.email) payload.email = email;

      if (Object.keys(payload).length === 0) {
        setSaveSuccess(true);
        return;
      }

      const response = await updateUser(user._id, payload);
      updateUserData({ name: response.data.name, email: response.data.email });
      setSaveSuccess(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          setSaveError("This e-mail is already in use.");
        } else if (error.response?.status === 400) {
          setSaveError("Invalid data. Please check the fields.");
        } else {
          setSaveError("Could not save changes. Please try again.");
        }
      } else {
        setSaveError("Unexpected error. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
    );
    if (!confirmed) return;

    setDeleteError("");
    setIsDeleting(true);
    try {
      await deleteUser(user._id);
      logout();
      navigate("/");
    } catch {
      setDeleteError("Could not delete account. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10 transition-colors duration-300">
      <div className="max-w-lg mx-auto">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm font-medium text-secondary-foreground hover:text-primary mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to dashboard
        </Link>

        <h1 className="text-2xl font-extrabold tracking-tight mb-8">Profile Settings</h1>

        {/* Edit profile */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-6">
          <h2 className="text-lg font-bold mb-6">Personal Information</h2>

          <form onSubmit={handleSave} className="space-y-5">
            {saveError && (
              <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                {saveError}
              </div>
            )}
            {saveSuccess && (
              <div className="rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
                Changes saved successfully.
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-secondary-foreground opacity-50" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => { setName(e.target.value); setSaveSuccess(false); }}
                  className="block w-full pl-11 pr-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-secondary-foreground opacity-50" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setSaveSuccess(false); }}
                  className="block w-full pl-11 pr-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Danger zone */}
        <div className="bg-card border border-red-200 rounded-2xl p-8">
          <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
          <p className="text-sm text-secondary-foreground opacity-80 mb-5">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          {deleteError && (
            <p className="text-sm text-red-600 mb-4">{deleteError}</p>
          )}
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
