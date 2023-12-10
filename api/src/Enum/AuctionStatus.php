<?php

namespace App\Enum;

enum AuctionStatus: string
{
    case Pending = 'Pending';
    case Accepted = 'Accepted';
    case Rejected = 'Rejected';
}
