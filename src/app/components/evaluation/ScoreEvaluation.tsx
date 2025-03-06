import React, { useState, useEffect } from 'react';

// ---------------------------------------------------
// Define types and interfaces
// ---------------------------------------------------
// Overall domain scores interface
interface DomainScores {
  domain1: number; // Communication Skills
  domain2: number; // General History Taking
  domain3: number; // Disease-Specific History
  domain4: number; // Diagnosis
}

// Evaluation data includes case name and overall domain scores
interface EvaluationData {
  case: string;
  scores: DomainScores;
}

// Type alias for keys in DomainScores
type DomainKey = keyof DomainScores;

// Each evaluation metric has an id, description, and maximum score.
interface EvaluationMetric {
  id: string;
  description: string;
  maxScore: number;
}

// Input JSON structure: overall domain scores and detailed metric scores.
interface InputData {
  case?: string;
  domainScores?: DomainScores;
  evaluationMetricScores?: Record<DomainKey, Record<string, number>>;
}

// Props for ScoreEvaluation component.
interface ScoreEvaluationProps {
  inputData?: InputData;
}

// ---------------------------------------------------
// Define maximum domain scores for each case
// ---------------------------------------------------
const domainMaxScores: Record<string, DomainScores> = {
  'Peptic ulcer disease': { domain1: 20, domain2: 30, domain3: 30, domain4: 20 },
  'Acute pancreatitis': { domain1: 20, domain2: 60, domain3: 30, domain4: 20 },
  'Food poisoning': { domain1: 20, domain2: 60, domain3: 30, domain4: 20 },
  'Renal stone': { domain1: 20, domain2: 60, domain3: 30, domain4: 20 },
  'Unknown Case': { domain1: 20, domain2: 30, domain3: 30, domain4: 20 },
};

// ---------------------------------------------------
// Define user-friendly labels for each domain
// ---------------------------------------------------
const domainLabels: Record<DomainKey, string> = {
  domain1: 'Communication Skills',
  domain2: 'General History Taking',
  domain3: 'Disease-Specific History',
  domain4: 'Diagnosis',
};

