"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function InterestCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(2);
  const [rateType, setRateType] = useState("rupees");
  const [time, setTime] = useState(1);
  const [timeUnit, setTimeUnit] = useState("years");
  const [simpleInterest, setSimpleInterest] = useState(0);
  const [compoundInterest, setCompoundInterest] = useState(0);
  const [inputMethod, setInputMethod] = useState("duration"); // New state for input method
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const calculateInterest = () => {
    let rateValue = rateType === "percent" ? rate / 100 : rate;
    let timeValue = time;

    // Calculate time from dates if date selection is used
    if (inputMethod === "dates" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      timeValue = diffTime / (1000 * 60 * 60 * 24 * 365); // Convert to years
    }

    if (
      timeUnit === "months" &&
      rateType === "percent" &&
      inputMethod !== "dates"
    ) {
      timeValue /= 12;
      //compoundingFrequency = 12;
    }
    if (
      timeUnit === "days" &&
      rateType === "percent" &&
      inputMethod !== "dates"
    ) {
      timeValue /= 365;
      // compoundingFrequency = 365;
    }

    // Simple Interest Logic
    let simpleInterestAmount;
    if (rateType === "percent") {
      simpleInterestAmount = principal * rateValue * timeValue;
    } else if (
      timeUnit === "years" &&
      rateType === "rupees" &&
      inputMethod !== "dates"
    ) {
      simpleInterestAmount = (principal * rateValue * timeValue * 12) / 100;
    } else if (
      timeUnit === "months" &&
      rateType === "rupees" &&
      inputMethod !== "dates"
    ) {
      simpleInterestAmount = (principal * rateValue * timeValue) / 100;
    } else if (
      timeUnit === "days" &&
      rateType === "rupees" &&
      inputMethod !== "dates"
    ) {
      simpleInterestAmount =
        (principal * rateValue * ((timeValue * 12) / 365)) / 100;
    } else if (inputMethod === "dates" && rateType === "rupees") {
      const months = timeValue * 12;
      simpleInterestAmount = (principal * rateValue * months) / 100;
    }
    setSimpleInterest(simpleInterestAmount || 0);
    // Use actual time in years from number of days
    // Get actual number of days
    let totalDays = 0;

    if (inputMethod === "dates" && startDate && endDate) {
      totalDays = Math.floor(
        (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
      );
    } else if (timeUnit === "days") {
      totalDays = time;
    } else if (timeUnit === "months") {
      totalDays = time * 30.44; // approx
    } else if (timeUnit === "years") {
      totalDays = time * 365;
    }

    // ... (previous code remains unchanged until the compound interest calculation)

    // Approximate quarter = 91.25 days
    const fullQuarters = Math.floor(totalDays / 91.25);
    const remainingDays = totalDays - fullQuarters * 91.25;

    let compoundFinalAmount = principal;

    if (rateType === "percent") {
      const quarterlyRate = rate / 400; // 7.1% => 7.1/400
      // Compound for full quarters
      compoundFinalAmount =
        principal * Math.pow(1 + quarterlyRate, fullQuarters);

      // Simple interest for remaining days
      const simpleInterestRemaining =
        (compoundFinalAmount * rate * remainingDays) / (365 * 100);

      compoundFinalAmount += simpleInterestRemaining;
    } else if (rateType === "rupees") {
      // Rate is rupees per 100 per month (e.g., 2 means 2% per month)
      const monthlyRate = rate / 100; // Convert to decimal (e.g., 2 => 0.02)
      const quarterlyRate = monthlyRate * 3; // Quarterly rate (e.g., 0.02 * 3 = 0.06)

      // Convert total time to quarters
      let totalQuarters = 0;
      if (inputMethod === "dates" && startDate && endDate) {
        totalQuarters = totalDays / 91.25; // Convert days to quarters
      } else if (timeUnit === "days") {
        totalQuarters = time / 91.25; // Convert days to quarters
      } else if (timeUnit === "months") {
        totalQuarters = time / 3; // Convert months to quarters
      } else if (timeUnit === "years") {
        totalQuarters = time * 4; // Convert years to quarters
      }

      // Split into full quarters and remaining days
      const fullQuarters = Math.floor(totalQuarters);
      const remainingQuarters = totalQuarters - fullQuarters;
      const remainingDays = remainingQuarters * 91.25; // Convert fractional quarters to days

      // Compound interest for full quarters (quarterly compounding)
      compoundFinalAmount =
        principal * Math.pow(1 + quarterlyRate, fullQuarters);

      // Simple interest for remaining days
      const dailyRate = quarterlyRate / 91.25; // Daily rate based on quarterly rate
      const interestRemaining = compoundFinalAmount * dailyRate * remainingDays;

      compoundFinalAmount += interestRemaining;
    }

    // Final compound interest
    const bankCompoundInterest = compoundFinalAmount - principal;
    setCompoundInterest(bankCompoundInterest);

    setTotalAmount(compoundFinalAmount || 0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-green-300 p-8">
      <Card className="p-6 shadow-xl rounded-lg bg-white">
        <div className="flex justify-center">
          <Image
            src="/VijayLogo.jpg"
            alt="Vijay Kumar Pydi Logo"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
        <CardContent>
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
            Interest Calculator
          </h2>
          <div className="space-y-4">
            <label className="font-semibold">Principal Amount (₹):</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="border p-2 w-full rounded shadow-sm"
            />

            <label className="font-semibold">Interest Rate:</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="border p-2 w-full rounded shadow-sm"
              />
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="percent"
                  checked={rateType === "percent"}
                  onChange={() => setRateType("percent")}
                />
                %
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="rupees"
                  checked={rateType === "rupees"}
                  onChange={() => setRateType("rupees")}
                />
                ₹
              </label>
            </div>

            <label className="font-semibold">Time Input Method:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="duration"
                  checked={inputMethod === "duration"}
                  onChange={() => setInputMethod("duration")}
                />
                Duration
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="dates"
                  checked={inputMethod === "dates"}
                  onChange={() => setInputMethod("dates")}
                />
                Date Range
              </label>
            </div>

            {inputMethod === "duration" ? (
              <div>
                <label className="font-semibold">Time Duration:</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="border p-2 w-full rounded shadow-sm"
                  />
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      value="years"
                      checked={timeUnit === "years"}
                      onChange={() => setTimeUnit("years")}
                    />
                    Years
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      value="months"
                      checked={timeUnit === "months"}
                      onChange={() => setTimeUnit("months")}
                    />
                    Months
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      value="days"
                      checked={timeUnit === "days"}
                      onChange={() => setTimeUnit("days")}
                    />
                    Days
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <label className="font-semibold">Start Date:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border p-2 w-full rounded shadow-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold">End Date:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border p-2 w-full rounded shadow-sm"
                  />
                </div>
              </div>
            )}

            <Button
              onClick={calculateInterest}
              className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Calculate Interest
            </Button>

            <table className="min-w-full mt-4 text-sm text-left border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 border-b">Interest Type</th>
                  <th className="px-4 py-2 border-b">Interest Amount</th>
                  <th className="px-4 py-2 border-b">Total Amount</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                <tr>
                  <td className="px-4 py-2 border-b font-medium text-green-600">
                    Simple Interest
                  </td>
                  <td className="px-4 py-2 border-b">
                    ₹{simpleInterest.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border-b">
                    ₹{(Number(principal) + simpleInterest).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b font-medium text-purple-600">
                    Compound Interest (Quarterly)
                  </td>
                  <td className="px-4 py-2 border-b">
                    ₹{compoundInterest.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border-b">
                    ₹{(Number(principal) + compoundInterest).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
