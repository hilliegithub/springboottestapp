package microservices.book.gamification.game.domain;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScoreCard {
    /**
     * This class represents the Score linked to an attempt in the game,
     * with an associated user and the timestamp in which the score is registered.
     */

    // The default score assigned to this card, if not specified.
    public static final int DEFAULT_SCORE = 10;

    @Id
    @GeneratedValue
    private Long cardId;
    private Long userId;
    private Long attemptId;
    @EqualsAndHashCode.Exclude
    private long scoreTimestamp;
    private int score;

    public ScoreCard(final Long userId, final Long attemptid) {
        this(null, userId,attemptid, System.currentTimeMillis(), DEFAULT_SCORE);
    }
}
