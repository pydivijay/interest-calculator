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

  const calculateInterest = () => {
    let rateValue = rateType === "percent" ? rate / 100 : rate;
    let timeValue = time;
    let compoundingFrequency = 1;

    if (timeUnit === "months" && rateType === "percent") {
      timeValue /= 12;
      compoundingFrequency = 12;
    }
    if (timeUnit === "days" && rateType === "percent") {
      timeValue /= 365;
      compoundingFrequency = 365;
    }

    let simpleInterestAmount;
    if (rateType === "percent") {
      simpleInterestAmount = principal * rateValue * timeValue;
    } else if (timeUnit === "years" && rateType === "rupees") {
      simpleInterestAmount = (principal * rateValue * timeValue * 12) / 100;
    } else if (timeUnit === "months" && rateType === "rupees") {
      simpleInterestAmount = (principal * rateValue * timeValue) / 100;
    } else if (timeUnit === "days" && rateType === "rupees") {
      simpleInterestAmount =
        (principal * rateValue * ((timeValue * 12) / 365)) / 100;
    }

    let finalAmount =
      principal *
      Math.pow(
        1 + rateValue / compoundingFrequency,
        compoundingFrequency * timeValue
      );
    let compoundInterestAmount = finalAmount - principal;

    setSimpleInterest(simpleInterestAmount);
    setCompoundInterest(compoundInterestAmount);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-100 min-h-screen flex items-center justify-center">
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

            <Button
              onClick={calculateInterest}
              className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Calculate Interest
            </Button>

            <h3 className="text-lg font-semibold text-green-600">
              Simple Interest: ₹{simpleInterest.toFixed(2)}
            </h3>
            {/* <h3 className="text-lg font-semibold text-red-600">
              Compound Interest: ₹{compoundInterest.toFixed(2)}
            </h3> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
