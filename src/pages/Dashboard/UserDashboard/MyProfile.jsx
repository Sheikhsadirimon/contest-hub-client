// src/pages/Dashboard/MyProfile.jsx
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [address, setAddress] = useState("");

  // Fetch user profile from MongoDB
  const { data: profile = {}, isLoading: profileLoading } = useQuery({
    queryKey: ["userProfile", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return {};
      const res = await axiosSecure.get(`/user/${user.uid}`);
      return res.data;
    },
    enabled: !!user?.uid,
  });

  // Fetch participated contests
  const { data: participated = [] } = useQuery({
    queryKey: ["myParticipated", user?.uid],
    queryFn: async () => {
      const res = await axiosSecure.get("/my-participated");
      return res.data;
    },
    enabled: !!user?.uid,
  });

  // Calculate wins
  const wonCount = participated.filter(
    (c) => c.winner?.uid === user?.uid
  ).length;
  const participatedCount = participated.length;
  const winPercentage =
    participatedCount > 0
      ? Math.round((wonCount / participatedCount) * 100)
      : 0;

  const chartData = [
    { name: "Wins", value: wonCount, color: "#10b981" },
    {
      name: "Participated",
      value: participatedCount - wonCount,
      color: "#6366f1",
    },
  ];

  // Update profile
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      await axiosSecure.patch(`/user/${user.uid}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile"]);
      Swal.fire("Success!", "Profile updated successfully!", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to update profile", "error");
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      Swal.fire("Error", "Name is required", "error");
      return;
    }

    updateMutation.mutate({
      displayName: name,
      photoURL,
      address,
    });
  };

  // Set form values when profile or user loads
  useEffect(() => {
    setName(profile.displayName || user?.displayName || "");
    setPhotoURL(profile.photoURL || user?.photoURL || "");
    setAddress(profile.address || "");
  }, [profile, user]);

  if (authLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        My Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Avatar & Stats */}
        <div className="space-y-8">
          <div className="card bg-gradient-to-br from-indigo-50 to-purple-100 shadow-2xl p-10 text-center">
            <div className="avatar mb-6">
              <div className="w-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                <img
                  src={
                    photoURL ||
                    user?.photoURL ||
                    "https://i.ibb.co/4pB0Z4J/user.png"
                  }
                  alt="Profile"
                />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-indigo-900">
              {name || user?.displayName}
            </h2>
            <p className="text-xl text-indigo-700">{user?.email}</p>
            {address && (
              <p className="mt-3 text-lg text-indigo-800">{address}</p>
            )}
          </div>

          {/* Win Chart */}
          <div className="card bg-base-100 shadow-2xl p-8">
            <h3 className="text-2xl font-bold text-center mb-6">
              Win Statistics
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-6">
              <p className="text-5xl font-bold text-primary">
                {winPercentage}%
              </p>
              <p className="text-xl font-medium">Win Rate</p>
              <p className="text-base-content/70 mt-2">
                {wonCount} wins out of {participatedCount} contests
              </p>
            </div>
          </div>
        </div>

        {/* Right: Edit Form */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            <h3 className="text-2xl font-bold mb-8">Update Your Profile</h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-medium">Name</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered input-lg w-full"
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-medium">
                    Photo URL
                  </span>
                </label>
                <input
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="input input-bordered input-lg w-full"
                  placeholder="https://example.com/your-photo.jpg"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-medium">
                    Address
                  </span>
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="textarea textarea-bordered textarea-lg w-full"
                  rows="4"
                  placeholder="Your address (city, country)"
                />
              </div>

              <div className="mt-8">
                <button
                  onClick={handleSave}
                  disabled={updateMutation.isLoading}
                  className="btn btn-primary btn-lg w-full"
                >
                  {updateMutation.isLoading ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
