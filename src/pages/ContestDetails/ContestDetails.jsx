// src/pages/ContestDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Countdown from "react-countdown";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ContestDetails = () => {
  const { id } = useParams();
  const { user: authUser, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [taskSubmission, setTaskSubmission] = useState("");

  const {
    data: contest,
    isLoading: contestLoading,
    refetch: refetchContest,
  } = useQuery({
    queryKey: ["contest", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/contest/${id}`);
      return res.data;
    },
  });

  // Fetch latest user data from backend (for accurate name/photo in submission)
  const { data: backendUser = {}, isLoading: userLoading } = useQuery({
    queryKey: ["backendUser", authUser?.uid],
    queryFn: async () => {
      if (!authUser?.uid) return {};
      const res = await axiosSecure.get(`/user/${authUser.uid}`);
      return res.data;
    },
    enabled: !!authUser?.uid,
  });

  const {
    data: paymentStatus,
    isLoading: paymentLoading,
    refetch: refetchPayment,
  } = useQuery({
    queryKey: ["payment", authUser?.uid, id],
    queryFn: async () => {
      if (!authUser?.uid) return false;
      const res = await axiosSecure.get(`/check-payment/${authUser.uid}/${id}`);
      return res.data.paid;
    },
    enabled: !!authUser?.uid,
  });

  // Check submission status
  const {
    data: submissionStatus,
    isLoading: submissionLoading,
    refetch: refetchSubmission,
  } = useQuery({
    queryKey: ["submission", authUser?.uid, id],
    queryFn: async () => {
      if (!authUser?.uid) return false;
      const res = await axiosSecure.get(
        `/check-submission/${authUser.uid}/${id}`
      );
      return res.data.submitted;
    },
    enabled: !!authUser?.uid && paymentStatus === true,
  });

  const userRole = backendUser?.role || "user";
  const isRegularUser = userRole === "user";
  const isEnded = contest?.deadline && new Date(contest.deadline) < new Date();
  const hasWinner = !!contest?.winner;

  const participantCount = contest?.participants || 0;
  const hasSubmitted = submissionStatus === true;

  // Use backend user data for submission
  const currentUserName =
    backendUser?.displayName || authUser?.displayName || authUser?.email;
  const currentPhotoURL = backendUser?.photoURL || authUser?.photoURL || "";

  // Handle payment success
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("payment") === "success") {
      axiosSecure
        .post("/save-payment", { contestId: id })
        .then(() => {
          refetchContest();
          refetchPayment();
        })
        .catch((err) => {
          console.error("Save payment failed:", err);
        });

      Swal.fire({
        icon: "success",
        title: "Payment Successful!",
        text: "You are now registered!",
        timer: 3000,
        showConfirmButton: false,
      });

      window.history.replaceState({}, "", `/contest/${id}`);
    }
  }, [id, axiosSecure, refetchContest, refetchPayment]);

  const handlePayment = async () => {
    try {
      const res = await axiosSecure.post("/create-checkout-session", {
        contestId: id,
      });
      window.location.href = res.data.url;
    } catch (error) {
      Swal.fire("Error", "Failed to start payment", "error");
    }
  };

  const handleSubmitTask = async () => {
    if (!taskSubmission.trim()) {
      Swal.fire("Error", "Please provide your submission", "error");
      return;
    }

    try {
      await axiosSecure.post("/submissions", {
        contestId: id,
        userUid: authUser.uid,
        userEmail: authUser.email,
        userName: currentUserName,
        userPhotoURL: currentPhotoURL,
        task: taskSubmission,
        submittedAt: new Date().toISOString(),
      });

      Swal.fire("Success!", "Task submitted successfully!", "success");
      setShowSubmitModal(false);
      setTaskSubmission("");
      refetchSubmission();
    } catch (error) {
      console.error("Submit task error:", error);
      Swal.fire("Error", "Failed to submit task", "error");
    }
  };

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <span className="text-4xl mx-auto font-bold text-error">
          Contest Ended
        </span>
      );
    }

    return (
      <div className="text-center my-12">
        <h3 className="text-3xl font-bold mb-6 text-primary">
          Contest Ends In
        </h3>
        <div className="grid grid-cols-4 gap-6 max-w-2xl mx-auto">
          <div className="bg-primary text-primary-content rounded-2xl p-6 shadow-lg">
            <div className="text-5xl font-bold">{days}</div>
            <div className="text-xl">Days</div>
          </div>
          <div className="bg-primary text-primary-content rounded-2xl p-6 shadow-lg">
            <div className="text-5xl font-bold">{hours}</div>
            <div className="text-xl">Hours</div>
          </div>
          <div className="bg-primary text-primary-content rounded-2xl p-6 shadow-lg">
            <div className="text-5xl font-bold">{minutes}</div>
            <div className="text-xl">Minutes</div>
          </div>
          <div className="bg-primary text-primary-content rounded-2xl p-6 shadow-lg">
            <div className="text-5xl font-bold">{seconds}</div>
            <div className="text-xl">Seconds</div>
          </div>
        </div>
      </div>
    );
  };

  if (
    contestLoading ||
    authLoading ||
    userLoading ||
    paymentLoading ||
    submissionLoading
  ) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="card bg-base-100 shadow-2xl overflow-hidden">
          {/* Banner */}
          <figure className="relative">
            <img
              src={contest.image}
              alt={contest.name}
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <h1 className="text-5xl md:text-7xl font-bold text-white p-10">
                {contest.name}
              </h1>
            </div>
          </figure>

          <div className="card-body p-8 md:p-12">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
              <div>
                <p className="text-lg text-base-content/70">Prize Money</p>
                <p className="text-5xl font-bold text-primary mt-2">
                  ${contest.prize}
                </p>
              </div>
              <div>
                <p className="text-lg text-base-content/70">Participants</p>
                <p className="text-5xl font-bold mt-2">{participantCount}</p>
              </div>
              <div>
                <p className="text-lg text-base-content/70">Entry Fee</p>
                <p className="text-4xl font-bold mt-2">${contest.price}</p>
              </div>
            </div>

            {/* Countdown */}
            {contest.deadline && (
              <Countdown
                date={new Date(contest.deadline)}
                renderer={renderer}
              />
            )}

            {/* Description & Task */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 my-12">
              <div>
                <h3 className="text-3xl font-bold mb-6">Contest Description</h3>
                <p className="text-lg leading-relaxed">{contest.description}</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-6">Task Instruction</h3>
                <p className="text-lg leading-relaxed">
                  {contest.taskInstruction}
                </p>
              </div>
            </div>

            {/* Winner */}
            {hasWinner && (
              <div className="bg-success/10 rounded-2xl p-10 text-center my-12">
                <h3 className="text-4xl font-bold text-success mb-8">
                  Winner Announced!
                </h3>
                <div className="avatar">
                  <div className="w-40 rounded-full ring ring-success ring-offset-base-100 ring-offset-4">
                    <img
                      src={
                        contest.winner.photoURL ||
                        "https://i.ibb.co.com/4pB0Z4J/user.png"
                      }
                      alt={contest.winner.name}
                    />
                  </div>
                </div>
                <p className="text-3xl font-bold mt-6">{contest.winner.name}</p>
                <p className="text-xl mt-2">Won ${contest.prize}!</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row justify-center gap-8 mt-12">
              {!isRegularUser && !isEnded && !hasWinner && (
                <div className="alert alert-info shadow-lg max-w-md">
                  <span className="text-lg font-medium">
                    Only normal users can participate.
                  </span>
                </div>
              )}

              {isRegularUser && !isEnded && !paymentStatus && !hasWinner && (
                <button
                  onClick={handlePayment}
                  className="btn btn-primary btn-lg text-xl px-16"
                >
                  Register & Pay ${contest.price}
                </button>
              )}

              {isRegularUser &&
                !isEnded &&
                paymentStatus &&
                !hasSubmitted &&
                !hasWinner && (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="btn btn-success btn-lg text-xl px-16"
                  >
                    Submit Your Task
                  </button>
                )}

              {isRegularUser &&
                !isEnded &&
                paymentStatus &&
                hasSubmitted &&
                !hasWinner && (
                  <button
                    disabled
                    className="btn btn-success btn-lg text-xl px-16 opacity-60 cursor-not-allowed"
                  >
                    Task Submitted ✓
                  </button>
                )}

              {(isEnded || hasWinner) && (
                <div className="alert alert-info shadow-lg max-w-md">
                  <span className="text-xl font-semibold">
                    {hasWinner
                      ? "Winner has been declared!"
                      : "Contest has ended"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Task Modal */}
      {showSubmitModal && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-3xl mb-8 text-center">
              Submit Your Task
            </h3>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-lg font-medium">
                  Provide your submission (links, description, files, etc.)
                </span>
              </label>
              <textarea
                value={taskSubmission}
                onChange={(e) => setTaskSubmission(e.target.value)}
                className="textarea textarea-bordered textarea-lg h-64"
                placeholder="Paste Google Drive/Dropbox links, GitHub repo, or write your submission..."
                required
              />
            </div>
            <div className="modal-action flex justify-end gap-4 mt-8">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="btn btn-ghost btn-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTask}
                disabled={!taskSubmission.trim()}
                className="btn btn-success btn-lg"
              >
                Submit Task
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowSubmitModal(false)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default ContestDetails;
