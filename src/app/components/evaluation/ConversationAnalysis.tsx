// ConversationAnalysis.tsx
import React from 'react';

interface ConversationItem {
  question: string;  // Student's question
  comment: string;   // LLM's comment
}

interface ConversationAnalysisProps {
  data: ConversationItem[];
}

const ConversationAnalysis: React.FC<ConversationAnalysisProps> = ({ data }) => {
  return (
    <div
      style={{
        backgroundColor: '#f0f8ff', // Light blue background
        padding: '20px',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ color: '#333' }}>Conversation Analysis</h1>
      
      {data.map((item, index) => (
        <div
          key={index}
          style={{
            marginBottom: '16px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            <strong style={{ color: '#333' }}>Student's Question:</strong>
            <p style={{ margin: '4px 0', color: '#555' }}>
              {item.question}
            </p>
          </div>
          
          <div>
            <strong style={{ color: '#333' }}>LLM's Comment:</strong>
            <p style={{ margin: '4px 0', color: '#555' }}>
              {item.comment}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationAnalysis;
