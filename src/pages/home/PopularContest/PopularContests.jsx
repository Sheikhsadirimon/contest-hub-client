import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import useAxios from "../../../hooks/useAxios";
import Loading from "../../../components/Loading/Loading";


const PopularContests = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
    });

    const fetchContests = async () => {
      try {
        const response = await axiosInstance.get("/contests");
        setContests(response.data);
      } catch (error) {
        console.error("Error fetching contests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [axiosInstance]);

  const handleViewDetails = (id) => {
    navigate(`/contest/${id}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="py-16 bg-base-200">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-base-content mb-4">
            Popular Contests
          </h2>
          <p className="text-lg text-base-content/70">
            Trending contests with highest participation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {contests.map((contest, index) => (
            <div
              key={contest._id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-primary overflow-hidden group"
            >
              <figure className="relative overflow-hidden">
                <img
                  src={contest.image}
                  alt={contest.name}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 badge badge-primary font-bold text-lg py-3 px-4">
                  {contest.prize}
                </div>
              </figure>

              <div className="card-body p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="badge badge-outline badge-lg font-medium">
                    {contest.category}
                  </div>
                  <div className="badge badge-success badge-lg">active</div>
                </div>

                <h3 className="card-title text-lg font-bold text-base-content">
                  {contest.name}
                </h3>

                <p className="text-base-content/70 text-sm mt-2 line-clamp-3">
                  {contest.description.length > 100
                    ? `${contest.description.slice(0, 100)}...`
                    : contest.description}
                </p>

                <div className="mt-4 flex items-center text-sm text-base-content/60">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  {contest.participants?.toLocaleString() || 0} participants
                </div>

                <div className="card-actions mt-6">
                  <button
                    onClick={() => handleViewDetails(contest._id)}
                    className="btn btn-primary w-full rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/all-contests"
            className="btn btn-outline btn-lg rounded-full px-12 font-bold border-2 hover:bg-primary hover:text-primary-content transition-all"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Show All Contests
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularContests;