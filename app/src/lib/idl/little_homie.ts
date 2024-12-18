/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/little_homie.json`.
 */
export type LittleHomie = {
  "address": "9c7uYeTk5ME5LAMszEwXR3v7wfApX8yKRCDAUX2vF1yW",
  "metadata": {
    "name": "littleHomie",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "buyCoin",
      "discriminator": [
        237,
        160,
        162,
        220,
        122,
        97,
        208,
        135
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "coinState",
          "writable": true
        },
        {
          "name": "userAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "payer"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "coinMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "coinMint",
          "writable": true
        },
        {
          "name": "feedAggregator",
          "address": "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "amountToMint",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initCoin",
      "discriminator": [
        122,
        52,
        164,
        62,
        152,
        32,
        150,
        168
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "coinMint",
          "writable": true,
          "signer": true
        },
        {
          "name": "userAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "payer"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "coinMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "metadata",
          "writable": true
        },
        {
          "name": "coinState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  105,
                  110,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "coinMint"
              }
            ]
          }
        },
        {
          "name": "metadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        },
        {
          "name": "amountForUser",
          "type": "u64"
        },
        {
          "name": "constant",
          "type": "u64"
        },
        {
          "name": "basePriceInLamports",
          "type": "u64"
        },
        {
          "name": "stableCoin",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "rate",
          "type": "i16"
        }
      ]
    },
    {
      "name": "sellCoin",
      "discriminator": [
        11,
        214,
        94,
        167,
        7,
        123,
        180,
        115
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "coinState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  105,
                  110,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "coinMint"
              }
            ]
          }
        },
        {
          "name": "coinTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "coinState"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "coinMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "coinMint",
          "writable": true
        },
        {
          "name": "metadata",
          "writable": true
        },
        {
          "name": "payerTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "payer"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "coinMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "feedAggregator",
          "address": "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR"
        },
        {
          "name": "metadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "aggregatorAccountData",
      "discriminator": [
        217,
        230,
        65,
        101,
        201,
        162,
        27,
        125
      ]
    },
    {
      "name": "coinState",
      "discriminator": [
        189,
        144,
        92,
        87,
        39,
        80,
        60,
        64
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidConstant",
      "msg": "Constant value must be greater than 0"
    },
    {
      "code": 6001,
      "name": "invalidInitialSupply",
      "msg": "Initial Supply must be greater than 0"
    },
    {
      "code": 6002,
      "name": "invalidName",
      "msg": "Name should be between 15 and 5 characters"
    },
    {
      "code": 6003,
      "name": "invalidDescription",
      "msg": "Description should be between 40 and 5 characters"
    },
    {
      "code": 6004,
      "name": "notEnoughAmount",
      "msg": "You are not authorized because do not have enough amount of this token"
    },
    {
      "code": 6005,
      "name": "coinAlreadyPegged",
      "msg": "Coin is already pegged with stable coin"
    },
    {
      "code": 6006,
      "name": "oracleFeedMismatch",
      "msg": "Pegged coin and oracle feed do not match"
    },
    {
      "code": 6007,
      "name": "invalidStableCoin",
      "msg": "Invalid Stable Coin is provided"
    }
  ],
  "types": [
    {
      "name": "aggregatorAccountData",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "rust",
        "packed": true
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "docs": [
              "Name of the aggregator to store on-chain."
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "metadata",
            "docs": [
              "Metadata of the aggregator to store on-chain."
            ],
            "type": {
              "array": [
                "u8",
                128
              ]
            }
          },
          {
            "name": "reserved1",
            "docs": [
              "Reserved."
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "queuePubkey",
            "docs": [
              "Pubkey of the queue the aggregator belongs to."
            ],
            "type": "pubkey"
          },
          {
            "name": "oracleRequestBatchSize",
            "docs": [
              "CONFIGS",
              "Number of oracles assigned to an update request."
            ],
            "type": "u32"
          },
          {
            "name": "minOracleResults",
            "docs": [
              "Minimum number of oracle responses required before a round is validated."
            ],
            "type": "u32"
          },
          {
            "name": "minJobResults",
            "docs": [
              "Minimum number of job results before an oracle accepts a result."
            ],
            "type": "u32"
          },
          {
            "name": "minUpdateDelaySeconds",
            "docs": [
              "Minimum number of seconds required between aggregator rounds."
            ],
            "type": "u32"
          },
          {
            "name": "startAfter",
            "docs": [
              "Unix timestamp for which no feed update will occur before."
            ],
            "type": "i64"
          },
          {
            "name": "varianceThreshold",
            "docs": [
              "Change percentage required between a previous round and the current round. If variance percentage is not met, reject new oracle responses."
            ],
            "type": {
              "defined": {
                "name": "switchboardDecimal"
              }
            }
          },
          {
            "name": "forceReportPeriod",
            "docs": [
              "Number of seconds for which, even if the variance threshold is not passed, accept new responses from oracles."
            ],
            "type": "i64"
          },
          {
            "name": "expiration",
            "docs": [
              "Timestamp when the feed is no longer needed."
            ],
            "type": "i64"
          },
          {
            "name": "consecutiveFailureCount",
            "docs": [
              "Counter for the number of consecutive failures before a feed is removed from a queue. If set to 0, failed feeds will remain on the queue."
            ],
            "type": "u64"
          },
          {
            "name": "nextAllowedUpdateTime",
            "docs": [
              "Timestamp when the next update request will be available."
            ],
            "type": "i64"
          },
          {
            "name": "isLocked",
            "docs": [
              "Flag for whether an aggregators configuration is locked for editing."
            ],
            "type": "bool"
          },
          {
            "name": "crankPubkey",
            "docs": [
              "Optional, public key of the crank the aggregator is currently using. Event based feeds do not need a crank."
            ],
            "type": "pubkey"
          },
          {
            "name": "latestConfirmedRound",
            "docs": [
              "Latest confirmed update request result that has been accepted as valid."
            ],
            "type": {
              "defined": {
                "name": "aggregatorRound"
              }
            }
          },
          {
            "name": "currentRound",
            "docs": [
              "Oracle results from the current round of update request that has not been accepted as valid yet."
            ],
            "type": {
              "defined": {
                "name": "aggregatorRound"
              }
            }
          },
          {
            "name": "jobPubkeysData",
            "docs": [
              "List of public keys containing the job definitions for how data is sourced off-chain by oracles."
            ],
            "type": {
              "array": [
                "pubkey",
                16
              ]
            }
          },
          {
            "name": "jobHashes",
            "docs": [
              "Used to protect against malicious RPC nodes providing incorrect task definitions to oracles before fulfillment."
            ],
            "type": {
              "array": [
                {
                  "defined": {
                    "name": "hash"
                  }
                },
                16
              ]
            }
          },
          {
            "name": "jobPubkeysSize",
            "docs": [
              "Number of jobs assigned to an oracle."
            ],
            "type": "u32"
          },
          {
            "name": "jobsChecksum",
            "docs": [
              "Used to protect against malicious RPC nodes providing incorrect task definitions to oracles before fulfillment."
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "authority",
            "docs": [
              "The account delegated as the authority for making account changes."
            ],
            "type": "pubkey"
          },
          {
            "name": "historyBuffer",
            "docs": [
              "Optional, public key of a history buffer account storing the last N accepted results and their timestamps."
            ],
            "type": "pubkey"
          },
          {
            "name": "previousConfirmedRoundResult",
            "docs": [
              "The previous confirmed round result."
            ],
            "type": {
              "defined": {
                "name": "switchboardDecimal"
              }
            }
          },
          {
            "name": "previousConfirmedRoundSlot",
            "docs": [
              "The slot when the previous confirmed round was opened."
            ],
            "type": "u64"
          },
          {
            "name": "disableCrank",
            "docs": [
              "Whether an aggregator is permitted to join a crank."
            ],
            "type": "bool"
          },
          {
            "name": "jobWeights",
            "docs": [
              "Job weights used for the weighted median of the aggregator's assigned job accounts."
            ],
            "type": {
              "array": [
                "u8",
                16
              ]
            }
          },
          {
            "name": "creationTimestamp",
            "docs": [
              "Unix timestamp when the feed was created."
            ],
            "type": "i64"
          },
          {
            "name": "resolutionMode",
            "docs": [
              "Use sliding window or round based resolution",
              "NOTE: This changes result propogation in latest_round_result"
            ],
            "type": {
              "defined": {
                "name": "aggregatorResolutionMode"
              }
            }
          },
          {
            "name": "basePriorityFee",
            "type": "u32"
          },
          {
            "name": "priorityFeeBump",
            "type": "u32"
          },
          {
            "name": "priorityFeeBumpPeriod",
            "type": "u32"
          },
          {
            "name": "maxPriorityFeeMultiplier",
            "type": "u32"
          },
          {
            "name": "parentFunction",
            "type": "pubkey"
          },
          {
            "name": "ebuf",
            "docs": [
              "Reserved for future info."
            ],
            "type": {
              "array": [
                "u8",
                90
              ]
            }
          }
        ]
      }
    },
    {
      "name": "aggregatorResolutionMode",
      "repr": {
        "kind": "rust"
      },
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "modeRoundResolution"
          },
          {
            "name": "modeSlidingResolution"
          }
        ]
      }
    },
    {
      "name": "aggregatorRound",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "rust",
        "packed": true
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "numSuccess",
            "docs": [
              "Maintains the number of successful responses received from nodes.",
              "Nodes can submit one successful response per round."
            ],
            "type": "u32"
          },
          {
            "name": "numError",
            "docs": [
              "Number of error responses."
            ],
            "type": "u32"
          },
          {
            "name": "isClosed",
            "docs": [
              "Whether an update request round has ended."
            ],
            "type": "bool"
          },
          {
            "name": "roundOpenSlot",
            "docs": [
              "Maintains the `solana_program::clock::Slot` that the round was opened at."
            ],
            "type": "u64"
          },
          {
            "name": "roundOpenTimestamp",
            "docs": [
              "Maintains the `solana_program::clock::UnixTimestamp;` the round was opened at."
            ],
            "type": "i64"
          },
          {
            "name": "result",
            "docs": [
              "Maintains the current median of all successful round responses."
            ],
            "type": {
              "defined": {
                "name": "switchboardDecimal"
              }
            }
          },
          {
            "name": "stdDeviation",
            "docs": [
              "Standard deviation of the accepted results in the round."
            ],
            "type": {
              "defined": {
                "name": "switchboardDecimal"
              }
            }
          },
          {
            "name": "minResponse",
            "docs": [
              "Maintains the minimum node response this round."
            ],
            "type": {
              "defined": {
                "name": "switchboardDecimal"
              }
            }
          },
          {
            "name": "maxResponse",
            "docs": [
              "Maintains the maximum node response this round."
            ],
            "type": {
              "defined": {
                "name": "switchboardDecimal"
              }
            }
          },
          {
            "name": "oraclePubkeysData",
            "docs": [
              "Pubkeys of the oracles fulfilling this round."
            ],
            "type": {
              "array": [
                "pubkey",
                16
              ]
            }
          },
          {
            "name": "mediansData",
            "docs": [
              "Represents all successful node responses this round. `NaN` if empty."
            ],
            "type": {
              "array": [
                {
                  "defined": {
                    "name": "switchboardDecimal"
                  }
                },
                16
              ]
            }
          },
          {
            "name": "currentPayout",
            "docs": [
              "Current rewards/slashes oracles have received this round."
            ],
            "type": {
              "array": [
                "i64",
                16
              ]
            }
          },
          {
            "name": "mediansFulfilled",
            "docs": [
              "Keep track of which responses are fulfilled here."
            ],
            "type": {
              "array": [
                "bool",
                16
              ]
            }
          },
          {
            "name": "errorsFulfilled",
            "docs": [
              "Keeps track of which errors are fulfilled here."
            ],
            "type": {
              "array": [
                "bool",
                16
              ]
            }
          }
        ]
      }
    },
    {
      "name": "coinState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "constant",
            "type": "u64"
          },
          {
            "name": "stableCoin",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "coinMint",
            "type": "pubkey"
          },
          {
            "name": "basePriceInLamports",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "hash",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "rust",
        "packed": true
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "data",
            "docs": [
              "The bytes used to derive the hash."
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "switchboardDecimal",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "rust",
        "packed": true
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mantissa",
            "docs": [
              "The part of a floating-point number that represents the significant digits of that number, and that is multiplied by the base, 10, raised to the power of scale to give the actual value of the number."
            ],
            "type": "i128"
          },
          {
            "name": "scale",
            "docs": [
              "The number of decimal places to move to the left to yield the actual value."
            ],
            "type": "u32"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "coinStateSeed",
      "type": "string",
      "value": "\"coin_state\""
    },
    {
      "name": "proposalSeed",
      "type": "string",
      "value": "\"proposal\""
    }
  ]
};
