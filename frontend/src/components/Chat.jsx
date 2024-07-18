import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, FormControl } from 'react-bootstrap';
import { FaComments } from 'react-icons/fa';
import axios from 'axios';
import { getResponseFromOpenAI } from '../openaiClient';

const Chat = () => {
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [step, setStep] = useState(0);
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
      const initialMessage = { role: "assistant", content: 'Welcome to Tech Market Place! My name is Ignacio. We offer services such as web and app development, digital marketing and SEO, business intelligence, and machine learning. Don’t forget to visit our startups and news sections. How can I assist you today?' };
      setMessages([initialMessage]);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const saveMessagesToDB = async (messages) => {
    try {
      await axios.post('http://localhost:5000/api/chat/save-messages', { messages });
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const userMessage = { role: "user", content: newMessage };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      let assistantMessage;
      if (step === 0) {
        assistantMessage = { role: "assistant", content: 'May I have your name, please?' };
        setStep(1);
      } else if (step === 1) {
        setClientInfo({ ...clientInfo, name: newMessage });
        assistantMessage = { role: "assistant", content: `Nice to meet you, ${newMessage}. Can I have your email address?` };
        setStep(2);
      } else if (step === 2) {
        setClientInfo({ ...clientInfo, email: newMessage });
        assistantMessage = { role: "assistant", content: 'Thank you! Can I have your phone number?' };
        setStep(3);
      } else if (step === 3) {
        setClientInfo({ ...clientInfo, phone: newMessage });
        assistantMessage = { role: "assistant", content: 'Thanks! How can I assist you today?' };
        setStep(4);
      } else {
        const assistantResponse = await getResponseFromOpenAI(newMessage, [...messages, userMessage]);
        assistantMessage = { role: "assistant", content: assistantResponse };
      }
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      saveMessagesToDB([...messages, userMessage, assistantMessage]);
    } catch (error) {
      console.error("Error getting response from OpenAI:", error);
      const errorMessage = { role: "system", content: "Sorry, there was an error processing your message. Please try again." };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      saveMessagesToDB([...messages, userMessage, errorMessage]);
    }

    setNewMessage('');
  };

  const handleClearMessages = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)} className="floating-chat-button">
        <FaComments />
      </Button>

      <Modal show={show} onHide={() => setShow(false)} dialogClassName="floating-chat-modal">
        <Modal.Header closeButton>
          <Modal.Title>Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="chat-messages" ref={chatContainerRef} style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <div key={index} className={msg.role === 'user' ? 'my-message' : 'other-message'}>
                {msg.role === 'user' ? "You: " : "Ignacio: "} {msg.content}
              </div>
            ))}
          </div>
          <Form onSubmit={handleSendMessage}>
            <FormControl
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <div className="chat-buttons">
              <Button type="submit">Send</Button>
              <Button variant="danger" onClick={handleClearMessages}>Clear All</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Chat;
