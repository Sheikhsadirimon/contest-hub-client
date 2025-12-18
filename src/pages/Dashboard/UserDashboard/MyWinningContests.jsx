import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../../components/Loading/Loading";

const MyWinningContests = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: winningContests = [], isLoading } = useQuery({
    queryKey: ["myWinnings", user?.uid],
    queryFn: async () => {
      const participatedRes = await axiosSecure.get("/my-participated");
      const participated = participatedRes.data;

      return participated.filter(
        (contest) => contest.winner && contest.winner.uid === user.uid
      );
    },
    enabled: !!user?.uid,
  });

  if (authLoading || isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
          🏆 My Winning Contests 🏆
        </h1>
        <p className="text-xl text-base-content/70 mt-4">
          Celebrate your victories and showcase your achievements!
        </p>
      </div>

      {winningContests.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-9xl mb-8">🥈</div>
          <h3 className="text-3xl font-bold mb-4">No Wins Yet</h3>
          <p className="text-lg text-base-content/70 max-w-md mx-auto">
            Keep participating and submitting your best work — your trophy
            moment is coming soon!
          </p>
          <div className="mt-8">
            <span className="text-6xl">💪</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {winningContests.map((contest) => (
            <div
              key={contest._id}
              className="card bg-gradient-to-br from-amber-50 to-orange-100 shadow-2xl border-4 border-amber-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-amber-500 text-white px-6 py-3 rounded-bl-3xl font-bold shadow-lg">
                WINNER!
              </div>

              <div className="card-body text-center pt-12">
                <div className="text-6xl mb-4">🏆</div>

                <h3 className="card-title text-2xl font-bold text-amber-800 justify-center">
                  {contest.name}
                </h3>

                <div className="my-6">
                  <p className="text-5xl font-extrabold text-amber-600">
                    ${contest.prize}
                  </p>
                  <p className="text-lg text-amber-700 font-medium">
                    Prize Won
                  </p>
                </div>

                <div className="space-y-2 text-black">
                  <p>
                    <span className="font-semibold">Hosted by:</span>{" "}
                    {contest.creatorEmail}
                  </p>
                  <p>
                    <span className="font-semibold ">Won on:</span>{" "}
                    {new Date(contest.deadline).toLocaleDateString()}
                  </p>
                </div>

                <div className="card-actions justify-center mt-8">
                  <div className="badge badge-lg badge-warning gap-2 py-4 px-6">
                    <span className="text-2xl">🎉</span> Champion
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWinningContests;
