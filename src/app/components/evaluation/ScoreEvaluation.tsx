import React, { useState, useEffect } from 'react';

// ---------------------------------------------------
// TYPES & INTERFACES
// ---------------------------------------------------

// Overall evaluation data now only uses the case name (domain scores will be computed).
interface EvaluationData {
  case: string;
}

// Domain keys alias.
export type DomainKey = 'domain1' | 'domain2' | 'domain3' | 'domain4';

// Each evaluation metric has an ID, description, and maximum score.
export interface EvaluationMetric {
  id: string;
  description: string;
  maxScore: number;
}

// Input JSON structure includes the case and detailed metric scores.
export interface InputData {
  case?: string;
  evaluationMetricScores?: Record<DomainKey, Record<string, number>>;
}

// Props for the ScoreEvaluation component.
interface ScoreEvaluationProps {
  inputData?: InputData;
}

// ---------------------------------------------------
// CONFIGURATION DATA
// ---------------------------------------------------

// Maximum overall scores per domain for each case.
const domainMaxScores: Record<string, { [key in DomainKey]: number }> = {
  'Peptic ulcer disease': { domain1: 20, domain2: 30, domain3: 30, domain4: 20 },
  'Acute pancreatitis': { domain1: 20, domain2: 60, domain3: 30, domain4: 20 },
  'Food poisoning': { domain1: 20, domain2: 60, domain3: 30, domain4: 20 },
  'Renal stone': { domain1: 20, domain2: 60, domain3: 30, domain4: 20 },
  'Unknown Case': { domain1: 20, domain2: 30, domain3: 30, domain4: 20 },
};

// Labels for each domain.
const domainLabels: Record<DomainKey, string> = {
  domain1: 'Communication Skills',
  domain2: 'General History Taking',
  domain3: 'Disease-Specific History',
  domain4: 'Diagnosis',
};

