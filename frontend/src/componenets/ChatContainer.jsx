import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getAllMessagesRoute, sendMessageRoute } from "../utils/APIRoutes";
import PropTypes from "prop-types";
import styled from "styled-components";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from 'uuid';



const ChatContainer = ({ currentChat, currentUser, socket }) => {

    const [messages, setMessages] = useState([]);
    const [arraivalMessage, setArraivalMessage] = useState(null);

    const scrollRef = useRef();

    useEffect(() => {
        const fetchMessages = async () => {
            if (currentChat) {
                try {
                    const response = await axios.post(getAllMessagesRoute, {
                        from: currentUser._id,
                        to: currentChat._id,
                    });
                    setMessages(response.data);
                } catch (error) {
                    console.error("Failed to fetch messages:", error);
                }
            }
        };
        fetchMessages();
    }, [currentChat, currentUser]);

    // Handle sending a message
    const handleSendMsg = async (msg) => {
        if (currentChat) {
            try {
                await axios.post(sendMessageRoute, {
                    from: currentUser._id,
                    to: currentChat._id,
                    message: msg,
                });
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { fromSelf: true, message: msg },
                ]);
            } catch (error) {
                console.error("Failed to send message:", error);
            }
        }

        socket.current.emit("send-msg", {
            to: currentChat._id,
            from: currentUser._id,
            message: msg,
        });

        const msgs = [...messages];
        msgs.push({fromSelf: true, message: msg});
        setMessages(msgs);
    };

    useEffect(() => {

        if(socket.current){
            socket.current.on("msg-recieve", (msg) => {
                setArraivalMessage({fromSelf: false, message: msg});
            })
        }
    },[]);

    useEffect(() => {
        arraivalMessage && setMessages((prev) => [...prev, arraivalMessage]);
    },[arraivalMessage]);


    useEffect(() => {
        scrollRef.current?.scrollIntoView({behaviour: "smooth"});
    },[messages])



    if (!currentChat) {
        return <div>Please select a chat to start messaging.</div>;
    }

    return (
        <Container>
            <div className="chat-header">
                <div className="user-details">
                    <div className="avatar">
                        <img
                            src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                            alt="avatar"
                        />
                    </div>
                    <div className="username">
                        <h3>{currentChat.username}</h3>
                    </div>
                </div>
                <Logout />
            </div>
            <div className="chat-messages">
                {messages.map((message, index) => (
                   <div ref={scrollRef} key={uuidv4()}>
                     <div key={index} className={`message ${message.fromSelf ? "sended" : "received"}`}>
                        <div className="content">
                            <p>{message.message}</p>
                        </div>
                    </div>
                   </div>
                ))}
            </div>
            <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
    );
};

// Prop types for validation
ChatContainer.propTypes = {
    currentChat: PropTypes.shape({
        username: PropTypes.string,
        avatarImage: PropTypes.string,
        _id: PropTypes.string,
    }),
    currentUser: PropTypes.shape({
        _id: PropTypes.string.isRequired,
    }).isRequired,
    socket: PropTypes.object.isRequired, // Validate socket as a generic object
};

// Styled-components for styling
const Container = styled.div`
    padding-top: 1rem;
    display: grid;
    grid-template-rows: 10% 78% 12%;
    gap: 1rem;
    overflow: hidden;

    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;

        .user-details {
            display: flex;
            align-items: center;
            gap: 1rem;

            .avatar img {
                height: 3rem;
            }

            .username h3 {
                color: white;
            }
        }
    }

    .chat-messages {
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;

        .message {
            display: flex;
            align-items: center;

            .content {
                max-width: 40%;
                overflow-wrap: break-word;
                padding: 1rem;
                font-size: 1.1rem;
                border-radius: 1rem;
                color: #d1d1d1;
            }
        }

        .sended {
            justify-content: flex-end;

            .content {
                background-color: #4f04ff21;
            }
        }

        .received {
            justify-content: flex-start;

            .content {
                background-color: #9900ff20;
            }
        }
    }
`;

export default ChatContainer;
