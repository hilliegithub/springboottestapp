package microservices.book.multiplication.challenge;

import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import microservices.book.multiplication.user.User;
import microservices.book.multiplication.user.UserRepository;

@Slf4j
@RequiredArgsConstructor
@Service
public class ChallengeServiceImpl implements ChallengeService {
    private final UserRepository userRepository;
    private final ChallengeAttemptRepository attemptRepository;
    // private final GamificationServiceClient gameClient;
    private final ChallengeEventPub challengeEventPub;

    @Transactional
    @Override
    public ChallengeAttempt verifyAttempt(ChallengeAttemptDTO attemptDTO) {
        User user = userRepository.findByAlias(attemptDTO.getUserAlias())
            .orElseGet(() -> {
                log.info("Creating new user with alias {}", attemptDTO.getUserAlias());
                return userRepository.save(new User(attemptDTO.getUserAlias()));
        });

        // Check if the attempt is correct
        boolean isCorrect = attemptDTO.getGuess() == attemptDTO.getFactorA() * attemptDTO.getFactorB();

        ChallengeAttempt checkedAttempt = new ChallengeAttempt(null, user, attemptDTO.getFactorA(), attemptDTO.getFactorB(), attemptDTO.getGuess(), isCorrect);
        ChallengeAttempt storedAttempt = attemptRepository.save(checkedAttempt);

        // Publlishes an event to notify potentially interest subscribers
        challengeEventPub.challengeSolved(storedAttempt);
        return storedAttempt;
    }

    @Override
    public List<ChallengeAttempt> getStatsForUser(final String userAlias) {
        log.info(userAlias);
        return attemptRepository.findTop10ByUserAliasOrderByIdDesc(userAlias);
    }
}
