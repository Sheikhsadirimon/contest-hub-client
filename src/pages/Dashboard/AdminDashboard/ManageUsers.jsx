import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/users");
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ id, role }) => {
      return await axiosSecure.patch(`/admin/users/${id}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
      Swal.fire({
        icon: "success",
        title: "Role Updated!",
        text: "User role has been changed successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while updating the role.",
      });
    },
  });

  const handleRoleChange = (e, userId, currentRole, userName) => {
    const newRole = e.target.value;

    if (currentRole === newRole) return;

    if (currentRole === "admin" && newRole !== "admin") {
      Swal.fire({
        icon: "warning",
        title: "Cannot Change Admin Role",
        text: "You cannot demote an admin user. There must be at least one admin.",
      });
      e.target.value = currentRole;
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: `Change ${userName || "this user"}'s role to "${newRole}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate({ id: userId, role: newRole });
      } else {
        e.target.value = currentRole;
      }
    });
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-3xl mb-6">Manage Users</h2>

        {/* Total Users Info */}
        <div className="mb-4 text-right">
          <span className="text-sm text-base-content/70">
            Total Users: {users.length} | Page {currentPage} of{" "}
            {totalPages || 1}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Current Role</th>
                <th>Change Role</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={user._id}>
                  <th>{startIndex + index + 1}</th>
                  <td>{user.displayName || "N/A"}</td>
                  <td>{user.email}</td>
                  <td>
                    <div
                      className={`badge ${
                        user.role === "admin"
                          ? "badge-error"
                          : user.role === "creator"
                          ? "badge-warning"
                          : "badge-success"
                      }`}
                    >
                      {user.role}
                    </div>
                  </td>
                  <td>
                    {user.role === "admin" ? (
                      <span className="text-sm text-base-content/60 italic">
                        Admin (cannot change)
                      </span>
                    ) : (
                      <select
                        defaultValue={user.role}
                        onChange={(e) =>
                          handleRoleChange(
                            e,
                            user._id,
                            user.role,
                            user.displayName || user.email
                          )
                        }
                        className="select select-bordered select-sm"
                      >
                        <option value="user">User</option>
                        <option value="creator">Creator</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination  */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-sm btn-outline"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`btn btn-sm ${
                  currentPage === i + 1 ? "btn-primary" : "btn-outline"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-sm btn-outline"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
