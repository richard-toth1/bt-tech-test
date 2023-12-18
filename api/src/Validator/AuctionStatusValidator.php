<?php

namespace App\Validator;

use App\Entity\Auction;
use App\Enum\AuctionStatus;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Clock\ClockInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

final class AuctionStatusValidator extends ConstraintValidator
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ClockInterface $clock
    ) {
    }

    public function validate($value, Constraint $constraint): void
    {
        /* @var \App\Validator\AuctionStatus $constraint */

        if (null === $value || '' === $value) {
            return;
        }

        if (!$value instanceof Auction) {
            throw new UnexpectedValueException($value, Auction::class);
        }

        $unitOfWork = $this->entityManager->getUnitOfWork();
        $originalData = $unitOfWork->getOriginalEntityData($value);
        if (isset($originalData['auctionStatus'])) {
            if ($originalData['auctionStatus'] === $value->getAuctionStatus()) {
                return;
            }
        }

        if (AuctionStatus::Pending === $value->getAuctionStatus()) {
            return;
        }

        if ($value->getClosingTime() < $this->clock->now()) {
            return;
        }

        $this->context->buildViolation($constraint->message)
            ->atPath('auctionStatus')
            ->addViolation();
    }
}
