"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface HistoryItem {
  case_id: string;
  profile: string;
  disease: string;
  created_at: string;
  done: boolean;
  name?: string; // Add optional name field
  symptom?: string; // Add optional symptom field
}
interface ProfileData {
  name: string;
  symptoms: string;
  [key: string]: string | undefined;
}

const PatientHistory: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!session?.user?.email) {
          setLoading(false);
          return;
        }

        // Get user ID from session
        const userResponse = await fetch(
          `/api/user?email=${encodeURIComponent(session.user.email)}`
        );
        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userResponse.json();

        // Fetch instances with matching owner uid
        const response = await fetch(`/api/history?uid=${userData.uid}`);
        if (!response.ok) throw new Error("Failed to fetch history data");
        const data = await response.json();

        setHistoryItems(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [session]);

  const handleViewAnswer = (caseId: string) => {
    router.push(`/evaluation_page?case=${caseId}`);
  };

  const handleViewReport = (caseId: string) => {
    router.push(`/report?case=${caseId}`);
  };

  // Function to get profile data, prioritizing direct name and symptom fields
  const getProfileData = (item: HistoryItem): ProfileData => {
    // Default values
    let name = "[NULL]";
    let symptoms = "[NULL]";

    // First check if we have direct name and symptom fields
    if (item.name) {
      name = item.name;
    }

    if (item.symptom) {
      symptoms = item.symptom;
    }

    // Only use profile parsing as a fallback if direct fields are not available
    if ((!item.name || !item.symptom) && item.profile) {
      try {
        // Try to parse profile as JSON
        const profileData = JSON.parse(item.profile);

        // Only use profile values if direct fields are not set
        if (!item.name && profileData.name) {
          name = profileData.name;
        }

        if (!item.symptom && (profileData.symptoms || profileData.symptom)) {
          symptoms = profileData.symptoms || profileData.symptom;
        }
      } catch (_) {
        // If profile is a filename reference (like patient.json)
        if (
          typeof item.profile === "string" &&
          item.profile.includes(".json")
        ) {
          if (!item.name) {
            name = "Patient Data";
          }
          if (!item.symptom) {
            symptoms = "Details in " + item.profile;
          }
        }
      }
    }

    return {
      name: name,
      symptoms: symptoms,
    };
  };

  if (loading) {
    return <div className="p-6 text-center text-white">Loading history...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  if (historyItems.length === 0) {
    return <div className="p-6 text-center text-white">No history found</div>;
  }

  return (
    <div className="p-6 space-y-4 bg-[#0f172a] min-h-screen">
      <h2 className="text-2xl font-bold text-red-400 mb-4">
        Patient Chat History
      </h2>
      <div className="space-y-4">
        {historyItems.map((item) => {
          // Get profile data using our helper function
          const profileData = getProfileData(item);

          // Format date
          const formattedDate = new Date(item.created_at).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          );

          return (
            <div
              key={item.case_id}
              className="flex items-start justify-between p-6 border rounded-lg shadow-md bg-white"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">□</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-lg font-semibold">
                    <span className="font-bold">Patient Name:</span>{" "}
                    {profileData.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold text-red-500">Symptoms:</span>{" "}
                    {profileData.symptoms}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold text-red-500">Disease:</span>{" "}
                    {item.disease || "Not specified"}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold text-blue-500">Case ID:</span>{" "}
                    {item.case_id}
                    <span
                      className="text-xs text-gray-500 ml-2 cursor-pointer hover:text-blue-500"
                      onClick={() => {
                        navigator.clipboard.writeText(item.case_id);
                        alert("Case ID copied!");
                      }}
                    >
                      (Copy)
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Chat Date: {formattedDate}
                  </p>
                  <p className="text-xs text-gray-500">
                    Status: {item.done ? "Completed" : "In Progress"}
                  </p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleViewAnswer(item.case_id)}
                  className="text-blue-600 hover:underline"
                >
                  View Answer
                </button>
                <button
                  onClick={() => handleViewReport(item.case_id)}
                  className="text-red-600 hover:underline"
                >
                  Report
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PatientHistory;
