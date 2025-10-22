'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCharacterTypeInfo, getCharacterTypeColor } from '@/lib/characterTypes';

interface TestParticipant {
  id: string;
  fullName: string;
  nickName?: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  testOrder: {
    id: string;
    orderNumber: string;
    type: string;
    packageType: string;
  };
}

interface Certificate {
  id: string;
  certificateNumber: string;
  issuedAt: string;
  certificateUrl?: string;
}

interface TestResult {
  id: string;
  characterType: string;
  score: number;
  completedAt: string;
  testParticipant: TestParticipant;
  certificate?: Certificate;
}

export default function TestResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const resultId = params.id as string;

  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResultDetails();
  }, [resultId]);

  const fetchResultDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/test-results/${resultId}`);

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        if (response.status === 404) {
          setError('Test result not found');
          setLoading(false);
          return;
        }
        throw new Error('Failed to fetch test result');
      }

      const data = await response.json();
      setResult(data.testResult);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching result:', err);
      setError(err.message || 'Failed to load test result');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test result...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md">
          <div className="text-red-600 text-5xl mb-4 text-center">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Error</h2>
          <p className="text-gray-600 text-center mb-4">{error || 'Result not found'}</p>
          <button
            onClick={() => router.push('/customer/test-results')}
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  const characterInfo = getCharacterTypeInfo(result.characterType);
  const colorClass = getCharacterTypeColor(result.characterType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/customer/test-results')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            ← Back to Results
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Personality Test Result</h1>
          <p className="text-gray-600 mt-2">Comprehensive analysis and recommendations</p>
        </div>

        {/* Participant Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {result.testParticipant.fullName}
              </h2>
              {result.testParticipant.nickName && (
                <p className="text-gray-600 mb-2">"{result.testParticipant.nickName}"</p>
              )}
              <p className="text-sm text-gray-500">{result.testParticipant.email}</p>
              <p className="text-sm text-gray-500 mt-2">
                Completed on: {new Date(result.completedAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Test Score</div>
              <div className="text-4xl font-bold text-blue-600">{result.score}</div>
              {result.certificate && (
                <div className="mt-4">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-semibold">
                    Certified
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Character Type Banner */}
        <div className={`rounded-2xl p-8 shadow-lg mb-6 border-2 ${colorClass}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">{characterInfo.icon}</div>
            <div>
              <h2 className="text-3xl font-bold">{characterInfo.name}</h2>
              <p className="text-xl opacity-90">{characterInfo.tagline}</p>
            </div>
          </div>
          <p className="text-lg leading-relaxed">{characterInfo.description}</p>
        </div>

        {/* Key Traits */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-2xl font-bold mb-4">Key Personality Traits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {characterInfo.traits.map((trait, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-blue-600 text-xl">✓</span>
                <span className="text-gray-800">{trait}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Strengths */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-green-600">💪</span>
              Strengths
            </h3>
            <ul className="space-y-3">
              {characterInfo.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">●</span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-orange-600">⚠️</span>
              Areas for Development
            </h3>
            <ul className="space-y-3">
              {characterInfo.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-orange-600 mt-1">●</span>
                  <span className="text-gray-700">{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Career Recommendations */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>💼</span>
            Career Recommendations
          </h3>
          <p className="text-gray-600 mb-4">
            Based on your personality type, here are some career paths that might suit you well:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {characterInfo.careerRecommendations.map((career, index) => (
              <div
                key={index}
                className="p-3 bg-blue-50 text-blue-800 rounded-lg text-center font-semibold"
              >
                {career}
              </div>
            ))}
          </div>
        </div>

        {/* Work Style */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>🎯</span>
            Work Style & Preferences
          </h3>
          <ul className="space-y-3">
            {characterInfo.workStyle.map((style, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-purple-600 text-xl">→</span>
                <span className="text-gray-700">{style}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Relationship Insights */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>❤️</span>
            Relationship Insights
          </h3>
          <p className="text-gray-600 mb-4">
            Understanding your personality can help improve your relationships:
          </p>
          <ul className="space-y-3">
            {characterInfo.relationshipInsights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg">
                <span className="text-pink-600 text-xl">♥</span>
                <span className="text-gray-700">{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Development Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg mb-6 border-2 border-blue-200">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>🌱</span>
            Personal Development Tips
          </h3>
          <p className="text-gray-700 mb-4">
            Here are some suggestions to help you grow and develop:
          </p>
          <ul className="space-y-3">
            {characterInfo.developmentTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-green-600 font-bold">{index + 1}.</span>
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.certificate ? (
              <button
                onClick={() => {
                  // TODO: Implement certificate download
                  alert('Certificate download coming soon!');
                }}
                className="py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Download Certificate
              </button>
            ) : (
              <div className="py-3 bg-gray-100 text-gray-500 rounded-lg text-center font-semibold">
                Certificate Pending
              </div>
            )}
            <button
              onClick={() => window.print()}
              className="py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Print Result
            </button>
            <button
              onClick={() => {
                // TODO: Implement share functionality
                alert('Share functionality coming soon!');
              }}
              className="py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              Share Result
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-sm text-yellow-900">
            <strong>Note:</strong> This personality assessment is designed to provide insights and guidance.
            Remember that personality is complex and multifaceted. Use this information as a tool for
            self-reflection and growth, not as a limitation.
          </p>
        </div>
      </div>
    </div>
  );
}
