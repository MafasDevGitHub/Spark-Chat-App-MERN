import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import styled from "styled-components";
import Robot from '../assets/robot.gif';

const Welcome = ({ currentUser }) => {
    return (
        <Container>
            <img src={Robot} alt="Robot" />

            <h1>
                Welcome, <span>{currentUser.username}!</span>
            </h1>

            <h3>
                Please select a chat to Start Messaging.
            </h3>
        </Container>
    );
};

// Define prop types for validation
Welcome.propTypes = {
    currentUser: PropTypes.shape({
        username: PropTypes.string.isRequired
    }).isRequired,
};

const Container = styled.div`

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;

    img {
        height: 20rem;
    }

    span {
        color: #4e00ff;
    }

`;

export default Welcome;