// Detailed evaluation metrics for each case and domain.
// These values are based on the provided PDF.
const evaluationMetrics: Record<string, Record<DomainKey, EvaluationMetric[]>> = {
  'Peptic ulcer disease': {
    domain1: [
      { id: '1.1', description: 'แนะนำตัว แจ้งชื่อ-สกุล ผู้ซักประวัติ', maxScore: 4 },
      { id: '1.2', description: 'ถามชื่อ-สกุลของผู้ป่วย', maxScore: 4 },
      { id: '1.3', description: 'ขออนุญาตและแจ้งวัตถุประสงค์', maxScore: 4 },
      { id: '1.4', description: 'ใช้คำถามมีความต่อเนื่อง เชื่อมโยง และมีจังหวะการรับฟังเหมาะสม', maxScore: 6 },
      { id: '1.5', description: 'เปิดโอกาสให้ผู้ป่วยซักถาม', maxScore: 2 }
    ],
    domain2: [
      { id: '2.1', description: 'ตำแหน่งที่มีอาการปวดท้อง', maxScore: 3 },
      { id: '2.2', description: 'ปวดทันทีหรือค่อยๆมากขึ้น', maxScore: 3 },
      { id: '2.3', description: 'ลักษณะการปวดท้อง (ปวดบีบ/จุกแน่น/ปวดตื้อๆ)', maxScore: 2 },
      { id: '2.4', description: 'ปวดร้าวไปที่ใด', maxScore: 2 },
      { id: '2.5', description: 'ปวดตลอดเวลาหรือมีอาการปวดเป็นพักๆ', maxScore: 2 },
      { id: '2.6', description: 'ปัจจัยที่ทำให้อาการปวดดีขึ้นหรือแย่ลง', maxScore: 2 },
      { id: '2.7', description: 'ขณะมีอาการปวดท้องกำลังทำอะไรอยู่', maxScore: 2 },
      { id: '2.8', description: 'อาการปวดท้องในอดีตที่มีลักษณะคล้ายกัน', maxScore: 2 },
      { id: '2.9', description: 'ประวัติเคยผ่าตัดช่องท้อง', maxScore: 2 },
      { id: '2.10', description: 'โรคประจำตัวและยาที่ใช้เป็นประจำ', maxScore: 2 },
      { id: '2.11', description: 'ประวัติการสูบบุหรี่', maxScore: 2 },
      { id: '2.12', description: 'ประวัติดื่มสุรา/การใช้ยาประจำ', maxScore: 2 },
      { id: '2.13', description: 'ประวัติการรักษาก่อนมาพบแพทย์', maxScore: 2 },
      { id: '2.14', description: 'ประวัติอุบัติเหตุก่อนมีอาการหรือไม่', maxScore: 2 }
    ],
    domain3: [
      { id: '3.1', description: 'Episodic burning epigastric pain', maxScore: 6 },
      { id: '3.2', description: 'Symptoms worse after eating, on an empty stomach and nighttime awakening', maxScore: 6 },
      { id: '3.3', description: 'Symptoms relieved with food and antacids', maxScore: 6 },
      { id: '3.4', description: 'Melena or hematemesis', maxScore: 6 },
      { id: '3.5', description: 'Less common symptoms: nausea, vomiting, loss of appetite, bloating', maxScore: 6 }
    ],
    domain4: [
      { id: '4.1', description: 'Diagnosis: Peptic ulcer disease', maxScore: 20 }
    ]
  },
  'Acute pancreatitis': {
    domain1: [
      { id: '1.1', description: 'แนะนำตัว แจ้งชื่อ-สกุล ผู้ซักประวัติ', maxScore: 4 },
      { id: '1.2', description: 'ถามชื่อ-สกุลของผู้ป่วย', maxScore: 4 },
      { id: '1.3', description: 'ขออนุญาตและแจ้งวัตถุประสงค์', maxScore: 4 },
      { id: '1.4', description: 'ใช้คำถามมีความต่อเนื่อง เชื่อมโยง และมีจังหวะการรับฟังเหมาะสม', maxScore: 6 },
      { id: '1.5', description: 'เปิดโอกาสให้ผู้ป่วยซักถาม', maxScore: 2 }
    ],
    domain2: [
      { id: '2.1', description: 'ตำแหน่งที่มีอาการปวดท้อง', maxScore: 3 },
      { id: '2.2', description: 'ปวดทันทีหรือค่อยๆมากขึ้น', maxScore: 3 },
      { id: '2.3', description: 'ลักษณะการปวดท้อง (ปวดบีบ/จุกแน่น/ปวดตื้อๆ)', maxScore: 2 },
      { id: '2.4', description: 'ปวดร้าวไปที่ใด', maxScore: 2 },
      { id: '2.5', description: 'ปวดตลอดเวลาหรือมีอาการปวดเป็นพักๆ', maxScore: 2 },
      { id: '2.6', description: 'ปัจจัยที่ทำให้อาการปวดดีขึ้นหรือแย่ลง', maxScore: 2 },
      { id: '2.7', description: 'ขณะมีอาการปวดท้องกำลังทำอะไรอยู่', maxScore: 2 },
      { id: '2.8', description: 'อาการปวดท้องในอดีตที่มีลักษณะคล้ายกัน', maxScore: 2 },
      { id: '2.9', description: 'ประวัติเคยผ่าตัดช่องท้อง', maxScore: 2 },
      { id: '2.10', description: 'โรคประจำตัวและยาที่ใช้เป็นประจำ', maxScore: 2 },
      { id: '2.11', description: 'ประวัติการสูบบุหรี่', maxScore: 2 },
      { id: '2.12', description: 'ประวัติดื่มสุรา/การใช้ยาประจำ', maxScore: 2 },
      { id: '2.13', description: 'ประวัติการรักษาก่อนมาพบแพทย์', maxScore: 2 },
      { id: '2.14', description: 'ประวัติอุบัติเหตุก่อนมีอาการหรือไม่', maxScore: 2 }
    ],
    domain3: [
      { id: '3.1', description: 'severe epigastric and RUQ pain', maxScore: 6 },
      { id: '3.2', description: 'Pain from gallstones: sudden onset', maxScore: 6 },
      { id: '3.3', description: 'Pain from anything related to ethanol or alcohol: more gradual onset', maxScore: 6 },
      { id: '3.4', description: 'Characteristics include acute and constant pain', maxScore: 6 },
      { id: '3.5', description: 'Radiation to the back', maxScore: 6 }
    ],
    domain4: [
      { id: '4.1', description: 'Diagnosis: Acute pancreatitis', maxScore: 20 }
    ]
  },
  'Food poisoning': {
    domain1: [
      { id: '1.1', description: 'แนะนำตัว แจ้งชื่อ-สกุล ผู้ซักประวัติ', maxScore: 4 },
      { id: '1.2', description: 'ถามชื่อ-สกุลของผู้ป่วย', maxScore: 4 },
      { id: '1.3', description: 'ขออนุญาตและแจ้งวัตถุประสงค์', maxScore: 4 },
      { id: '1.4', description: 'ใช้คำถามมีความต่อเนื่อง เชื่อมโยง และมีจังหวะการรับฟังเหมาะสม', maxScore: 6 },
      { id: '1.5', description: 'เปิดโอกาสให้ผู้ป่วยซักถาม', maxScore: 2 }
    ],
    domain2: [
      { id: '2.1', description: 'ตำแหน่งที่มีอาการปวดท้อง', maxScore: 3 },
      { id: '2.2', description: 'ปวดทันทีหรือค่อยๆมากขึ้น', maxScore: 3 },
      { id: '2.3', description: 'ลักษณะการปวดท้อง (ปวดบีบ/จุกแน่น/ปวดตื้อๆ)', maxScore: 2 },
      { id: '2.4', description: 'ปวดร้าวไปที่ใด', maxScore: 2 },
      { id: '2.5', description: 'ปวดตลอดเวลาหรือมีอาการปวดเป็นพักๆ', maxScore: 2 },
      { id: '2.6', description: 'ปัจจัยที่ทำให้อาการปวดดีขึ้นหรือแย่ลง', maxScore: 2 },
      { id: '2.7', description: 'ขณะมีอาการปวดท้องกำลังทำอะไรอยู่', maxScore: 2 },
      { id: '2.8', description: 'อาการปวดท้องในอดีตที่มีลักษณะคล้ายกัน', maxScore: 2 },
      { id: '2.9', description: 'ประวัติเคยผ่าตัดช่องท้อง', maxScore: 2 },
      { id: '2.10', description: 'โรคประจำตัวและยาที่ใช้เป็นประจำ', maxScore: 2 },
      { id: '2.11', description: 'ประวัติการสูบบุหรี่', maxScore: 2 },
      { id: '2.12', description: 'ประวัติดื่มสุรา/การใช้ยาประจำ', maxScore: 2 },
      { id: '2.13', description: 'ประวัติการรักษาก่อนมาพบแพทย์', maxScore: 2 },
      { id: '2.14', description: 'ประวัติอุบัติเหตุก่อนมีอาการหรือไม่', maxScore: 2 }
    ],
    domain3: [
      { id: '3.1', description: 'Characteristic of stool (watery, mucous, bloody), frequency of stool and amount of stool', maxScore: 6 },
      { id: '3.2', description: 'Characteristic of vomitus, Frequency of vomit', maxScore: 6 },
      { id: '3.3', description: 'nausea, vomiting, loss of appetite, bloating', maxScore: 6 },
      { id: '3.4', description: 'History of food exposure (raw, cooked, spoiled food)', maxScore: 6 },
      { id: '3.5', description: 'People in the house who have the same symptoms', maxScore: 6 }
    ],
    domain4: [
      { id: '4.1', description: 'Diagnosis: Food poisoning', maxScore: 20 }
    ]
  },
  'Renal stone': {
    domain1: [
      { id: '1.1', description: 'แนะนำตัว แจ้งชื่อ-สกุล ผู้ซักประวัติ', maxScore: 4 },
      { id: '1.2', description: 'ถามชื่อ-สกุลของผู้ป่วย', maxScore: 4 },
      { id: '1.3', description: 'ขออนุญาตและแจ้งวัตถุประสงค์', maxScore: 4 },
      { id: '1.4', description: 'ใช้คำถามมีความต่อเนื่อง เชื่อมโยง และมีจังหวะการรับฟังเหมาะสม', maxScore: 6 },
      { id: '1.5', description: 'เปิดโอกาสให้ผู้ป่วยซักถาม', maxScore: 2 }
    ],
    domain2: [
      { id: '2.1', description: 'ตำแหน่งที่มีอาการปวดท้อง', maxScore: 3 },
      { id: '2.2', description: 'ปวดทันทีหรือค่อยๆมากขึ้น', maxScore: 3 },
      { id: '2.3', description: 'ลักษณะการปวดท้อง (ปวดบีบ/จุกแน่น/ปวดตื้อๆ)', maxScore: 2 }
    ],
    domain3: [
      { id: '3.1', description: 'Pain starts rapidly and waxes and wanes', maxScore: 6 },
      { id: '3.2', description: 'Flank pain (commonly radiating into lower abdomen and genitals as the stone passes down the ureter)', maxScore: 6 },
      { id: '3.3', description: 'Hematuria (gross or microscopic)', maxScore: 6 },
      { id: '3.4', description: 'Recurrent UTIs', maxScore: 6 },
      { id: '3.5', description: 'Bladder dysfunction (if the stone is lodged at the junction between the ureter and bladder)', maxScore: 3 },
      { id: '3.6', description: 'Personal history of: DM, Obesity', maxScore: 3 },
      { id: '3.7', description: 'Medication use, including Calcium containing supplements, Vitamin D', maxScore: 3 }
    ],
    domain4: [
      { id: '4.1', description: 'Diagnosis: Renal stone', maxScore: 20 }
    ]
  },
  'Unknown Case': {
    domain1: [],
    domain2: [],
    domain3: [],
    domain4: []
  }
};

