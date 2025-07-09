"use client";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import Introduction from "./Introduction";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import LoadingBars from "./LoadingBars";
import DetailDataModal from "./DetailDataModal";
import AnalyticResponse from "./AnalyticResponse";
import AiService from "@/services/aiService";

const aiService = new AiService();
export default function RecommendationWrapper() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [referenceData, setReferenceData] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const handleContinue = async () => {
    try {
      if (!user?._id) {
        toast.error("This feature is only available for logged in users");
        return;
      }

      setIsLoading(true);
      const response = await aiService.getPersonalRecommendationFromAi(
        user?._id.toString()
      );

      setReferenceData(response.referenceData);
      setStrengths(response.response.strengths);
      setWeaknesses(response.response.weaknesses);
      setRecommendations(response.response.recommendations);
      setSummary(response.response.summary);
      setIsSuccess(true);
      setIsLoading(false);
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data.message
          : "Something went wrong"
      );
      setIsLoading(false);
      setIsSuccess(false);
    }
  };
  return (
    <div>
      <Introduction isLoading={isLoading} handleContinue={handleContinue} />
      {isLoading && <LoadingBars speed={100} stopValue={99} end={!isLoading} />}
      {isSuccess && (
        <>
          <DetailDataModal
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            data={referenceData}
          />
        </>
      )}

      {isSuccess && (
        <AnalyticResponse
          strengths={strengths}
          weakness={weaknesses}
          recommendations={recommendations}
          summary={summary}
          onDetail={() => setIsDetailOpen(true)}
        />
      )}
    </div>
  );
}
