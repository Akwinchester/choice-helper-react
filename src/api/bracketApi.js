// src/api/bracketApi.js
import apiClient from "./apiClient";

export const createBracket = async (sessionId) => {
  const res = await apiClient.post(`/brackets/?session_id=${sessionId}`);
  return res.data;
};

export const getNextPair = async (bracketId) => {
  const res = await apiClient.get(`/brackets/${bracketId}/next`);
  return res.data;
};

export const voteInBracket = async (bracketId, roundNumber, winnerId) => {
  const res = await apiClient.post(`/brackets/${bracketId}/vote`, {
    round_number: roundNumber,
    winner_id: winnerId,
  });
  return res.data;
};

export const getBracket = async (bracketId) => {
    const res = await apiClient.get(`/brackets/${bracketId}`);
    return res.data;
  };