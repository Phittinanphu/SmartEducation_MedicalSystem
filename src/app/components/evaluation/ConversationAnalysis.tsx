// ConversationAnalysis.tsx
import React from "react";

interface ConversationItem {
  question: string; // Student's question
  comment: string; // LLM's comment
  userMessage?: string; // Alternative field name for question
  aiMessage?: string; // Alternative field name for comment
  timestamp?: string; // Optional timestamp for when the conversation occurred
}

interface ConversationAnalysisProps {
  data: ConversationItem[];
  onShowEvaluationMetrics: () => void; // Add this prop
}

const ConversationAnalysis: React.FC<ConversationAnalysisProps> = ({
  data,
  onShowEvaluationMetrics,
}) => {
  // Handle case when no data is available
  if (!data || data.length === 0) {
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

  // Log the received data for debugging
  console.log("Conversation data received in component:", data);

  // Check if we have actual conversation data or placeholder
  const isPlaceholder =
    data.length === 1 &&
    data[0].question?.includes("currently unavailable") &&
    data[0].comment?.includes("currently unavailable");

  return (
    <div className="flex w-full">
      <div className="flex-1 p-6">
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
              type="button"
              className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500"
              onClick={onShowEvaluationMetrics}
            >
              Evaluation Metrics
            </button>
          </div>

          {isPlaceholder ? (
            <div
              className="mt-6 p-6 bg-gray-100 rounded-lg text-center"
              style={{ fontSize: "18px", color: "#555" }}
            >
              <p className="mb-4">
                This feature is currently being developed. Conversation analysis
                will be available in a future update.
              </p>
              <p>
                When available, this section will show a detailed analysis of
                your conversation with the patient.
              </p>
            </div>
          ) : (
            <div className="flex">
              <div className="flex-1" style={{ marginTop: "20px" }}>
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
                      <p style={{ margin: "4px 0", color: "#555" }}>
                        {item.question ||
                          item.userMessage ||
                          "No question available"}
                      </p>
                    </div>

                    <div>
                      <strong style={{ color: "blue" }}>Comment:</strong>
                      <p style={{ margin: "4px 0", color: "#555" }}>
                        {item.comment ||
                          item.aiMessage ||
                          "No comment available"}
                      </p>
                    </div>

                    {item.timestamp && (
                      <div className="mt-2 text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationAnalysis;
