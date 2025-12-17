// src/pages/Dashboard/MyParticipated.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const MyParticipated = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: participatedContests = [], isLoading } = useQuery({
    queryKey: ["myParticipated", user?.uid],
    queryFn: async () => {
      const res = await axiosSecure.get("/my-participated");
      return res.data;
    },
    enabled: !!user?.uid,
  });

  // Sort by upcoming deadline (closest first)
  const sortedContests = [...participatedContests].sort((a, b) => {
    return new Date(a.deadline) - new Date(b.deadline);
  });

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-3xl mb-6">My Participated Contests</h2>

        {sortedContests.length === 0 ? (
          <div className="alert alert-info shadow-lg">
            <span>You haven't participated in any contests yet.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Contest Name</th>
                  <th>Prize Money</th>
                  <th>Entry Fee</th>
                  <th>Deadline</th>
                  <th>Payment Status</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedContests.map((contest, index) => {
                  const isEnded = new Date(contest.deadline) < new Date();
                  const hasWinner = !!contest.winner;

                  return (
                    <tr key={contest._id}>
                      <th>{index + 1}</th>
                      <td className="font-medium">{contest.name}</td>
                      <td className="text-primary font-bold">
                        ${contest.prize}
                      </td>
                      <td>${contest.price}</td>
                      <td>
                        {new Date(contest.deadline).toLocaleDateString()}
                        <br />
                        <span className="text-sm text-base-content/70">
                          {new Date(contest.deadline).toLocaleTimeString()}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-success badge-lg">
                          Paid
                        </span>
                      </td>
                      <td>
                        {hasWinner ? (
                          <span className="badge badge-success text-nowrap">
                            Winner Declared
                          </span>
                        ) : isEnded ? (
                          <span className="badge badge-warning">Ended</span>
                        ) : (
                          <span className="badge badge-info">Ongoing</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyParticipated;
