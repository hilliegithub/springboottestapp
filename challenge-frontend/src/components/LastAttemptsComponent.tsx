"use client";

import { Attempt } from "./ChallengeComponent";

type LastAttemptsComponentProps = {
  attempts: Attempt[];
};

const LastAttemptsComponent: React.FC<LastAttemptsComponentProps> = ({
  attempts,
}) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Challenge</th>
          <th>Your guess</th>
          <th>Correct</th>
        </tr>
      </thead>
      <tbody>
        {attempts.map((attempt) => (
          <tr
            key={attempt.id}
            style={{ color: attempt.correct ? "green" : "red" }}
          >
            <td>
              {attempt.factorA} x {attempt.factorB}
            </td>
            <td>{attempt.resultAttempt}</td>
            <td>
              {attempt.correct
                ? "Correct"
                : "Incorrect (" + attempt.factorA * attempt.factorB + ")"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LastAttemptsComponent;
