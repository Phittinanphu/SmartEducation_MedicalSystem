'use client'

import { useSearchParams } from 'next/navigation'
import SubmitSuccessScreen from '@/app/components/submit/SubmitSuccess'

export default function SubmitSuccessPage() {
  const searchParams = useSearchParams()
  const caseId = searchParams.get('caseId')
  const answer = searchParams.get('answer')

  // Handle case where parameters are missing
  if (!caseId || !answer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">
            Missing required parameters. Please try submitting your exam again.
          </p>
        </div>
      </div>
    )
  }

  return <SubmitSuccessScreen caseId={caseId} answer={answer} />
} 