// ---------------------------------------------------
// Define evaluation metrics (detailed metric items for each case and domain)
// ---------------------------------------------------
const evaluationMetrics: Record<string, Record<DomainKey, EvaluationMetric[]>> = {
  'Peptic ulcer disease': {
    domain1: [
      { id: '1.1', description: 'แนะนำตัว แจ้งชื่อ-สกุล ผู้ซักประวัติ', maxScore: 4 },
      { id: '1.2', description: 'ถามชื่อ-สกุลของผู้ป่วย', maxScore: 4 },
      { id: '1.3', description: 'ขออนุญาตและแจ้งวัตถุประสงค์', maxScore: 4 },
      { id: '1.4', description: 'ใช้คำถามมีความต่อเนื่อง เชื่อมโยง และมีจังหวะการรับฟังเหมาะสม', maxScore: 6 },
      { id: '1.5', description: 'เปิดโอกาสให้ผู้ป่วยซักถาม', maxScore: 2 },
    ],
    domain2: [
      { id: '2.1', description: 'ตำแหน่งที่มีอาการปวดท้อง', maxScore: 3 },
      { id: '2.2', description: 'ปวดทันทีหรือค่อยๆ มากขึ้น', maxScore: 3 },
      { id: '2.3', description: 'ลักษณะการปวดท้อง (ปวดบีบ/จุกแน่น/ปวดตื้อๆ)', maxScore: 2 },
    ],
    domain3: [
      { id: '3.1', description: 'Episodic burning epigastric pain', maxScore: 6 },
      { id: '3.2', description: 'Symptoms worse after eating, on an empty stomach and nighttime awakening', maxScore: 6 },
      { id: '3.3', description: 'Symptoms relieved with food and antacids', maxScore: 6 },
      { id: '3.4', description: 'Melena or hematemesis', maxScore: 6 },
      { id: '3.5', description: 'Less common symptoms: nausea, vomiting, loss of appetite, bloating', maxScore: 6 },
    ],
    domain4: [
      { id: '4.1', description: 'Diagnosis: Peptic ulcer disease', maxScore: 20 },
    ],
  },
  'Acute pancreatitis': {
    domain1: [
      { id: '1.1', description: 'แนะนำตัว แจ้งชื่อ-สกุล ผู้ซักประวัติ', maxScore: 4 },
      { id: '1.2', description: 'ถามชื่อ-สกุลของผู้ป่วย', maxScore: 4 },
      { id: '1.3', description: 'ขออนุญาตและแจ้งวัตถุประสงค์', maxScore: 4 },
      { id: '1.4', description: 'ใช้คำถามมีความต่อเนื่อง เชื่อมโยง และมีจังหวะการรับฟังเหมาะสม', maxScore: 6 },
      { id: '1.5', description: 'เปิดโอกาสให้ผู้ป่วยซักถาม', maxScore: 2 },
    ],
    domain2: [
      { id: '2.1', description: 'ตำแหน่งที่มีอาการปวดท้อง', maxScore: 3 },
      { id: '2.2', description: 'ปวดทันทีหรือค่อยๆ มากขึ้น', maxScore: 3 },
      { id: '2.3', description: 'ลักษณะการปวดท้อง (ปวดบีบ/จุกแน่น/ปวดตื้อๆ)', maxScore: 2 },
    ],
    domain3: [
      { id: '3.1', description: 'severe epigastric and RUQ pain', maxScore: 6 },
      { id: '3.2', description: 'Pain from gallstones: sudden onset', maxScore: 6 },
      { id: '3.3', description: 'Pain from alcohol: more gradual onset', maxScore: 6 },
      { id: '3.4', description: 'Characteristics include acute and constant pain', maxScore: 6 },
      { id: '3.5', description: 'Radiation to the back', maxScore: 6 },
    ],
    domain4: [
      { id: '4.1', description: 'Diagnosis: Acute pancreatitis', maxScore: 20 },
    ],
  },
  'Food poisoning': {
    domain1: [
      { id: '1.1', description: 'แนะนำตัว แจ้งชื่อ-สกุล ผู้ซักประวัติ', maxScore: 4 },
      { id: '1.2', description: 'ถามชื่อ-สกุลของผู้ป่วย', maxScore: 4 },
      { id: '1.3', description: 'ขออนุญาตและแจ้งวัตถุประสงค์', maxScore: 4 },
      { id: '1.4', description: 'ใช้คำถามมีความต่อเนื่อง เชื่อมโยง และมีจังหวะการรับฟังเหมาะสม', maxScore: 6 },
      { id: '1.5', description: 'เปิดโอกาสให้ผู้ป่วยซักถาม', maxScore: 2 },
    ],
    domain2: [
      { id: '2.1', description: 'ตำแหน่งที่มีอาการปวดท้อง', maxScore: 3 },
      { id: '2.2', description: 'ปวดทันทีหรือค่อยๆ มากขึ้น', maxScore: 3 },
      { id: '2.3', description: 'ลักษณะการปวดท้อง (ปวดบีบ/จุกแน่น/ปวดตื้อๆ)', maxScore: 2 },
    ],
    domain3: [
      { id: '3.1', description: 'Characteristic of stool (watery, mucous, bloody), frequency and amount', maxScore: 6 },
      { id: '3.2', description: 'Characteristic of vomitus, frequency', maxScore: 6 },
      { id: '3.3', description: 'Nausea, vomiting, loss of appetite, bloating', maxScore: 6 },
      { id: '3.4', description: 'History of food exposure (raw, cooked, spoiled food)', maxScore: 6 },
      { id: '3.5', description: 'People in the house who have the same symptoms', maxScore: 6 },
    ],
    domain4: [
      { id: '4.1', description: 'Diagnosis: Food poisoning', maxScore: 20 },
    ],
  },
  'Renal stone': {
    domain1: [
      { id: '1.1', description: 'แนะนำตัว แจ้งชื่อ-สกุล ผู้ซักประวัติ', maxScore: 4 },
      { id: '1.2', description: 'ถามชื่อ-สกุลของผู้ป่วย', maxScore: 4 },
      { id: '1.3', description: 'ขออนุญาตและแจ้งวัตถุประสงค์', maxScore: 4 },
      { id: '1.4', description: 'ใช้คำถามมีความต่อเนื่อง เชื่อมโยง และมีจังหวะการรับฟังเหมาะสม', maxScore: 6 },
      { id: '1.5', description: 'เปิดโอกาสให้ผู้ป่วยซักถาม', maxScore: 2 },
    ],
    domain2: [
      { id: '2.1', description: 'ตำแหน่งที่มีอาการปวดท้อง', maxScore: 3 },
      { id: '2.2', description: 'ปวดทันทีหรือค่อยๆ มากขึ้น', maxScore: 3 },
      { id: '2.3', description: 'ลักษณะการปวดท้อง (ปวดบีบ/จุกแน่น/ปวดตื้อๆ)', maxScore: 2 },
    ],
    domain3: [
      { id: '3.1', description: 'Pain starts rapidly and waxes and wanes', maxScore: 6 },
      { id: '3.2', description: 'Flank pain (radiating into lower abdomen and genitals)', maxScore: 6 },
      { id: '3.3', description: 'Hematuria (gross or microscopic)', maxScore: 6 },
      { id: '3.4', description: 'Recurrent UTIs', maxScore: 6 },
      { id: '3.5', description: 'Bladder dysfunction (if stone lodged at ureter-bladder junction)', maxScore: 3 },
      { id: '3.6', description: 'Personal history: DM, Obesity', maxScore: 3 },
      { id: '3.7', description: 'Medication use (Calcium supplements, Vitamin D)', maxScore: 3 },
    ],
    domain4: [
      { id: '4.1', description: 'Diagnosis: Renal stone', maxScore: 20 },
    ],
  },
  'Unknown Case': {
    domain1: [],
    domain2: [],
    domain3: [],
    domain4: [],
  },
};

