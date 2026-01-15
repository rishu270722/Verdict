// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Verdict {
    enum BetStatus {
        Created,
        Accepted,
        Resolved,
        Cancelled
    }

    struct Bet {
        address creator;
        address opponent;
        address[] judges;
        uint256 requiredVotes;
        uint256 wagerAmount;
        string terms;
        BetStatus status;
        address winner;
        uint256 creatorVotes;
        uint256 opponentVotes;
    }

    uint256 public betCount;
    mapping(uint256 => Bet) public bets;
    mapping(uint256 => mapping(address => address)) public judgeVotes;

    event BetCreated(
        uint256 indexed betId,
        address creator,
        address opponent,
        uint256 wagerAmount,
        uint256 requiredVotes
    );

    event BetAccepted(uint256 indexed betId);
    event JudgeVoted(uint256 indexed betId, address judge, address votedFor);
    event BetResolved(uint256 indexed betId, address winner);
    event BetCancelled(uint256 indexed betId);

    modifier onlyCreator(uint256 betId) {
        require(msg.sender == bets[betId].creator, "Only creator");
        _;
    }

    modifier onlyOpponent(uint256 betId) {
        require(msg.sender == bets[betId].opponent, "Only opponent");
        _;
    }

    modifier onlyJudge(uint256 betId) {
        bool isJudge = false;
        for (uint256 i = 0; i < bets[betId].judges.length; i++) {
            if (bets[betId].judges[i] == msg.sender) {
                isJudge = true;
                break;
            }
        }
        require(isJudge, "Not a judge");
        _;
    }

    function createBet(
        address _opponent,
        address[] calldata _judges,
        uint256 _requiredVotes,
        string calldata _terms
    ) external payable returns (uint256) {
        require(msg.value > 0, "Invalid wager");
        require(_opponent != msg.sender, "Invalid opponent");
        require(_judges.length >= _requiredVotes, "Invalid vote threshold");
        require(_requiredVotes > 0, "Votes must be > 0");

        betCount++;

        bets[betCount] = Bet({
            creator: msg.sender,
            opponent: _opponent,
            judges: _judges,
            requiredVotes: _requiredVotes,
            wagerAmount: msg.value,
            terms: _terms,
            status: BetStatus.Created,
            winner: address(0),
            creatorVotes: 0,
            opponentVotes: 0
        });

        emit BetCreated(
            betCount,
            msg.sender,
            _opponent,
            msg.value,
            _requiredVotes
        );

        return betCount;
    }

    function acceptBet(uint256 betId) external payable onlyOpponent(betId) {
        Bet storage bet = bets[betId];

        require(bet.status == BetStatus.Created, "Bet not open");
        require(msg.value == bet.wagerAmount, "Incorrect wager");

        bet.status = BetStatus.Accepted;

        emit BetAccepted(betId);
    }

    function vote(uint256 betId, address _winner) external onlyJudge(betId) {
        Bet storage bet = bets[betId];

        require(bet.status == BetStatus.Accepted, "Bet not active");
        require(
            _winner == bet.creator || _winner == bet.opponent,
            "Invalid winner"
        );
        require(judgeVotes[betId][msg.sender] == address(0), "Already voted");

        judgeVotes[betId][msg.sender] = _winner;
        emit JudgeVoted(betId, msg.sender, _winner);

        if (_winner == bet.creator) {
            bet.creatorVotes++;
            if (bet.creatorVotes >= bet.requiredVotes) {
                _finalize(betId, bet.creator);
            }
        } else {
            bet.opponentVotes++;
            if (bet.opponentVotes >= bet.requiredVotes) {
                _finalize(betId, bet.opponent);
            }
        }
    }

    function _finalize(uint256 betId, address _winner) internal {
        Bet storage bet = bets[betId];
        require(bet.status == BetStatus.Accepted, "Already resolved");

        bet.status = BetStatus.Resolved;
        bet.winner = _winner;

        uint256 payout = bet.wagerAmount * 2;
        payable(_winner).transfer(payout);

        emit BetResolved(betId, _winner);
    }

    function cancelBet(uint256 betId) external onlyCreator(betId) {
        Bet storage bet = bets[betId];

        require(bet.status == BetStatus.Created, "Cannot cancel");

        bet.status = BetStatus.Cancelled;
        payable(bet.creator).transfer(bet.wagerAmount);

        emit BetCancelled(betId);
    }

    function getJudges(uint256 betId) external view returns (address[] memory) {
        return bets[betId].judges;
    }

    function getBet(uint256 betId) external view returns (Bet memory) {
        return bets[betId];
    }
}
