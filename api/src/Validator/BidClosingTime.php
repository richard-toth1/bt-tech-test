<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
final class BidClosingTime extends Constraint
{
    public string $message = 'No bids are allowed after closing time';

    #[\Override]
    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
