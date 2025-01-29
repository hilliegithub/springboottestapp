"use client";
import GameApiClient from "@/services/GameApiClient";
import ChallengesApiClient from "@/services/ChallengesApiClient";
import { useEffect, useState } from "react";

type badge = string[];

type lbRow = {
  userId: number;
  totalScore: number;
  resultAttempt: number;
  badges: badge;
};

export function LeaderBoardComponent() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    refreshLeaderBoard();
    //setInterval(refreshLeaderBoard(), 5000);

    const intervalId = setInterval(() => {
      refreshLeaderBoard();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  function getLeaderBoardData() {
    return GameApiClient.leaderBoard().then((lbRes) => {
      if (lbRes.ok) {
        return lbRes.json();
      } else {
        return Promise.reject("Gamification: error response");
      }
    });
  }

  function getUserAliasData(userIds: number[]) {
    return ChallengesApiClient.getUsers(userIds).then((usRes) => {
      console.log("getUserAliasData func --");
      console.log(usRes);
      if (usRes.ok) {
        return usRes.json();
      } else {
        return Promise.reject("Multiplication: error response");
      }
    });
  }

  function updateLeaderBoard(lb: any) {
    setLeaderboard(lb);
    setServerError(false);
  }

  function refreshLeaderBoard() {
    getLeaderBoardData()
      .then((lbData) => {
        const userIds = lbData.map((row: lbRow) => row.userId);
        console.log("refreshLeaderboard func -- userIds from leaderboard row");
        console.log(userIds);
        getUserAliasData(userIds)
          .then((data) => {
            console.log("getUserAlias() response --");
            console.log(data);
            // build a map of id => alias
            const userMap = new Map();
            data.forEach((idAlias: any) => {
              userMap.set(idAlias.id, idAlias.alias);
            });
            // add a property tp exisiting lb data
            lbData.forEach(
              (row: any) => (row["alias"] = userMap.get(row.userId))
            );
            updateLeaderBoard(lbData);
          })
          .catch((reason) => {
            console.log("Error mapping user ids", reason);
            updateLeaderBoard(lbData);
          });
      })
      .catch((reason) => {
        setServerError(true);
        console.log("Gamification server error", reason);
      });
  }

  if (serverError) {
    return (
      <div>
        We're sorry, but we can't display game statistics at this moment.
      </div>
    );
  }

  return (
    <div>
      <h3>Leaderboard</h3>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Score</th>
            <th>Badges</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((row) => (
            <tr key={row.userId}>
              <td>{row.alias ? row.alias : row.userId}</td>
              <td>{row.totalScore}</td>
              <td>
                {row.badges.map((b: any) => (
                  <span className="badge" key={b}>
                    {b}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
