<?php

namespace App\Validator;

use App\Entity\Bid;
use Symfony\Component\Clock\ClockInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

final class BidClosingTimeValidator extends ConstraintValidator
{
    public function __construct(
        private readonly ClockInterface $clock
    ) {
    }

    public function validate($value, Constraint $constraint): void
    {
        /* @var BidClosingTime $constraint */

        if (null === $value || '' === $value) {
            return;
        }

        if (!$value instanceof Bid) {
            throw new UnexpectedValueException($value, Bid::class);
        }

        if ($value->getAuction()?->getClosingTime() > $this->clock->now()) {
            return;
        }

        $this->context->buildViolation($constraint->message)
            ->atPath('price')
            ->addViolation();
    }
}
