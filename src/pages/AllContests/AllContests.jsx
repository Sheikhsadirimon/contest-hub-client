import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import useAxios from "../../hooks/useAxios";
import Loading from "../../components/Loading/Loading";

const AllContests = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
    });

    const fetchContests = async () => {
      try {
        const response = await axiosInstance.get("/contests");
        
        const approvedContests = response.data.filter(contest => contest.status === "approved");
        setContests(approvedContests);
        setFilteredContests(approvedContests);
      } catch (error) {
        console.error("Error fetching contests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [axiosInstance]);

  
  const categories = ["All", ...new Set(contests.map(c => c.category))];

  const handleTabChange = (category) => {
    setActiveTab(category);
    if (category === "All") {
      setFilteredContests(contests);
    } else {
      setFilteredContests(contests.filter(c => c.category === category));
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/contest/${id}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="py-16 bg-base-200 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-base-content mb-4">
            All Contests
          </h2>
          <p className="text-lg text-base-content/70">
            Explore every active and approved contest
          </p>
        </div>

       
        <div className="flex justify-center mb-12">
          <div className="tabs tabs-boxed bg-base-300 p-2 rounded-xl shadow-lg">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleTabChange(category)}
                className={`tab tab-lg font-semibold transition-all ${
                  activeTab === category
                    ? "tab-active rounded-xl bg-primary text-primary-content"
                    : "text-base-content rounded-xl hover:bg-base-200"
                }`}
              >
                {category === "All" ? "All Contests" : category}
              </button>
            ))}
          </div>
        </div>

        
        {filteredContests.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-base-content/60">No contests found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredContests.map((contest, index) => (
              <div
                key={contest._id}
                data-aos="fade-up"
                data-aos-delay={index * 50}
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
        )}
      </div>
    </section>
  );
};

export default AllContests;