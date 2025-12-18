// src/pages/Dashboard/ManageContests.jsx
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageContests = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["adminContests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/contests");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ id, action }) => {
      return await axiosSecure.patch(`/admin/contests/${id}`, { action });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminContests"]);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Contest status updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update contest status.",
      });
    },
  });

  const handleAction = (id, action, contestName) => {
    let title = "";
    let text = "";
    let confirmText = "";

    if (action === "approve") {
      title = "Approve Contest?";
      text = `Are you sure you want to approve "${contestName}"?`;
      confirmText = "Yes, approve it!";
    } else if (action === "reject") {
      title = "Reject Contest?";
      text = `Are you sure you want to reject "${contestName}"?`;
      confirmText = "Yes, reject it!";
    } else if (action === "delete") {
      title = "Delete Contest?";
      text = `Delete "${contestName}" permanently? This cannot be undone.`;
      confirmText = "Yes, delete it!";
    }

    Swal.fire({
      title,
      text,
      icon: action === "delete" ? "warning" : "question",
      showCancelButton: true,
      confirmButtonColor: action === "delete" ? "#d33" : "#3085d6",
      cancelButtonColor: "#6c757d",
      confirmButtonText: confirmText,
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate({ id, action });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-3xl mb-6">Manage Contests</h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Contest Name</th>
                <th>Creator</th>
                <th>Prize</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((contest, index) => (
                <tr key={contest._id}>
                  <th>{index + 1}</th>
                  <td className="font-medium">{contest.name}</td>
                  <td>{contest.creatorEmail || "Unknown"}</td>
                  <td>
                    <span className="font-bold text-primary">
                      ${contest.prize}
                    </span>
                  </td>
                  <td>
                    <div
                      className={`badge ${
                        contest.status === "approved"
                          ? "badge-success"
                          : contest.status === "rejected"
                          ? "badge-error"
                          : "badge-warning"
                      }`}
                    >
                      {contest.status || "pending"}
                    </div>
                  </td>
                  <td className="flex flex-wrap gap-2">
                    {contest.status !== "approved" && (
                      <button
                        onClick={() =>
                          handleAction(contest._id, "approve", contest.name)
                        }
                        className="btn btn-success btn-sm"
                      >
                        Confirm
                      </button>
                    )}
                    {contest.status !== "rejected" &&
                      contest.status !== "approved" && (
                        <button
                          onClick={() =>
                            handleAction(contest._id, "reject", contest.name)
                          }
                          className="btn btn-warning btn-sm"
                        >
                          Reject
                        </button>
                      )}
                    <button
                      onClick={() =>
                        handleAction(contest._id, "delete", contest.name)
                      }
                      className="btn btn-error btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageContests;
