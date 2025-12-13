import React from 'react';
import Loading from '../../../components/Loading/Loading';
import Banner from '../Banner/Banner';
import Showcase from '../ShowCase/ShowCase';
import PopularContests from '../PopularContest/PopularContests';


const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <PopularContests></PopularContests>
            <Showcase></Showcase>
        </div>
    );
};

export default Home;