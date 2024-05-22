const rawdata = [
  {
    "Time": "00:00",
    "ActivePower": 138,
    "Irradiance": 30
  },
  {
    "Time": "00:05",
    "ActivePower": 696,
    "Irradiance": 872
  },
  {
    "Time": "00:10",
    "ActivePower": 574,
    "Irradiance": 814
  },
  {
    "Time": "00:15",
    "ActivePower": 278,
    "Irradiance": 455
  },
  {
    "Time": "00:20",
    "ActivePower": 201,
    "Irradiance": 195
  },
  {
    "Time": "00:25",
    "ActivePower": 537,
    "Irradiance": 335
  },
  {
    "Time": "00:30",
    "ActivePower": 504,
    "Irradiance": 57
  },
  {
    "Time": "00:35",
    "ActivePower": 464,
    "Irradiance": 747
  },
  {
    "Time": "00:40",
    "ActivePower": 697,
    "Irradiance": 839
  },
  {
    "Time": "00:45",
    "ActivePower": 888,
    "Irradiance": 635
  },
  {
    "Time": "00:50",
    "ActivePower": 16,
    "Irradiance": 383
  },
  {
    "Time": "00:55",
    "ActivePower": 785,
    "Irradiance": 374
  },
  {
    "Time": "01:00",
    "ActivePower": 445,
    "Irradiance": 803
  },
  {
    "Time": "01:05",
    "ActivePower": 653,
    "Irradiance": 121
  },
  {
    "Time": "01:10",
    "ActivePower": 774,
    "Irradiance": 566
  },
  {
    "Time": "01:15",
    "ActivePower": 695,
    "Irradiance": 840
  },
  {
    "Time": "01:20",
    "ActivePower": 89,
    "Irradiance": 740
  },
  {
    "Time": "01:25",
    "ActivePower": 540,
    "Irradiance": 388
  },
  {
    "Time": "01:30",
    "ActivePower": 68,
    "Irradiance": 499
  },
  {
    "Time": "01:35",
    "ActivePower": 636,
    "Irradiance": 872
  },
  {
    "Time": "01:40",
    "ActivePower": 379,
    "Irradiance": 505
  },
  {
    "Time": "01:45",
    "ActivePower": 814,
    "Irradiance": 689
  },
  {
    "Time": "01:50",
    "ActivePower": 169,
    "Irradiance": 460
  },
  {
    "Time": "01:55",
    "ActivePower": 137,
    "Irradiance": 163
  },
  {
    "Time": "02:00",
    "ActivePower": 19,
    "Irradiance": 919
  },
  {
    "Time": "02:05",
    "ActivePower": 254,
    "Irradiance": 9
  },
  {
    "Time": "02:10",
    "ActivePower": 597,
    "Irradiance": 95
  },
  {
    "Time": "02:15",
    "ActivePower": 484,
    "Irradiance": 704
  },
  {
    "Time": "02:20",
    "ActivePower": 657,
    "Irradiance": 217
  },
  {
    "Time": "02:25",
    "ActivePower": 633,
    "Irradiance": 714
  },
  {
    "Time": "02:30",
    "ActivePower": 96,
    "Irradiance": 22
  },
  {
    "Time": "02:35",
    "ActivePower": 854,
    "Irradiance": 781
  },
  {
    "Time": "02:40",
    "ActivePower": 869,
    "Irradiance": 527
  },
  {
    "Time": "02:45",
    "ActivePower": 954,
    "Irradiance": 816
  },
  {
    "Time": "02:50",
    "ActivePower": 896,
    "Irradiance": 864
  },
  {
    "Time": "02:55",
    "ActivePower": 507,
    "Irradiance": 474
  },
  {
    "Time": "03:00",
    "ActivePower": 291,
    "Irradiance": 31
  },
  {
    "Time": "03:05",
    "ActivePower": 758,
    "Irradiance": 725
  },
  {
    "Time": "03:10",
    "ActivePower": 888,
    "Irradiance": 55
  },
  {
    "Time": "03:15",
    "ActivePower": 843,
    "Irradiance": 404
  },
  {
    "Time": "03:20",
    "ActivePower": 783,
    "Irradiance": 578
  },
  {
    "Time": "03:25",
    "ActivePower": 600,
    "Irradiance": 796
  },
  {
    "Time": "03:30",
    "ActivePower": 420,
    "Irradiance": 631
  },
  {
    "Time": "03:35",
    "ActivePower": 647,
    "Irradiance": 999
  },
  {
    "Time": "03:40",
    "ActivePower": 976,
    "Irradiance": 536
  },
  {
    "Time": "03:45",
    "ActivePower": 62,
    "Irradiance": 540
  },
  {
    "Time": "03:50",
    "ActivePower": 342,
    "Irradiance": 630
  },
  {
    "Time": "03:55",
    "ActivePower": 366,
    "Irradiance": 902
  },
  {
    "Time": "04:00",
    "ActivePower": 603,
    "Irradiance": 764
  },
  {
    "Time": "04:05",
    "ActivePower": 487,
    "Irradiance": 790
  },
  {
    "Time": "04:10",
    "ActivePower": 220,
    "Irradiance": 590
  },
  {
    "Time": "04:15",
    "ActivePower": 911,
    "Irradiance": 809
  },
  {
    "Time": "04:20",
    "ActivePower": 770,
    "Irradiance": 715
  },
  {
    "Time": "04:25",
    "ActivePower": 804,
    "Irradiance": 477
  },
  {
    "Time": "04:30",
    "ActivePower": 785,
    "Irradiance": 696
  },
  {
    "Time": "04:35",
    "ActivePower": 378,
    "Irradiance": 757
  },
  {
    "Time": "04:40",
    "ActivePower": 610,
    "Irradiance": 178
  },
  {
    "Time": "04:45",
    "ActivePower": 295,
    "Irradiance": 156
  },
  {
    "Time": "04:50",
    "ActivePower": 315,
    "Irradiance": 356
  },
  {
    "Time": "04:55",
    "ActivePower": 161,
    "Irradiance": 951
  },
  {
    "Time": "05:00",
    "ActivePower": 795,
    "Irradiance": 739
  },
  {
    "Time": "05:05",
    "ActivePower": 305,
    "Irradiance": 495
  },
  {
    "Time": "05:10",
    "ActivePower": 1,
    "Irradiance": 220
  },
  {
    "Time": "05:15",
    "ActivePower": 713,
    "Irradiance": 299
  },
  {
    "Time": "05:20",
    "ActivePower": 315,
    "Irradiance": 566
  },
  {
    "Time": "05:25",
    "ActivePower": 243,
    "Irradiance": 697
  },
  {
    "Time": "05:30",
    "ActivePower": 197,
    "Irradiance": 840
  },
  {
    "Time": "05:35",
    "ActivePower": 592,
    "Irradiance": 156
  },
  {
    "Time": "05:40",
    "ActivePower": 833,
    "Irradiance": 416
  },
  {
    "Time": "05:45",
    "ActivePower": 369,
    "Irradiance": 310
  },
  {
    "Time": "05:50",
    "ActivePower": 683,
    "Irradiance": 265
  },
  {
    "Time": "05:55",
    "ActivePower": 22,
    "Irradiance": 173
  },
  {
    "Time": "06:00",
    "ActivePower": 630,
    "Irradiance": 603
  },
  {
    "Time": "06:05",
    "ActivePower": 826,
    "Irradiance": 405
  },
  {
    "Time": "06:10",
    "ActivePower": 282,
    "Irradiance": 228
  },
  {
    "Time": "06:15",
    "ActivePower": 240,
    "Irradiance": 134
  },
  {
    "Time": "06:20",
    "ActivePower": 650,
    "Irradiance": 744
  },
  {
    "Time": "06:25",
    "ActivePower": 422,
    "Irradiance": 745
  },
  {
    "Time": "06:30",
    "ActivePower": 328,
    "Irradiance": 22
  },
  {
    "Time": "06:35",
    "ActivePower": 997,
    "Irradiance": 983
  },
  {
    "Time": "06:40",
    "ActivePower": 604,
    "Irradiance": 926
  },
  {
    "Time": "06:45",
    "ActivePower": 396,
    "Irradiance": 902
  },
  {
    "Time": "06:50",
    "ActivePower": 338,
    "Irradiance": 560
  },
  {
    "Time": "06:55",
    "ActivePower": 900,
    "Irradiance": 854
  },
  {
    "Time": "07:00",
    "ActivePower": 241,
    "Irradiance": 195
  },
  {
    "Time": "07:05",
    "ActivePower": 230,
    "Irradiance": 227
  },
  {
    "Time": "07:10",
    "ActivePower": 289,
    "Irradiance": 778
  },
  {
    "Time": "07:15",
    "ActivePower": 525,
    "Irradiance": 116
  },
  {
    "Time": "07:20",
    "ActivePower": 861,
    "Irradiance": 30
  },
  {
    "Time": "07:25",
    "ActivePower": 826,
    "Irradiance": 557
  },
  {
    "Time": "07:30",
    "ActivePower": 398,
    "Irradiance": 466
  },
  {
    "Time": "07:35",
    "ActivePower": 693,
    "Irradiance": 930
  },
  {
    "Time": "07:40",
    "ActivePower": 431,
    "Irradiance": 391
  },
  {
    "Time": "07:45",
    "ActivePower": 884,
    "Irradiance": 624
  },
  {
    "Time": "07:50",
    "ActivePower": 874,
    "Irradiance": 824
  },
  {
    "Time": "07:55",
    "ActivePower": 64,
    "Irradiance": 25
  },
  {
    "Time": "08:00",
    "ActivePower": 80,
    "Irradiance": 330
  },
  {
    "Time": "08:05",
    "ActivePower": 695,
    "Irradiance": 808
  },
  {
    "Time": "08:10",
    "ActivePower": 797,
    "Irradiance": 913
  },
  {
    "Time": "08:15",
    "ActivePower": 725,
    "Irradiance": 717
  },
  {
    "Time": "08:20",
    "ActivePower": 516,
    "Irradiance": 750
  },
  {
    "Time": "08:25",
    "ActivePower": 517,
    "Irradiance": 3
  },
  {
    "Time": "08:30",
    "ActivePower": 220,
    "Irradiance": 396
  },
  {
    "Time": "08:35",
    "ActivePower": 637,
    "Irradiance": 426
  },
  {
    "Time": "08:40",
    "ActivePower": 578,
    "Irradiance": 993
  },
  {
    "Time": "08:45",
    "ActivePower": 565,
    "Irradiance": 99
  },
  {
    "Time": "08:50",
    "ActivePower": 28,
    "Irradiance": 446
  },
  {
    "Time": "08:55",
    "ActivePower": 736,
    "Irradiance": 84
  },
  {
    "Time": "09:00",
    "ActivePower": 585,
    "Irradiance": 487
  },
  {
    "Time": "09:05",
    "ActivePower": 911,
    "Irradiance": 645
  },
  {
    "Time": "09:10",
    "ActivePower": 847,
    "Irradiance": 125
  },
  {
    "Time": "09:15",
    "ActivePower": 746,
    "Irradiance": 248
  },
  {
    "Time": "09:20",
    "ActivePower": 211,
    "Irradiance": 46
  },
  {
    "Time": "09:25",
    "ActivePower": 566,
    "Irradiance": 676
  },
  {
    "Time": "09:30",
    "ActivePower": 335,
    "Irradiance": 197
  },
  {
    "Time": "09:35",
    "ActivePower": 780,
    "Irradiance": 333
  },
  {
    "Time": "09:40",
    "ActivePower": 243,
    "Irradiance": 10
  },
  {
    "Time": "09:45",
    "ActivePower": 334,
    "Irradiance": 457
  },
  {
    "Time": "09:50",
    "ActivePower": 716,
    "Irradiance": 837
  },
  {
    "Time": "09:55",
    "ActivePower": 492,
    "Irradiance": 480
  },
  {
    "Time": "10:00",
    "ActivePower": 975,
    "Irradiance": 415
  },
  {
    "Time": "10:05",
    "ActivePower": 987,
    "Irradiance": 790
  },
  {
    "Time": "10:10",
    "ActivePower": 573,
    "Irradiance": 756
  },
  {
    "Time": "10:15",
    "ActivePower": 516,
    "Irradiance": 548
  },
  {
    "Time": "10:20",
    "ActivePower": 219,
    "Irradiance": 174
  },
  {
    "Time": "10:25",
    "ActivePower": 915,
    "Irradiance": 876
  },
  {
    "Time": "10:30",
    "ActivePower": 688,
    "Irradiance": 784
  },
  {
    "Time": "10:35",
    "ActivePower": 119,
    "Irradiance": 630
  },
  {
    "Time": "10:40",
    "ActivePower": 359,
    "Irradiance": 193
  },
  {
    "Time": "10:45",
    "ActivePower": 797,
    "Irradiance": 829
  },
  {
    "Time": "10:50",
    "ActivePower": 442,
    "Irradiance": 363
  },
  {
    "Time": "10:55",
    "ActivePower": 873,
    "Irradiance": 126
  },
  {
    "Time": "11:00",
    "ActivePower": 311,
    "Irradiance": 975
  },
  {
    "Time": "11:05",
    "ActivePower": 455,
    "Irradiance": 854
  },
  {
    "Time": "11:10",
    "ActivePower": 706,
    "Irradiance": 749
  },
  {
    "Time": "11:15",
    "ActivePower": 262,
    "Irradiance": 871
  },
  {
    "Time": "11:20",
    "ActivePower": 224,
    "Irradiance": 112
  },
  {
    "Time": "11:25",
    "ActivePower": 907,
    "Irradiance": 745
  },
  {
    "Time": "11:30",
    "ActivePower": 25,
    "Irradiance": 220
  },
  {
    "Time": "11:35",
    "ActivePower": 895,
    "Irradiance": 907
  },
  {
    "Time": "11:40",
    "ActivePower": 461,
    "Irradiance": 66
  },
  {
    "Time": "11:45",
    "ActivePower": 747,
    "Irradiance": 239
  },
  {
    "Time": "11:50",
    "ActivePower": 717,
    "Irradiance": 737
  },
  {
    "Time": "11:55",
    "ActivePower": 191,
    "Irradiance": 21
  },
  {
    "Time": "12:00",
    "ActivePower": 106,
    "Irradiance": 513
  },
  {
    "Time": "12:05",
    "ActivePower": 36,
    "Irradiance": 863
  },
  {
    "Time": "12:10",
    "ActivePower": 750,
    "Irradiance": 69
  },
  {
    "Time": "12:15",
    "ActivePower": 711,
    "Irradiance": 734
  },
  {
    "Time": "12:20",
    "ActivePower": 309,
    "Irradiance": 898
  },
  {
    "Time": "12:25",
    "ActivePower": 803,
    "Irradiance": 33
  },
  {
    "Time": "12:30",
    "ActivePower": 987,
    "Irradiance": 608
  },
  {
    "Time": "12:35",
    "ActivePower": 205,
    "Irradiance": 290
  },
  {
    "Time": "12:40",
    "ActivePower": 110,
    "Irradiance": 585
  },
  {
    "Time": "12:45",
    "ActivePower": 542,
    "Irradiance": 274
  },
  {
    "Time": "12:50",
    "ActivePower": 149,
    "Irradiance": 783
  },
  {
    "Time": "12:55",
    "ActivePower": 743,
    "Irradiance": 505
  },
  {
    "Time": "13:00",
    "ActivePower": 305,
    "Irradiance": 319
  },
  {
    "Time": "13:05",
    "ActivePower": 440,
    "Irradiance": 292
  },
  {
    "Time": "13:10",
    "ActivePower": 557,
    "Irradiance": 924
  },
  {
    "Time": "13:15",
    "ActivePower": 226,
    "Irradiance": 176
  },
  {
    "Time": "13:20",
    "ActivePower": 13,
    "Irradiance": 141
  },
  {
    "Time": "13:25",
    "ActivePower": 694,
    "Irradiance": 5
  },
  {
    "Time": "13:30",
    "ActivePower": 223,
    "Irradiance": 456
  },
  {
    "Time": "13:35",
    "ActivePower": 260,
    "Irradiance": 637
  },
  {
    "Time": "13:40",
    "ActivePower": 135,
    "Irradiance": 728
  },
  {
    "Time": "13:45",
    "ActivePower": 61,
    "Irradiance": 361
  },
  {
    "Time": "13:50",
    "ActivePower": 29,
    "Irradiance": 394
  },
  {
    "Time": "13:55",
    "ActivePower": 53,
    "Irradiance": 931
  },
  {
    "Time": "14:00",
    "ActivePower": 311,
    "Irradiance": 343
  },
  {
    "Time": "14:05",
    "ActivePower": 943,
    "Irradiance": 753
  },
  {
    "Time": "14:10",
    "ActivePower": 499,
    "Irradiance": 891
  },
  {
    "Time": "14:15",
    "ActivePower": 408,
    "Irradiance": 362
  },
  {
    "Time": "14:20",
    "ActivePower": 779,
    "Irradiance": 494
  },
  {
    "Time": "14:25",
    "ActivePower": 434,
    "Irradiance": 410
  },
  {
    "Time": "14:30",
    "ActivePower": 314,
    "Irradiance": 276
  },
  {
    "Time": "14:35",
    "ActivePower": 152,
    "Irradiance": 42
  },
  {
    "Time": "14:40",
    "ActivePower": 770,
    "Irradiance": 440
  },
  {
    "Time": "14:45",
    "ActivePower": 737,
    "Irradiance": 822
  },
  {
    "Time": "14:50",
    "ActivePower": 295,
    "Irradiance": 943
  },
  {
    "Time": "14:55",
    "ActivePower": 587,
    "Irradiance": 117
  },
  {
    "Time": "15:00",
    "ActivePower": 752,
    "Irradiance": 270
  },
  {
    "Time": "15:05",
    "ActivePower": 518,
    "Irradiance": 903
  },
  {
    "Time": "15:10",
    "ActivePower": 11,
    "Irradiance": 455
  },
  {
    "Time": "15:15",
    "ActivePower": 208,
    "Irradiance": 648
  },
  {
    "Time": "15:20",
    "ActivePower": 839,
    "Irradiance": 225
  },
  {
    "Time": "15:25",
    "ActivePower": 791,
    "Irradiance": 976
  },
  {
    "Time": "15:30",
    "ActivePower": 39,
    "Irradiance": 262
  },
  {
    "Time": "15:35",
    "ActivePower": 164,
    "Irradiance": 341
  },
  {
    "Time": "15:40",
    "ActivePower": 118,
    "Irradiance": 850
  },
  {
    "Time": "15:45",
    "ActivePower": 742,
    "Irradiance": 123
  },
  {
    "Time": "15:50",
    "ActivePower": 296,
    "Irradiance": 702
  },
  {
    "Time": "15:55",
    "ActivePower": 968,
    "Irradiance": 46
  },
  {
    "Time": "16:00",
    "ActivePower": 305,
    "Irradiance": 961
  },
  {
    "Time": "16:05",
    "ActivePower": 107,
    "Irradiance": 911
  },
  {
    "Time": "16:10",
    "ActivePower": 208,
    "Irradiance": 373
  },
  {
    "Time": "16:15",
    "ActivePower": 26,
    "Irradiance": 552
  },
  {
    "Time": "16:20",
    "ActivePower": 80,
    "Irradiance": 427
  },
  {
    "Time": "16:25",
    "ActivePower": 689,
    "Irradiance": 929
  },
  {
    "Time": "16:30",
    "ActivePower": 546,
    "Irradiance": 805
  },
  {
    "Time": "16:35",
    "ActivePower": 874,
    "Irradiance": 742
  },
  {
    "Time": "16:40",
    "ActivePower": 96,
    "Irradiance": 98
  },
  {
    "Time": "16:45",
    "ActivePower": 941,
    "Irradiance": 678
  },
  {
    "Time": "16:50",
    "ActivePower": 291,
    "Irradiance": 196
  },
  {
    "Time": "16:55",
    "ActivePower": 676,
    "Irradiance": 26
  },
  {
    "Time": "17:00",
    "ActivePower": 190,
    "Irradiance": 366
  },
  {
    "Time": "17:05",
    "ActivePower": 37,
    "Irradiance": 645
  },
  {
    "Time": "17:10",
    "ActivePower": 411,
    "Irradiance": 543
  },
  {
    "Time": "17:15",
    "ActivePower": 985,
    "Irradiance": 839
  },
  {
    "Time": "17:20",
    "ActivePower": 137,
    "Irradiance": 743
  },
  {
    "Time": "17:25",
    "ActivePower": 884,
    "Irradiance": 653
  },
  {
    "Time": "17:30",
    "ActivePower": 519,
    "Irradiance": 366
  },
  {
    "Time": "17:35",
    "ActivePower": 462,
    "Irradiance": 419
  },
  {
    "Time": "17:40",
    "ActivePower": 521,
    "Irradiance": 22
  },
  {
    "Time": "17:45",
    "ActivePower": 211,
    "Irradiance": 856
  },
  {
    "Time": "17:50",
    "ActivePower": 837,
    "Irradiance": 2
  },
  {
    "Time": "17:55",
    "ActivePower": 36,
    "Irradiance": 327
  },
  {
    "Time": "18:00",
    "ActivePower": 923,
    "Irradiance": 988
  },
  {
    "Time": "18:05",
    "ActivePower": 300,
    "Irradiance": 168
  },
  {
    "Time": "18:10",
    "ActivePower": 348,
    "Irradiance": 235
  },
  {
    "Time": "18:15",
    "ActivePower": 835,
    "Irradiance": 877
  },
  {
    "Time": "18:20",
    "ActivePower": 119,
    "Irradiance": 39
  },
  {
    "Time": "18:25",
    "ActivePower": 693,
    "Irradiance": 630
  },
  {
    "Time": "18:30",
    "ActivePower": 908,
    "Irradiance": 382
  },
  {
    "Time": "18:35",
    "ActivePower": 929,
    "Irradiance": 866
  },
  {
    "Time": "18:40",
    "ActivePower": 719,
    "Irradiance": 783
  },
  {
    "Time": "18:45",
    "ActivePower": 216,
    "Irradiance": 349
  },
  {
    "Time": "18:50",
    "ActivePower": 777,
    "Irradiance": 781
  },
  {
    "Time": "18:55",
    "ActivePower": 113,
    "Irradiance": 936
  },
  {
    "Time": "19:00",
    "ActivePower": 682,
    "Irradiance": 73
  },
  {
    "Time": "19:05",
    "ActivePower": 691,
    "Irradiance": 578
  },
  {
    "Time": "19:10",
    "ActivePower": 537,
    "Irradiance": 353
  },
  {
    "Time": "19:15",
    "ActivePower": 946,
    "Irradiance": 606
  },
  {
    "Time": "19:20",
    "ActivePower": 32,
    "Irradiance": 321
  },
  {
    "Time": "19:25",
    "ActivePower": 365,
    "Irradiance": 154
  },
  {
    "Time": "19:30",
    "ActivePower": 637,
    "Irradiance": 412
  },
  {
    "Time": "19:35",
    "ActivePower": 640,
    "Irradiance": 867
  },
  {
    "Time": "19:40",
    "ActivePower": 274,
    "Irradiance": 605
  },
  {
    "Time": "19:45",
    "ActivePower": 641,
    "Irradiance": 836
  },
  {
    "Time": "19:50",
    "ActivePower": 801,
    "Irradiance": 353
  },
  {
    "Time": "19:55",
    "ActivePower": 24,
    "Irradiance": 106
  },
  {
    "Time": "20:00",
    "ActivePower": 365,
    "Irradiance": 663
  },
  {
    "Time": "20:05",
    "ActivePower": 356,
    "Irradiance": 890
  },
  {
    "Time": "20:10",
    "ActivePower": 833,
    "Irradiance": 289
  },
  {
    "Time": "20:15",
    "ActivePower": 376,
    "Irradiance": 576
  },
  {
    "Time": "20:20",
    "ActivePower": 529,
    "Irradiance": 430
  },
  {
    "Time": "20:25",
    "ActivePower": 409,
    "Irradiance": 48
  },
  {
    "Time": "20:30",
    "ActivePower": 849,
    "Irradiance": 317
  },
  {
    "Time": "20:35",
    "ActivePower": 355,
    "Irradiance": 956
  },
  {
    "Time": "20:40",
    "ActivePower": 724,
    "Irradiance": 561
  },
  {
    "Time": "20:45",
    "ActivePower": 114,
    "Irradiance": 932
  },
  {
    "Time": "20:50",
    "ActivePower": 46,
    "Irradiance": 646
  },
  {
    "Time": "20:55",
    "ActivePower": 911,
    "Irradiance": 390
  },
  {
    "Time": "21:00",
    "ActivePower": 227,
    "Irradiance": 246
  },
  {
    "Time": "21:05",
    "ActivePower": 710,
    "Irradiance": 121
  },
  {
    "Time": "21:10",
    "ActivePower": 316,
    "Irradiance": 123
  },
  {
    "Time": "21:15",
    "ActivePower": 609,
    "Irradiance": 933
  },
  {
    "Time": "21:20",
    "ActivePower": 937,
    "Irradiance": 28
  },
  {
    "Time": "21:25",
    "ActivePower": 551,
    "Irradiance": 463
  },
  {
    "Time": "21:30",
    "ActivePower": 739,
    "Irradiance": 69
  },
  {
    "Time": "21:35",
    "ActivePower": 902,
    "Irradiance": 373
  },
  {
    "Time": "21:40",
    "ActivePower": 708,
    "Irradiance": 201
  },
  {
    "Time": "21:45",
    "ActivePower": 753,
    "Irradiance": 885
  },
  {
    "Time": "21:50",
    "ActivePower": 190,
    "Irradiance": 996
  },
  {
    "Time": "21:55",
    "ActivePower": 232,
    "Irradiance": 37
  },
  {
    "Time": "22:00",
    "ActivePower": 734,
    "Irradiance": 619
  },
  {
    "Time": "22:05",
    "ActivePower": 957,
    "Irradiance": 691
  },
  {
    "Time": "22:10",
    "ActivePower": 418,
    "Irradiance": 979
  },
  {
    "Time": "22:15",
    "ActivePower": 543,
    "Irradiance": 958
  },
  {
    "Time": "22:20",
    "ActivePower": 606,
    "Irradiance": 281
  },
  {
    "Time": "22:25",
    "ActivePower": 383,
    "Irradiance": 672
  },
  {
    "Time": "22:30",
    "ActivePower": 92,
    "Irradiance": 764
  },
  {
    "Time": "22:35",
    "ActivePower": 585,
    "Irradiance": 59
  },
  {
    "Time": "22:40",
    "ActivePower": 163,
    "Irradiance": 320
  },
  {
    "Time": "22:45",
    "ActivePower": 750,
    "Irradiance": 372
  },
  {
    "Time": "22:50",
    "ActivePower": 812,
    "Irradiance": 346
  },
  {
    "Time": "22:55",
    "ActivePower": 429,
    "Irradiance": 611
  },
  {
    "Time": "23:00",
    "ActivePower": 49,
    "Irradiance": 149
  },
  {
    "Time": "23:05",
    "ActivePower": 635,
    "Irradiance": 730
  },
  {
    "Time": "23:10",
    "ActivePower": 131,
    "Irradiance": 393
  },
  {
    "Time": "23:15",
    "ActivePower": 691,
    "Irradiance": 136
  },
  {
    "Time": "23:20",
    "ActivePower": 573,
    "Irradiance": 215
  },
  {
    "Time": "23:25",
    "ActivePower": 761,
    "Irradiance": 798
  },
  {
    "Time": "23:30",
    "ActivePower": 851,
    "Irradiance": 183
  },
  {
    "Time": "23:35",
    "ActivePower": 238,
    "Irradiance": 315
  },
  {
    "Time": "23:40",
    "ActivePower": 903,
    "Irradiance": 734
  },
  {
    "Time": "23:45",
    "ActivePower": 618,
    "Irradiance": 193
  },
  {
    "Time": "23:50",
    "ActivePower": 729,
    "Irradiance": 186
  },
  {
    "Time": "23:55",
    "ActivePower": 914,
    "Irradiance": 368
  }
]

export default rawdata;
  