// ---------------------------------------------------
// Reusable Card Components for UI layout
// ---------------------------------------------------
// Card: A container with border, padding, shadow, and white background.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
const Card: React.FC<CardProps> = ({ children, className = '', ...rest }) => (
  <div {...rest} className={`border rounded-lg p-4 shadow-md bg-white ${className}`}>
    {children}
  </div>
);

// CardContent: A simple container with padding.
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
const CardContent: React.FC<CardContentProps> = ({ children, className = '', ...rest }) => (
  <div {...rest} className={`p-2 ${className}`}>
    {children}
  </div>
);

// ---------------------------------------------------
// ScoreEvaluation Component
// ---------------------------------------------------
const ScoreEvaluation: React.FC<ScoreEvaluationProps> = ({ inputData }) => {
  // State for currently selected domain section
  const [DomainSection, setSelectedDomain] = useState<DomainKey | null>(null);

  // State to hold overall evaluation data (case and domain scores)
  const [evaluationData, setEvaluationData] = useState<EvaluationData>({
    case: 'Unknown Case',
    scores: { domain1: 0, domain2: 0, domain3: 0, domain4: 0 },
  });

  // Default metric scores object for all domains
  const defaultMetricScores: Record<DomainKey, Record<string, number>> = {
    domain1: {},
    domain2: {},
    domain3: {},
    domain4: {},
  };

  // Extract evaluation metric scores from inputData; if not provided, use defaultMetricScores.
  const metricScores: Record<DomainKey, Record<string, number>> =
    inputData?.evaluationMetricScores ?? defaultMetricScores;

  // Update overall evaluation data when inputData changes
  useEffect(() => {
    if (inputData && inputData.case) {
      setEvaluationData({
        case: inputData.case,
        scores: {
          domain1: inputData.domainScores?.domain1 ?? 0,
          domain2: inputData.domainScores?.domain2 ?? 0,
          domain3: inputData.domainScores?.domain3 ?? 0,
          domain4: inputData.domainScores?.domain4 ?? 0,
        },
      });
    } else {
      setEvaluationData({
        case: 'Unknown Case',
        scores: { domain1: 0, domain2: 0, domain3: 0, domain4: 0 },
      });
    }
  }, [inputData]);

  // Determine current case and maximum scores for each domain
  const currentCase = evaluationData.case || 'Unknown Case';
  const maxScores = domainMaxScores[currentCase] || domainMaxScores['Unknown Case'];

  // Build array of domain entries (label, score, max)
  const domainEntries = (Object.keys(evaluationData.scores) as DomainKey[]).map((domainKey) => {
    const score = evaluationData.scores[domainKey];
    const max = maxScores[domainKey];
    return {
      domainKey,
      label: domainLabels[domainKey],
      score,
      max,
    };
  });

  // Calculate total possible points and total achieved score
  const totalMaxPoints = domainEntries.reduce((acc, d) => acc + d.max, 0);
  const totalScore = domainEntries.reduce((acc, d) => acc + d.score, 0);

  // Determine highest and lowest scoring domains
  const sortedDomains = [...domainEntries].sort((a, b) => b.score - a.score);
  const highestDomain = sortedDomains[0];
  const lowestDomain = sortedDomains[sortedDomains.length - 1];

  return (
    <div className="p-6">
      {/* Header showing the current evaluation case */}
      <h2 className="text-xl font-bold mb-4">
        Accuracy Per Concept (Case: {evaluationData.case})
      </h2>

      {/* Display highest and lowest accuracy domains */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
        <div className="mr-6 mb-2 sm:mb-0">
          <strong>Highest Accuracy</strong>:<br />
          Your accuracy is highest in <b>{highestDomain?.label}</b>
        </div>
        <div>
          <strong>Lowest Accuracy</strong>:<br />
          Your accuracy is lowest in <b>{lowestDomain?.label}</b>
        </div>
      </div>

      {/* Render each domain's overall score and detailed evaluation metrics */}
      <div className="space-y-4">
        {domainEntries.map(({ domainKey, label, score, max }) => {
          const percentage = max > 0 ? Math.round((score / max) * 100) : 0;
          return (
            <Card key={domainKey}>
              <CardContent>
                {/* Domain header with label and percentage */}
                <div className="flex justify-between items-center">
                  <div className="font-semibold">{label}</div>
                  <div className="text-sm">{percentage}%</div>
                </div>
                {/* Horizontal progress bar for overall domain score (green color) */}
                <div className="mt-2 bg-gray-200 w-full h-3 rounded-full">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                {/* Button to toggle detailed evaluation metrics view */}
                <button
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={() => setSelectedDomain(DomainSection === domainKey ? null : domainKey)}
                >
                  {DomainSection === domainKey ? 'Hide' : 'View'} Evaluation Metrics
                </button>
                {/* Conditionally render evaluation metrics details if domain is selected */}
                {DomainSection === domainKey && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <ul className="list-disc list-inside">
                      {evaluationMetrics[currentCase][domainKey] &&
                      evaluationMetrics[currentCase][domainKey].length > 0 ? (
                        evaluationMetrics[currentCase][domainKey].map((metric, idx) => {
                          // Retrieve student's score for each metric; default to 0 if not provided.
                          const studentScore =
                            (metricScores[domainKey] && metricScores[domainKey][metric.id]) ?? 0;
                          return (
                            <li key={idx} className="mb-2">
                              <strong>{metric.id}.</strong> {metric.description} – Score: {studentScore} / {metric.maxScore} points
                              {/* Discrete progress visualization: Render one bar per point */}
                              <div className="flex space-x-1 mt-1">
                                {Array.from({ length: metric.maxScore }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-4 h-4 rounded ${studentScore > i ? 'bg-green-500' : 'bg-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </li>
                          );
                        })
                      ) : (
                        <li>No evaluation metrics available for this section.</li>
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Display overall total score */}
      <div className="mt-6">
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold">Total Score</h3>
            <p className="text-2xl font-bold">
              {totalScore} / {totalMaxPoints}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScoreEvaluation;
