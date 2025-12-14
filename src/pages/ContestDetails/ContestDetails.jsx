import React, { useState } from "react";
import { useParams, Link } from "react-router-dom"; // Added Link for payment
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Countdown from "react-countdown";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ContestDetails = () => {
  const { id } = useParams();
  const { user } = useAuth(); // Assuming user object has: email, displayName, uid, and role
  const axiosSecure = useAxiosSecure();

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [taskSubmission, setTaskSubmission] = useState("");

  const { data: contest, isLoading } = useQuery({
    queryKey: ["contest", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/contest/${id}`);
      return res.data;
    },
  });

  const isEnded = contest?.deadline && new Date(contest.deadline) < new Date();

  // Check if current logged-in user has role "user" (participant)
  const isRegularUser = user && user.role === "user"; // Change "role" if your field name is different

  const handleSubmitTask = async () => {
    if (!taskSubmission.trim()) {
      Swal.fire("Error", "Please provide your submission details", "error");
      return;
    }

    try {
      await axiosSecure.post("/submissions", {
        contestId: id,
        userUid: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        task: taskSubmission,
        submittedAt: new Date().toISOString(),
      });

      Swal.fire({
        icon: "success",
        title: "Submitted!",
        text: "Your task has been submitted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      setShowSubmitModal(false);
      setTaskSubmission("");
    } catch (error) {
      console.error("Submission failed:", error);
      Swal.fire("Error", "Failed to submit task. Try again.", "error");
    }
  };

  // Responsive Countdown Renderer
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <div className="text-center py-8">
          <span className="text-3xl sm:text-4xl font-bold text-error">
            Contest Ended
          </span>
        </div>
      );
    }

    return (
      <div className="w-full text-center py-8 px-4">
        <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-primary">
          Contest Ends In
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
          <div className="bg-primary text-primary-content rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="text-4xl sm:text-5xl font-bold">{days}</div>
            <div className="text-lg sm:text-xl mt-2">Days</div>
          </div>
          <div className="bg-primary text-primary-content rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="text-4xl sm:text-5xl font-bold">{hours}</div>
            <div className="text-lg sm:text-xl mt-2">Hours</div>
          </div>
          <div className="bg-primary text-primary-content rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="text-4xl sm:text-5xl font-bold">{minutes}</div>
            <div className="text-lg sm:text-xl mt-2">Minutes</div>
          </div>
          <div className="bg-primary text-primary-content rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="text-4xl sm:text-5xl font-bold">{seconds}</div>
            <div className="text-lg sm:text-xl mt-2">Seconds</div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="card bg-base-100 shadow-2xl overflow-hidden rounded-3xl">
          {/* Banner */}
          <figure className="relative">
            <img
              src={contest.image}
              alt={contest.name}
              className="w-full h-64 sm:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white p-6 sm:p-10 leading-tight">
                {contest.name}
              </h1>
            </div>
          </figure>

          <div className="card-body p-6 sm:p-8 md:p-12 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-base-200 rounded-2xl p-6">
                <p className="text-sm sm:text-lg text-base-content/70">Prize Money</p>
                <p className="text-4xl sm:text-5xl font-bold text-primary mt-2">
                  ${contest.prize}
                </p>
              </div>
              <div className="bg-base-200 rounded-2xl p-6">
                <p className="text-sm sm:text-lg text-base-content/70">Participants</p>
                <p className="text-4xl sm:text-5xl font-bold mt-2">
                  {contest.participants?.length || 0}
                </p>
              </div>
              <div className="bg-base-200 rounded-2xl p-6">
                <p className="text-sm sm:text-lg text-base-content/70">Entry Fee</p>
                <p className="text-4xl sm:text-5xl font-bold mt-2">${contest.price}</p>
              </div>
            </div>

            {/* Countdown */}
            {contest.deadline && (
              <div className="bg-base-200/50 rounded-3xl -mx-6 sm:mx-0 overflow-hidden">
                <Countdown date={new Date(contest.deadline)} renderer={renderer} />
              </div>
            )}

            {/* Description & Task */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
              <div className="bg-base-200/50 rounded-2xl p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">Contest Description</h3>
                <p className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap text-base-content/80">
                  {contest.description}
                </p>
              </div>
              <div className="bg-base-200/50 rounded-2xl p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">Task Instruction</h3>
                <p className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap text-base-content/80">
                  {contest.taskInstruction}
                </p>
              </div>
            </div>

            {/* Winner Section */}
            {contest.winner && (
              <div className="bg-success/10 rounded-3xl p-8 sm:p-10 text-center border-2 border-success/30">
                <h3 className="text-3xl sm:text-4xl font-bold text-success mb-6">
                  Winner Announced!
                </h3>
                <div className="avatar">
                  <div className="w-32 sm:w-40 rounded-full ring ring-success ring-offset-base-100 ring-offset-4">
                    <img src={contest.winner.photoURL} alt={contest.winner.name} />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold mt-6">{contest.winner.name}</p>
                <p className="text-lg sm:text-xl mt-3 text-success">
                  Congratulations on winning ${contest.prize}!
                </p>
              </div>
            )}

            {/* Action Buttons - Role-Based Visibility */}
            <div className="flex flex-col items-center gap-6 pt-8">
              {/* Only regular users (role: "user") can register/pay or submit */}
              {isRegularUser && !isEnded && (
                <>
                  {/* Pay/Register Button */}
                  <Link
                    to={`/payment/${contest._id}`}
                    className="btn btn-primary btn-lg text-lg sm:text-xl px-12 sm:px-16 w-full sm:w-auto"
                  >
                    Register & Pay ${contest.price}
                  </Link>

                  {/* Submit Task Button - Optional: only if already registered */}
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="btn btn-success btn-lg text-lg sm:text-xl px-12 sm:px-16 w-full sm:w-auto"
                  >
                    Submit Your Task
                  </button>
                </>
              )}

              {/* Contest Ended */}
              {isEnded && (
                <div className="alert alert-warning shadow-lg max-w-md w-full">
                  <span className="text-lg sm:text-xl font-semibold text-center block">
                    Contest has ended
                  </span>
                </div>
              )}

              {/* Not logged in */}
              {!user && !isEnded && (
                <div className="alert alert-info shadow-lg max-w-md w-full">
                  <span className="text-lg sm:text-xl font-semibold text-center block">
                    Please log in to participate
                  </span>
                </div>
              )}

              {/* Logged in but not regular user (e.g., admin/creator) */}
              {user && !isRegularUser && !isEnded && (
                <div className="alert alert-neutral shadow-lg max-w-md w-full">
                  <span className="text-lg sm:text-xl font-semibold text-center block">
                    Only participants can register or submit tasks
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
          <div className="modal-box max-w-2xl w-11/12 mx-auto">
            <h3 className="font-bold text-2xl sm:text-3xl mb-8 text-center">
              Submit Your Task
            </h3>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base sm:text-lg font-medium">
                  Provide your submission (links, description, files, etc.)
                </span>
              </label>
              <textarea
                value={taskSubmission}
                onChange={(e) => setTaskSubmission(e.target.value)}
                className="textarea textarea-bordered textarea-lg h-64 sm:h-72 text-base"
                placeholder="Paste Google Drive/Dropbox links, GitHub repo, or write your submission..."
                required
              />
            </div>
            <div className="modal-action flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="btn btn-ghost btn-lg w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTask}
                disabled={!taskSubmission.trim()}
                className="btn btn-success btn-lg w-full sm:w-auto order-1 sm:order-2"
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