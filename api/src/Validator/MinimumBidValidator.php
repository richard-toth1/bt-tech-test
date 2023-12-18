<?php

namespace App\Validator;

use App\Entity\Bid;
use App\Repository\AuctionRepository;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

final class MinimumBidValidator extends ConstraintValidator
{
    public function __construct(
        private readonly AuctionRepository $auctionRepository
    ) {
    }

    /* @var MinimumBid $constraint */
    public function validate($value, Constraint $constraint): void
    {
        if (null === $value || '' === $value) {
            return;
        }

        if (!$value instanceof Bid) {
            throw new UnexpectedValueException($value, Bid::class);
        }

        $currentPrice = $this->auctionRepository->findCurrentPrice($value->getAuction()->getId());

        if ($currentPrice < $value->getPrice()) {
            return;
        }
        $this->context->buildViolation($constraint->message)
            ->atPath('price')
            ->setParameter('{{ minimumBid }}', $currentPrice + 1)
            ->addViolation();
    }
}
