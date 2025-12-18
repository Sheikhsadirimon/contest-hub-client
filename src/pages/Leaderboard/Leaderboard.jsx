import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/Loading/Loading";

const Leaderboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await axiosSecure.get("/leaderboard");
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <section className="py-16 bg-gradient-to-b from-base-200 to-base-300 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
            🏆 Global Leaderboard 🏆
          </h1>
          <p className="text-2xl text-base-content/80 font-medium">
            Top Champions of ContestHub
          </p>
          <p className="text-lg text-base-content/60 mt-4">
            Ranked by total contest wins
          </p>
        </div>

        {/* Podium for Top 3 */}
        {top3.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {/* 2nd Place */}
            {top3[1] && (
              <div className="order-2 md:order-1 flex flex-col items-center">
                <div className="relative">
                  <div className="avatar">
                    <div className="w-32 rounded-full ring ring-offset-base-100 ring-offset-8 ring-silver ring-8">
                      <img
                        src={
                          top3[1].photoURL ||
                          "https://i.ibb.co/4pB0Z4J/user.png"
                        }
                        alt={top3[1].displayName}
                      />
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-gray-600 text-white text-4xl font-bold rounded-full w-16 h-16 flex items-center justify-center shadow-2xl">
                    2
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold">{top3[1].displayName}</h3>
                  <p className="text-lg text-base-content/70">
                    {top3[1].wins} Wins
                  </p>
                </div>
                <div className="mt-4">
                  <span className="text-6xl">🥈</span>
                </div>
              </div>
            )}

            {/* 1st Place - Champion */}
            {top3[0] && (
              <div className="order-1 md:order-2 pb-5 flex flex-col items-center scale-110">
                <div className="relative">
                  <div className="avatar">
                    <div className="w-40 rounded-full ring ring-offset-base-100 ring-offset-8 ring-yellow-400 ring-8 shadow-2xl">
                      <img
                        src={
                          top3[0].photoURL ||
                          "https://i.ibb.co/4pB0Z4J/user.png"
                        }
                        alt={top3[0].displayName}
                      />
                    </div>
                  </div>
                  <div className="absolute -top-6 -right-6 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-5xl font-bold rounded-full w-20 h-20 flex items-center justify-center shadow-2xl border-4 border-white">
                    1
                  </div>
                  <div className="absolute inset-0 rounded-full bg-yellow-400/20 animate-ping"></div>
                </div>
                <div className="mt-8 text-center">
                  <h3 className="text-3xl font-bold text-yellow-600">
                    {top3[0].displayName}
                  </h3>
                  <p className="text-2xl font-bold">{top3[0].wins} Wins</p>
                </div>
                <div className="mt-6">
                  <span className="text-8xl">🏆</span>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {top3[2] && (
              <div className="order-3 md:order-3 flex flex-col items-center">
                <div className="relative">
                  <div className="avatar">
                    <div className="w-32 rounded-full ring ring-offset-base-100 ring-offset-8 ring-orange-600 ring-8">
                      <img
                        src={
                          top3[2].photoURL ||
                          "https://i.ibb.co/4pB0Z4J/user.png"
                        }
                        alt={top3[2].displayName}
                      />
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-orange-600 text-white text-4xl font-bold rounded-full w-16 h-16 flex items-center justify-center shadow-2xl">
                    3
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold">{top3[2].displayName}</h3>
                  <p className="text-lg text-base-content/70">
                    {top3[2].wins} Wins
                  </p>
                </div>
                <div className="mt-4">
                  <span className="text-6xl">🥉</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rest of the Leaderboard */}
        {rest.length > 0 && (
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body">
              <h3 className="text-3xl font-bold text-center mb-8">
                Full Rankings
              </h3>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr className="text-lg">
                      <th>Rank</th>
                      <th>User</th>
                      <th>Wins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rest.map((user, index) => (
                      <tr key={user.uid} className="hover">
                        <th className="text-xl font-bold">#{index + 4}</th>
                        <td>
                          <div className="flex items-center gap-4">
                            <div className="avatar">
                              <div className="w-12 rounded-full">
                                <img
                                  src={
                                    user.photoURL ||
                                    "https://i.ibb.co/4pB0Z4J/user.png"
                                  }
                                  alt={user.displayName}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">
                                {user.displayName}
                              </div>
                              <div className="text-sm opacity-70">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-xl font-bold text-primary">
                          {user.wins}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {leaderboard.length === 0 && (
          <div className="text-center py-20">
            <p className="text-3xl font-bold mb-4">No Winners Yet!</p>
            <p className="text-xl text-base-content/70">
              Be the first to climb the leaderboard! 🚀
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Leaderboard;
