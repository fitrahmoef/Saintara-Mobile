'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PACKAGE_PRICING, PackageType, calculateOrderTotal, formatCurrency } from '@/lib/pricing';
import * as XLSX from 'xlsx';

interface Participant {
  fullName: string;
  nickName?: string;
  email: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
  bloodType?: 'A' | 'B' | 'AB' | 'O';
  studentNumber?: string;
  className?: string;
}

type OrderType = 'PERSONAL' | 'INSTANSI' | 'SEKOLAH' | 'SOSIAL_GIFT';

export default function CreateTestOrderPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [orderType, setOrderType] = useState<OrderType>('PERSONAL');
  const [selectedPackages, setSelectedPackages] = useState<PackageType[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [notes, setNotes] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'manual' | 'excel'>('manual');

  // Manual entry state
  const [manualParticipant, setManualParticipant] = useState<Participant>({
    fullName: '',
    nickName: '',
    email: '',
    dateOfBirth: '',
    gender: 'MALE',
    bloodType: 'O',
    studentNumber: '',
    className: '',
  });

  const totalAmount = calculateOrderTotal(
    selectedPackages,
    participants.length || 1
  );

  const handlePackageToggle = (pkg: PackageType) => {
    setSelectedPackages(prev =>
      prev.includes(pkg)
        ? prev.filter(p => p !== pkg)
        : [...prev, pkg]
    );
  };

  const handleDownloadTemplate = () => {
    const template = [
      {
        'Full Name': 'John Doe',
        'Nick Name': 'John',
        'Email': 'john@example.com',
        'Date of Birth (YYYY-MM-DD)': '1990-01-01',
        'Gender (MALE/FEMALE)': 'MALE',
        'Blood Type (A/B/AB/O)': 'O',
        'Student Number': '12345',
        'Class Name': '10A',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Participants');
    XLSX.writeFile(wb, 'SAINTARA_Participant_Template.xlsx');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

        const parsedParticipants: Participant[] = jsonData.map((row) => ({
          fullName: row['Full Name'] || '',
          nickName: row['Nick Name'] || '',
          email: row['Email'] || '',
          dateOfBirth: row['Date of Birth (YYYY-MM-DD)'] || '',
          gender: (row['Gender (MALE/FEMALE)'] || 'MALE') as 'MALE' | 'FEMALE',
          bloodType: row['Blood Type (A/B/AB/O)'] as 'A' | 'B' | 'AB' | 'O' | undefined,
          studentNumber: row['Student Number'] || '',
          className: row['Class Name'] || '',
        }));

        setParticipants(parsedParticipants);
        setError(null);
      } catch (err) {
        setError('Failed to parse Excel file. Please use the template.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleAddManualParticipant = () => {
    if (!manualParticipant.fullName || !manualParticipant.email || !manualParticipant.dateOfBirth) {
      setError('Please fill in required fields (Full Name, Email, Date of Birth)');
      return;
    }

    setParticipants([...participants, manualParticipant]);
    setManualParticipant({
      fullName: '',
      nickName: '',
      email: '',
      dateOfBirth: '',
      gender: 'MALE',
      bloodType: 'O',
      studentNumber: '',
      className: '',
    });
    setError(null);
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedPackages.length === 0) {
      setError('Please select at least one package');
      return;
    }

    if (participants.length === 0) {
      setError('Please add at least one participant');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const pricePerPerson = selectedPackages.reduce(
        (total, pkg) => total + PACKAGE_PRICING[pkg].price,
        0
      );

      const response = await fetch('/api/test-orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: orderType,
          packages: selectedPackages,
          participants,
          pricePerPerson,
          totalAmount,
          scheduledDate: scheduledDate || null,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Redirect to the created order
      router.push(`/customer/test-orders/${data.data.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
      setLoading(false);
    }
  };

  const canProceedToStep2 = orderType !== null;
  const canProceedToStep3 = selectedPackages.length > 0;
  const canProceedToStep4 = participants.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Test Order</h1>
          <p className="text-gray-600 mt-2">Follow the steps to create a new test order</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex justify-between items-center">
            {[
              { num: 1, label: 'Order Type' },
              { num: 2, label: 'Select Package' },
              { num: 3, label: 'Add Participants' },
              { num: 4, label: 'Review & Submit' },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step >= s.num
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {s.num}
                  </div>
                  <span className="text-sm mt-2 text-gray-600">{s.label}</span>
                </div>
                {idx < 3 && (
                  <div
                    className={`flex-1 h-1 ${
                      step > s.num ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Step 1: Order Type */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Select Order Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  type: 'PERSONAL' as OrderType,
                  title: 'Personal Test',
                  desc: 'Individual personality test for personal development',
                  icon: '👤',
                },
                {
                  type: 'INSTANSI' as OrderType,
                  title: 'Organization Test',
                  desc: 'Bulk test for organization members or employees',
                  icon: '🏢',
                },
                {
                  type: 'SEKOLAH' as OrderType,
                  title: 'School Test',
                  desc: 'Bulk test for students and educational institutions',
                  icon: '🎓',
                },
                {
                  type: 'SOSIAL_GIFT' as OrderType,
                  title: 'Social Gift',
                  desc: 'Gift tests to others as social contribution',
                  icon: '🎁',
                },
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() => setOrderType(option.type)}
                  className={`p-6 border-2 rounded-xl text-left transition ${
                    orderType === option.type
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-4xl mb-3">{option.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{option.desc}</p>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setStep(2)}
                disabled={!canProceedToStep2}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Select Package
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Package Selection */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Select Test Package</h2>
            <p className="text-gray-600 mb-6">Choose one or more packages for your participants</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(Object.keys(PACKAGE_PRICING) as PackageType[]).map((pkg) => {
                const packageInfo = PACKAGE_PRICING[pkg];
                const isSelected = selectedPackages.includes(pkg);
                return (
                  <div
                    key={pkg}
                    onClick={() => handlePackageToggle(pkg)}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-800">
                        {packageInfo.name}
                      </h3>
                      <span className="text-xl font-bold text-blue-600">
                        {formatCurrency(packageInfo.price)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{packageInfo.description}</p>
                    <ul className="space-y-2">
                      {packageInfo.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handlePackageToggle(pkg)}
                        className="mr-2"
                      />
                      <span className="text-sm font-semibold text-gray-700">
                        {isSelected ? 'Selected' : 'Select this package'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceedToStep3}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Add Participants
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Add Participants */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Add Participants</h2>

            {/* Upload Method Selection */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setUploadMethod('manual')}
                className={`flex-1 p-4 border-2 rounded-lg transition ${
                  uploadMethod === 'manual'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <span className="text-2xl mb-2 block">✍️</span>
                <span className="font-semibold">Manual Entry</span>
              </button>
              <button
                onClick={() => setUploadMethod('excel')}
                className={`flex-1 p-4 border-2 rounded-lg transition ${
                  uploadMethod === 'excel'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <span className="text-2xl mb-2 block">📊</span>
                <span className="font-semibold">Excel Upload</span>
              </button>
            </div>

            {/* Manual Entry Form */}
            {uploadMethod === 'manual' && (
              <div className="border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">Add Participant Manually</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={manualParticipant.fullName}
                    onChange={(e) =>
                      setManualParticipant({ ...manualParticipant, fullName: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Nick Name"
                    value={manualParticipant.nickName}
                    onChange={(e) =>
                      setManualParticipant({ ...manualParticipant, nickName: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={manualParticipant.email}
                    onChange={(e) =>
                      setManualParticipant({ ...manualParticipant, email: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="date"
                    placeholder="Date of Birth *"
                    value={manualParticipant.dateOfBirth}
                    onChange={(e) =>
                      setManualParticipant({ ...manualParticipant, dateOfBirth: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <select
                    value={manualParticipant.gender}
                    onChange={(e) =>
                      setManualParticipant({
                        ...manualParticipant,
                        gender: e.target.value as 'MALE' | 'FEMALE',
                      })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                  <select
                    value={manualParticipant.bloodType}
                    onChange={(e) =>
                      setManualParticipant({
                        ...manualParticipant,
                        bloodType: e.target.value as 'A' | 'B' | 'AB' | 'O',
                      })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Blood Type</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Student Number"
                    value={manualParticipant.studentNumber}
                    onChange={(e) =>
                      setManualParticipant({ ...manualParticipant, studentNumber: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Class Name"
                    value={manualParticipant.className}
                    onChange={(e) =>
                      setManualParticipant({ ...manualParticipant, className: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleAddManualParticipant}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Add Participant
                </button>
              </div>
            )}

            {/* Excel Upload */}
            {uploadMethod === 'excel' && (
              <div className="border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">Upload Excel File</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Download the template, fill in participant data, and upload the completed file.
                </p>
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={handleDownloadTemplate}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Download Template
                  </button>
                  <label className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                    Upload Excel File
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Participants List */}
            {participants.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">
                  Participants ({participants.length})
                </h3>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                          Email
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                          Gender
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                          DOB
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((p, idx) => (
                        <tr key={idx} className="border-t border-gray-200">
                          <td className="px-4 py-2 text-sm">{p.fullName}</td>
                          <td className="px-4 py-2 text-sm">{p.email}</td>
                          <td className="px-4 py-2 text-sm">{p.gender}</td>
                          <td className="px-4 py-2 text-sm">{p.dateOfBirth}</td>
                          <td className="px-4 py-2 text-sm">
                            <button
                              onClick={() => handleRemoveParticipant(idx)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!canProceedToStep4}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Review Order
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {step === 4 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>

            <div className="space-y-6">
              {/* Order Summary */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">Order Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Type:</span>
                    <span className="font-semibold">{orderType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Participants:</span>
                    <span className="font-semibold">{participants.length} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selected Packages:</span>
                    <div className="text-right">
                      {selectedPackages.map((pkg) => (
                        <div key={pkg} className="font-semibold">
                          {PACKAGE_PRICING[pkg].name} ({formatCurrency(PACKAGE_PRICING[pkg].price)})
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">Price Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Price per person:</span>
                    <span>
                      {formatCurrency(
                        selectedPackages.reduce((sum, pkg) => sum + PACKAGE_PRICING[pkg].price, 0)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Number of participants:</span>
                    <span>{participants.length}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total Amount:</span>
                      <span className="text-blue-600">{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional Fields */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Add any special instructions or notes..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(3)}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                disabled={loading}
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Order...
                  </>
                ) : (
                  'Create Order & Proceed to Payment'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