// ---------------------------------------------------
// REUSABLE UI COMPONENTS
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
// SCORE EVALUATION COMPONENT
// ---------------------------------------------------
const ScoreEvaluation: React.FC<ScoreEvaluationProps> = ({ inputData }) => {
  // State for the currently selected domain section.
  const [DomainSection, setSelectedDomain] = useState<DomainKey | null>(null);

  // We only need to capture the case from inputData; domain scores will be computed.
  const [evaluationCase, setEvaluationCase] = useState<string>('Unknown Case');

  // Default metric scores for all domains.
  const defaultMetricScores: Record<DomainKey, Record<string, number>> = {
    domain1: {},
    domain2: {},
    domain3: {},
    domain4: {}
  };

  // Extract metric scores from inputData, or use default.
  const metricScores: Record<DomainKey, Record<string, number>> =
    inputData?.evaluationMetricScores ?? defaultMetricScores;

  // Update evaluationCase when inputData changes.
  useEffect(() => {
    if (inputData && inputData.case) {
      setEvaluationCase(inputData.case);
    } else {
      setEvaluationCase('Unknown Case');
    }
  }, [inputData]);

  // Determine current case.
  const currentCase = evaluationCase || 'Unknown Case';

  // Build an array of domain entries by computing the domain score from metric scores.
  const domainEntries = (Object.keys(domainLabels) as DomainKey[]).map(domainKey => {
    // Get metrics for this domain and case.
    const metrics = evaluationMetrics[currentCase][domainKey] || [];
    // Compute total score for this domain by summing scores for each metric.
    const computedScore = metrics.reduce((sum, metric) => {
      const scoreForMetric = (metricScores[domainKey] && metricScores[domainKey][metric.id]) ?? 0;
      return sum + scoreForMetric;
    }, 0);
    // Compute maximum score for this domain by summing the maxScore of each metric.
    const computedMax = metrics.reduce((sum, metric) => sum + metric.maxScore, 0);
    return {
      domainKey,
      label: domainLabels[domainKey],
      score: computedScore,
      max: computedMax
    };
  });

  // Calculate overall total score and overall maximum score.
  const totalScore = domainEntries.reduce((sum, entry) => sum + entry.score, 0);
  const totalMaxPoints = domainEntries.reduce((sum, entry) => sum + entry.max, 0);

  // Determine highest and lowest scoring domains.
  const sortedDomains = [...domainEntries].sort((a, b) => b.score - a.score);
  const highestDomain = sortedDomains[0];
  const lowestDomain = sortedDomains[sortedDomains.length - 1];

  return (
    <div className="p-6">
      {/* Header showing current case */}
      <h2 className="text-xl font-bold mb-4">
        Accuracy Per Concept (Case: {currentCase})
      </h2>

      {/* Display highest and lowest accuracy domains */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
        <div className="mr-6 mb-2 sm:mb-0">
          <strong>Highest Accuracy</strong>:<br />
          Your highest score is in <b>{highestDomain?.label}</b>
        </div>
        <div>
          <strong>Lowest Accuracy</strong>:<br />
          Your lowest score is in <b>{lowestDomain?.label}</b>
        </div>
      </div>

      {/* Render each domain's details */}
      <div className="space-y-4">
        {domainEntries.map(({ domainKey, label, score, max }) => {
          // Compute percentage for progress bar.
          const percentage = max > 0 ? Math.round((score / max) * 100) : 0;
          return (
            <Card key={domainKey}>
              <CardContent>
                {/* Domain header displaying total score/maximum score */}
                <div className="flex justify-between items-center">
                  <div className="font-semibold">{label}</div>
                  <div className="text-sm">{score} / {max}</div>
                </div>
                {/* Overall domain progress bar (green) */}
                <div className="mt-2 bg-gray-200 w-full h-3 rounded-full">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: `${percentage}%` }} />
                </div>
                {/* Button to toggle detailed metric view */}
                <button
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={() => setSelectedDomain(DomainSection === domainKey ? null : domainKey)}
                >
                  {DomainSection === domainKey ? 'Hide' : 'View'} Evaluation Metrics
                </button>
                {/* Detailed evaluation metrics for the domain */}
                {DomainSection === domainKey && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <ul className="list-disc list-inside">
                      {evaluationMetrics[currentCase][domainKey] && evaluationMetrics[currentCase][domainKey].length > 0 ? (
                        evaluationMetrics[currentCase][domainKey].map((metric, idx) => {
                          // Retrieve the student's score for this metric; default to 0.
                          const studentScore = (metricScores[domainKey] && metricScores[domainKey][metric.id]) ?? 0;
                          return (
                            <li key={idx} className="mb-2">
                              <strong>{metric.id}.</strong> {metric.description} – Score: {studentScore} / {metric.maxScore} points
                              {/* Discrete bars for each point in this metric */}
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

      {/* Overall total score card */}
      <div className="mt-6">
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold">Total Score</h3>
            <p className="text-2xl font-bold">{totalScore} / {totalMaxPoints}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScoreEvaluation;
