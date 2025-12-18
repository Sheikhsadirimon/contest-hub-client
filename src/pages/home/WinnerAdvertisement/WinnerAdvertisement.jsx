import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router";
import Loading from "../../../components/Loading/Loading";

const WinnerAdvertisement = () => {
  const axiosSecure = useAxiosSecure();

  const { data: recentWinners = [], isLoading } = useQuery({
    queryKey: ["recentWinners"],
    queryFn: async () => {
      const res = await axiosSecure.get("/recent-winners");
      return res.data;
    },
  });

  const totalWinners = recentWinners.length;

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <section className="py-20 overflow-hidden relative">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 text-9xl">🏆</div>
        <div className="absolute bottom-20 right-20 text-8xl">💰</div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-primary bg-clip-text text-transparent">
            Celebrate Our Champions! 🏆
          </h2>
          <p className="text-2xl md:text-3xl font-medium">
            Showcase Your Skills. Compete. Win Big!
          </p>
          <p className="text-xl mt-4 opacity-90">
            Join thousands of creators and claim your victory today.
          </p>
        </div>

        {recentWinners.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl">Be the first winner! 🚀</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {recentWinners.map((winner) => (
              <div
                key={winner._id}
                className="card bg-white/10 backdrop-blur-md shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-300"
              >
                <div className="card-body text-center p-8">
                  <div className="avatar mb-4">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 mx-auto">
                      <img
                        src={
                          winner.winner.photoURL ||
                          "https://i.ibb.co/4pB0Z4J/user.png"
                        }
                        alt={winner.winner.name}
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold">{winner.winner.name}</h3>
                  <p className="text-lg opacity-90">Won</p>
                  <p className="text-4xl font-extrabold text-primary my-2">
                    ${winner.prize}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <p className="text-3xl font-bold mb-4">3 Talented Recent Winners!</p>
          <p className="text-xl opacity-90">
            Your name could be next on this wall of fame.
          </p>
          <Link
            to={"/all-contests"}
            className="btn btn-primary btn-lg mt-8 shadow-2xl"
          >
            Join a Contest Now!
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WinnerAdvertisement;
