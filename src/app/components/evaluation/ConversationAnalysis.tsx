// ConversationAnalysis.tsx
import React from "react";

interface ConversationItem {
  question: string; // Student's question
  comment: string; // LLM's comment
}

interface ConversationAnalysisProps {
  data: ConversationItem[];
  onShowEvaluationMetrics: () => void; // Add this prop
}

const ConversationAnalysis: React.FC<ConversationAnalysisProps> = ({
  data,
  onShowEvaluationMetrics,
}) => {
  if (!data) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        No conversation data available.
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "#333", fontSize: "24px", fontWeight: "bold" }}>
          Conversation Analysis
        </h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={onShowEvaluationMetrics}
        >
          Evaluation Metrics
        </button>
      </div>

      {data.map((item, index) => (
        <div
          key={index}
          style={{
            marginBottom: "16px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "16px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ marginBottom: "8px" }}>
            <strong style={{ color: "blue" }}>Question:</strong>
            <p style={{ margin: "4px 0", color: "#555" }}>{item.question}</p>
          </div>

          <div>
            <strong style={{ color: "blue" }}>Comment:</strong>
            <p style={{ margin: "4px 0", color: "#555" }}>{item.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationAnalysis;
