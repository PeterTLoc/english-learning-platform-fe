"use client";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import type { UserProgress } from "./DetailDataModal";
import Introduction from "./Introduction";
import { AxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import LoadingBars from "./LoadingBars";
import DetailDataModal from "./DetailDataModal";
import AnalyticResponse from "./AnalyticResponse";
import AiService from "@/services/aiService";

const aiService = new AiService();
export default function RecommendationWrapper() {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isProgressComplete, setIsProgressComplete] = useState(false);
  const [isApiComplete, setIsApiComplete] = useState(false);

  // Data states
  const [isSuccess, setIsSuccess] = useState(false);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [referenceData, setReferenceData] = useState<UserProgress[] | null>(
    null
  );

  //modal
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Both loading bar and API must complete before showing results
  const shouldShowResults = isProgressComplete && isApiComplete && isSuccess;

  // Loading bar should end when both conditions are met
  const shouldEndLoadingBar = isProgressComplete && isApiComplete;

  const handleContinue = async () => {
    try {
      if (!user?._id) {
        showToast("This feature is only available for logged in users", "error");
        return;
      }

      // Reset states
      setIsLoading(true);
      setIsProgressComplete(false);
      setIsApiComplete(false);
      setIsSuccess(false);

      const response = await aiService.getPersonalRecommendationFromAi(
        user?._id.toString()
      );

      setReferenceData(response.referenceData);
      setStrengths(response.response.strengths);
      setWeaknesses(response.response.weaknesses);
      setRecommendations(response.response.recommendations);
      setSummary(response.response.summary);
      setIsSuccess(true);

      setIsApiComplete(true);
    } catch (error) {
      showToast(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Something went wrong",
        "error"
      );
      setIsLoading(false);
      setIsSuccess(false);
      setIsApiComplete(true);
    }
  };

  const handleProgressComplete = () => {
    setIsProgressComplete(true);
  };

  return (
    <div>
      <Introduction
        isLoading={isLoading && !isProgressComplete && !isApiComplete}
        handleContinue={handleContinue}
        disabled={isSuccess}
      />
      {isLoading && (
        <LoadingBars
          speed={100}
          stopValue={99}
          end={shouldEndLoadingBar}
          onProgressComplete={handleProgressComplete}
        />
      )}

      {shouldShowResults && (
        <>
          {" "}
          <AnalyticResponse
            strengths={strengths}
            weakness={weaknesses}
            recommendations={recommendations}
            summary={summary}
            onDetail={() => setIsDetailOpen(true)}
          />
          <DetailDataModal
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            data={referenceData as UserProgress[]}
          />
        </>
      )}
    </div>
  );
}
