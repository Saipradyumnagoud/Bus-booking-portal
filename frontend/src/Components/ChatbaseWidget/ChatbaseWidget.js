import React, { useState } from "react";

const ChatbaseWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={styles.container}>
      {/* Chat Bubble Icon */}
      <button onClick={() => setIsOpen(!isOpen)} style={styles.chatButton}>
        💬
      </button>

      {/* Chatbox (Opens when isOpen is true) */}
      {isOpen && (
        <div style={styles.chatContainer}>
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/FR5_va3TWeZaFp3N_DA-3"
            style={styles.iframeStyle}
            frameBorder="0"
            title="Chatbase Chatbot"
          ></iframe>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
  },
  chatButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    fontSize: "24px",
    cursor: "pointer",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  chatContainer: {
    position: "fixed",
    bottom: "80px",
    right: "20px",
    width: "350px",
    height: "500px",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#fff",
  },
  iframeStyle: {
    width: "100%",
    height: "100%",
    border: "none",
  },
};

export default ChatbaseWidget;
