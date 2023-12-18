<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
final class AuctionModifiable extends Constraint
{
    public string $message = 'Auction can only be modified in the Pending status';

    #[\Override]
    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
