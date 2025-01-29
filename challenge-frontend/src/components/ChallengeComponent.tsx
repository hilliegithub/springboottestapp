"use client";
import ChallengesApiClient from "@/services/ChallengesApiClient";
import { useState, useEffect } from "react";
import LastAttemptsComponent from "./LastAttemptsComponent";
import { LeaderBoardComponent } from "./LeaderBoardComponent";

export type Attempt = {
  id: number;
  correct: boolean;
  factorA: number;
  factorB: number;
  resultAttempt: number;
  user: any;
};

export function ChallengeComponent() {
  const [factora, setFactora] = useState(0);
  const [factorb, setFactorb] = useState(0);
  const [user, setUser] = useState("");
  const [guess, setGuess] = useState(0);
  const [message, setMessage] = useState("");
  const [lastAttempts, setLastAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    refreshChallenge();
  }, []);

  async function refreshChallenge() {
    ChallengesApiClient.challenge().then((res) => {
      if (res.ok) {
        res.json().then((json) => {
          setFactora(json.factorA);
          setFactorb(json.factorB);
          console.log(json);
        });
      } else {
        const error = "Can't reach the server";
        console.log(error);
        setMessage(error);
      }
    });
  }

  function updateGuess(e: any) {
    // console.log(e.target.value);
    setGuess(e.target.value);
  }

  function updateAlias(e: any) {
    setUser(e.target.value);
    // console.log(e.target.value);
  }

  function submitAttempt() {
    ChallengesApiClient.sendGuess(user, factora, factorb, guess).then((res) => {
      if (res.ok) {
        res.json().then(async (json) => {
          if (json.correct) {
            setMessage("Congratulations! Your guess is correct");
          } else {
            setMessage(
              "Oops! Your guess " +
                json.resultAttempt +
                " is wrong, but keep playing!"
            );
          }
          updateLastAttempts(user);
          console.log("After updating user attempt");
          await refreshChallenge();
          console.log("After refreshing list");
        });
      } else {
        setMessage("Error: server error or not available");
      }
    });
  }

  function updateLastAttempts(userAlias: string) {
    ChallengesApiClient.getAttempts(userAlias).then((res) => {
      if (res.ok) {
        const attempts: Attempt[] = [];
        res.json().then((data) => {
          console.log("Api.Client.getAttempts");
          console.log(data);
          data.forEach((item: Attempt) => {
            attempts.push(item);
          });
          setLastAttempts(attempts);
          console.log("lastAttempts: ");
          console.log(lastAttempts);
        });
      }
    });
  }

  return (
    <div className="display-column">
      <div>
        <h3>Your new challenge is</h3>
        <div className="text-6xl">
          {factora} x {factorb}
        </div>
        <form action={submitAttempt}>
          <label>
            Your alias:
            <input
              type="text"
              maxLength={12}
              name="user"
              value={user}
              onChange={updateAlias}
            />
          </label>
          <br />
          <label>
            Your guess:
            <input
              type="number"
              min="0"
              name="guess"
              value={guess}
              onChange={updateGuess}
            />
          </label>
          <br />
          <input
            className="btn btn-blue border border-2 hover:cursor-pointer hover:bg-blue-300 text-black font-bold py-2 px-2 rounded"
            type="submit"
            value="Submit"
          />
        </form>
        <h4>{message}</h4>
        {lastAttempts.length > 0 && (
          <LastAttemptsComponent attempts={lastAttempts} />
        )}
      </div>
      <LeaderBoardComponent />
    </div>
  );
}
