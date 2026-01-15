
const abi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			}
		],
		"name": "acceptBet",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			}
		],
		"name": "BetAccepted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			}
		],
		"name": "BetCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "opponent",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "wagerAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "requiredVotes",
				"type": "uint256"
			}
		],
		"name": "BetCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "winner",
				"type": "address"
			}
		],
		"name": "BetResolved",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			}
		],
		"name": "cancelBet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_opponent",
				"type": "address"
			},
			{
				"internalType": "address[]",
				"name": "_judges",
				"type": "address[]"
			},
			{
				"internalType": "uint256",
				"name": "_requiredVotes",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_terms",
				"type": "string"
			}
		],
		"name": "createBet",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "judge",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "votedFor",
				"type": "address"
			}
		],
		"name": "JudgeVoted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_winner",
				"type": "address"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "betCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "bets",
		"outputs": [
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "opponent",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "requiredVotes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "wagerAmount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "terms",
				"type": "string"
			},
			{
				"internalType": "enum Verdict.BetStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "creatorVotes",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "opponentVotes",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			}
		],
		"name": "getBet",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "opponent",
						"type": "address"
					},
					{
						"internalType": "address[]",
						"name": "judges",
						"type": "address[]"
					},
					{
						"internalType": "uint256",
						"name": "requiredVotes",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "wagerAmount",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "terms",
						"type": "string"
					},
					{
						"internalType": "enum Verdict.BetStatus",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "winner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "creatorVotes",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "opponentVotes",
						"type": "uint256"
					}
				],
				"internalType": "struct Verdict.Bet",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "betId",
				"type": "uint256"
			}
		],
		"name": "getJudges",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "judgeVotes",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const contractAddress = "0xCeAdbb12EEF1df1a8f2b03B3B6b635094eB70CaE"

export { abi, contractAddress }