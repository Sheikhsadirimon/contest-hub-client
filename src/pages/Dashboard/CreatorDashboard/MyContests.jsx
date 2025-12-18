import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loading from "../../../components/Loading/Loading";

const MyContests = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedContest, setSelectedContest] = useState(null);
  const [deadline, setDeadline] = useState(null);

  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["myContests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/creator/contests");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/contests/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myContests"]);
      Swal.fire("Deleted!", "Contest has been deleted.", "success");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await axiosSecure.patch(`/contests/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myContests"]);
      Swal.fire(
        "Updated!",
        "Contest has been updated successfully.",
        "success"
      );
      setSelectedContest(null);
      setDeadline(null);
    },
  });

  const handleDelete = (id, contestName) => {
    Swal.fire({
      title: "Delete Contest?",
      text: `Are you sure you want to delete "${contestName}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const openEditModal = (contest) => {
    setSelectedContest(contest);
    setDeadline(contest.deadline ? new Date(contest.deadline) : null);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const updatedContest = {
      name: data.name,
      image: data.image,
      description: data.description,
      price: Number(data.price),
      prize: data.prize,
      taskInstruction: data.taskInstruction,
      category: data.category,
      deadline: deadline ? deadline.toISOString() : null,
    };

    updateMutation.mutate({ id: selectedContest._id, data: updatedContest });
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="card bg-base-100 shadow-2xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-8">
          <h2 className="card-title text-4xl font-bold">My Created Contests</h2>
          <Link to="/dashboard/add-contest" className="btn btn-primary">
            Add New Contest
          </Link>
        </div>

        {contests.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-base-content/60">
              You haven't created any contests yet.
            </p>
            <Link to="/dashboard/add-contest" className="btn btn-primary mt-6">
              Create Your First Contest
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Contest Name</th>
                  <th>Prize</th>
                  <th>Status</th>
                  <th>Participants</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contests.map((contest, index) => (
                  <tr key={contest._id} className="hover">
                    <th>{index + 1}</th>
                    <td className="font-semibold">{contest.name}</td>
                    <td>
                      <span className="text-primary font-bold">
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
                    <td>{contest.participants || 0}</td>
                    <td className="flex flex-wrap gap-2">
                      <Link
                        to={`/dashboard/submissions`}
                        className="btn btn-info btn-sm"
                      >
                        See Submissions
                      </Link>

                      {contest.status === "pending" && (
                        <>
                          <button
                            onClick={() => openEditModal(contest)}
                            className="btn btn-primary btn-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(contest._id, contest.name)
                            }
                            className="btn btn-error btn-sm"
                          >
                            Delete
                          </button>
                        </>
                      )}

                      {contest.status !== "pending" && contest.status && (
                        <span className="text-sm text-base-content/60 italic">
                          {contest.status === "approved"
                            ? "Approved - cannot edit"
                            : "Rejected - cannot edit"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Modal */}
        {selectedContest && (
          <dialog open className="modal modal-bottom sm:modal-middle">
            <div className="modal-box max-w-4xl">
              <h3 className="font-bold text-3xl mb-6 text-center">
                Edit Contest
              </h3>
              <form
                onSubmit={handleUpdate}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-lg">
                        Contest Name
                      </span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={selectedContest.name}
                      className="input input-bordered input-lg w-full"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-lg">
                        Image URL
                      </span>
                    </label>
                    <input
                      type="url"
                      name="image"
                      defaultValue={selectedContest.image}
                      className="input input-bordered input-lg w-full"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-lg">
                        Contest Type
                      </span>
                    </label>
                    <select
                      name="category"
                      defaultValue={selectedContest.category}
                      className="select select-bordered select-lg w-full"
                      required
                    >
                      <option value="Design">Design</option>
                      <option value="Writing">Writing</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Business Idea">Business Idea</option>
                      <option value="Photography">Photography</option>
                      <option value="Video Editing">Video Editing</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-lg">
                        Entry Fee
                      </span>
                    </label>
                    <div className="input-group">
                      <span className="bg-primary text-primary-content text-lg font-bold">
                        $
                      </span>
                      <input
                        type="number"
                        name="price"
                        min="0"
                        step="0.01"
                        defaultValue={selectedContest.price}
                        className="input input-bordered input-lg flex-1"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-lg">
                        Prize Money
                      </span>
                    </label>
                    <div className="input-group">
                      <span className="bg-primary text-primary-content text-lg font-bold">
                        $
                      </span>
                      <input
                        type="number"
                        name="prize"
                        defaultValue={selectedContest.prize}
                        className="input input-bordered input-lg flex-1"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-lg">
                        Description
                      </span>
                    </label>
                    <textarea
                      name="description"
                      defaultValue={selectedContest.description}
                      className="textarea textarea-bordered textarea-lg h-40 w-full"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-lg">
                        Task Instruction
                      </span>
                    </label>
                    <textarea
                      name="taskInstruction"
                      defaultValue={selectedContest.taskInstruction}
                      className="textarea textarea-bordered textarea-lg h-48 w-full"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-lg">
                        Deadline
                      </span>
                    </label>
                    <DatePicker
                      selected={deadline}
                      onChange={(date) => setDeadline(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      minDate={new Date()}
                      placeholderText="Select new deadline"
                      className="input input-bordered input-lg w-full"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="lg:col-span-2 flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedContest(null);
                      setDeadline(null);
                    }}
                    className="btn btn-ghost btn-lg"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-lg">
                    Update Contest
                  </button>
                </div>
              </form>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button
                onClick={() => {
                  setSelectedContest(null);
                  setDeadline(null);
                }}
              >
                close
              </button>
            </form>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default MyContests;
