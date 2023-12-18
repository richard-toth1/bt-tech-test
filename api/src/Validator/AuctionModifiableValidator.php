<?php

namespace App\Validator;

use App\Entity\Auction;
use App\Enum\AuctionStatus;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

final class AuctionModifiableValidator extends ConstraintValidator
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function validate($value, Constraint $constraint): void
    {
        /* @var AuctionModifiable $constraint */
        if (null === $value || '' === $value) {
            return;
        }

        if (!$value instanceof Auction) {
            throw new UnexpectedValueException($value, Auction::class);
        }

        $unitOfWork = $this->entityManager->getUnitOfWork();
        $originalData = $unitOfWork->getOriginalEntityData($value);
        if (!isset($originalData['auctionStatus'])) {
            return;
        }

        if ($originalData['auctionStatus'] === $value->getAuctionStatus()) {
            return;
        }

        if (AuctionStatus::Pending === $originalData['auctionStatus']) {
            return;
        }

        $this->context->buildViolation($constraint->message)
            ->atPath('@id')
            ->addViolation();
    }
}
