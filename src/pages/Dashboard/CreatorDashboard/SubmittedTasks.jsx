import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Countdown from "react-countdown";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../components/Loading/Loading";

const SubmittedTasks = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const { data: contests = [], isLoading: contestsLoading } = useQuery({
    queryKey: ["creatorContests", user?.uid],
    queryFn: async () => {
      const res = await axiosSecure.get("/creator/contests");
      return res.data;
    },
  });

  const { data: submissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ["creatorSubmissions", contests],
    queryFn: async () => {
      if (contests.length === 0) return [];
      const contestIds = contests.map((c) => c._id);
      const res = await axiosSecure.post("/creator/submissions", {
        contestIds,
      });
      return res.data;
    },
    enabled: contests.length > 0,
  });

  const declareWinnerMutation = useMutation({
    mutationFn: async ({
      contestId,
      winnerUid,
      winnerName,
      winnerPhotoURL,
    }) => {
      const res = await axiosSecure.patch(`/contests/${contestId}/winner`, {
        winner: {
          uid: winnerUid,
          name: winnerName,
          photoURL: winnerPhotoURL,
          declaredAt: new Date().toISOString(),
        },
      });
      return res.data;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries(["creatorContests"]);
      const previousContests = queryClient.getQueryData(["creatorContests"]);

      queryClient.setQueryData(["creatorContests"], (old) =>
        old?.map((c) =>
          c._id === variables.contestId
            ? {
                ...c,
                winner: {
                  uid: variables.winnerUid,
                  name: variables.winnerName,
                  photoURL: variables.winnerPhotoURL,
                  declaredAt: new Date().toISOString(),
                },
              }
            : c
        )
      );

      return { previousContests };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["creatorContests"], context.previousContests);
      Swal.fire(
        "Error",
        "Failed to declare winner. Please try again.",
        "error"
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(["creatorContests"]);
      queryClient.invalidateQueries(["creatorSubmissions"]);
    },
    onSuccess: () => {
      Swal.fire("Success!", "Winner declared successfully!", "success");
      setSelectedSubmission(null);
    },
  });

  const handleDeclareWinner = (submission) => {
    const contest = contests.find((c) => c._id === submission.contestId);

    if (contest?.winner) {
      Swal.fire(
        "Already Declared",
        "A winner has already been declared.",
        "info"
      );
      return;
    }

    Swal.fire({
      title: "Declare Winner?",
      text: `Declare ${
        submission.userName || submission.userEmail
      } as winner of "${contest?.name}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, declare winner!",
    }).then((result) => {
      if (result.isConfirmed) {
        declareWinnerMutation.mutate({
          contestId: submission.contestId,
          winnerUid: submission.userUid,
          winnerName: submission.userName || submission.userEmail,
          winnerPhotoURL:
            submission.userPhotoURL || "https://i.ibb.co/4pB0Z4J/user.png",
        });
      }
    });
  };

  const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) return null;
    return (
      <div className="text-center text-sm text-base-content/70">
        <p>Contest running...</p>
        <p className="font-bold">
          {days}d {hours}h {minutes}m {seconds}s
        </p>
      </div>
    );
  };

  if (contestsLoading || submissionsLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-3xl mb-6">Submitted Tasks</h2>

        {submissions.length === 0 ? (
          <div className="alert alert-info shadow-lg">
            <span>No submissions yet. Waiting for participants!</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Contest Name</th>
                  <th>Participant</th>
                  <th>Email</th>
                  <th>Submitted Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => {
                  const contest = contests.find(
                    (c) => c._id === submission.contestId
                  );

                  return (
                    <tr key={submission._id}>
                      <th>{index + 1}</th>
                      <td>{contest?.name || "Unknown"}</td>
                      <td>{submission.userName || submission.userEmail}</td>
                      <td>{submission.userEmail}</td>
                      <td>
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="btn btn-primary btn-sm text-nowrap"
                        >
                          View Submission
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Submission detail */}
        {selectedSubmission && (
          <dialog open className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              <h3 className="font-bold text-2xl mb-4">Submission Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">Contest:</p>
                  <p>
                    {
                      contests.find(
                        (c) => c._id === selectedSubmission.contestId
                      )?.name
                    }
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Participant:</p>
                  <p>
                    {selectedSubmission.userName ||
                      selectedSubmission.userEmail}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p>{selectedSubmission.userEmail}</p>
                </div>
                <div>
                  <p className="font-semibold">Submitted Task:</p>
                  <div className="bg-base-200 p-4 rounded-lg whitespace-pre-wrap">
                    {selectedSubmission.task}
                  </div>
                </div>
                <div>
                  <p className="font-semibold">Submitted At:</p>
                  <p>
                    {new Date(selectedSubmission.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="modal-action">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="btn btn-ghost"
                >
                  Close
                </button>

                {(() => {
                  const contest = contests.find(
                    (c) => c._id === selectedSubmission.contestId
                  );
                  const deadlinePassed =
                    contest?.deadline &&
                    new Date(contest.deadline) < new Date();
                  const hasWinner = !!contest?.winner;

                  if (hasWinner) {
                    return (
                      <div className="alert alert-success shadow-lg">
                        <span>Winner Already Declared</span>
                      </div>
                    );
                  }

                  if (!deadlinePassed) {
                    return (
                      <div className="text-center">
                        <p className="mb-2">Contest is still running</p>
                        <Countdown
                          date={new Date(contest.deadline)}
                          renderer={countdownRenderer}
                        />
                      </div>
                    );
                  }

                  return (
                    <button
                      onClick={() => handleDeclareWinner(selectedSubmission)}
                      className="btn btn-success"
                      disabled={declareWinnerMutation.isLoading}
                    >
                      {declareWinnerMutation.isLoading
                        ? "Declaring..."
                        : "Declare Winner"}
                    </button>
                  );
                })()}
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button onClick={() => setSelectedSubmission(null)}>close</button>
            </form>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default SubmittedTasks;
