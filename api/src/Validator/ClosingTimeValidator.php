<?php

namespace App\Validator;

use App\Entity\Auction;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Clock\ClockInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

final class ClosingTimeValidator extends ConstraintValidator
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ClockInterface $clock
    ) {
    }

    public function validate($value, Constraint $constraint): void
    {
        /* @var ClosingTime $constraint */
        if (null === $value || '' === $value) {
            return;
        }

        if (!$value instanceof Auction) {
            throw new UnexpectedValueException($value, Auction::class);
        }

        $unitOfWork = $this->entityManager->getUnitOfWork();
        $originalData = $unitOfWork->getOriginalEntityData($value);
        if (isset($originalData['closingTime'])) {
            if ($originalData['closingTime']->getTimestamp() === $value->getClosingTime()->getTimestamp()) {
                return;
            }
        }

        if ($value->getClosingTime() > $this->clock->now()) {
            return;
        }

        $this->context->buildViolation($constraint->message)
            ->atPath('closingTime')
            ->addViolation();
    }
}
