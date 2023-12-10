<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
final class MinimumBid extends Constraint
{
    public string $message = 'Your bid must be at least {{ minimumBid }}';

    #[\Override]
    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
