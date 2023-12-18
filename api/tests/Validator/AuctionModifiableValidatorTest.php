<?php

namespace App\Tests\Validator;

use App\Entity\Auction;
use App\Enum\AuctionStatus as AuctionStatusEnum;
use App\Validator\AuctionModifiable;
use App\Validator\AuctionModifiableValidator;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\UnitOfWork;
use PHPUnit\Framework\MockObject\MockObject;
use Symfony\Component\Validator\ConstraintValidatorInterface;
use Symfony\Component\Validator\Exception\UnexpectedValueException;
use Symfony\Component\Validator\Test\ConstraintValidatorTestCase;

final class AuctionModifiableValidatorTest extends ConstraintValidatorTestCase
{
    private MockObject|EntityManagerInterface $entityManager;

    protected function setUp(): void
    {
        $this->entityManager = $this->createMock(EntityManagerInterface::class);

        parent::setUp();
    }

    public function testNullIsValid(): void
    {
        $this->validator->validate(null, new AuctionModifiable());

        $this->assertNoViolation();
    }

    public function testTypeChecked(): void
    {
        $this->expectException(UnexpectedValueException::class);

        $this->validator->validate('x', new AuctionModifiable());
    }

    /**
     * @dataProvider dataProviderCases
     */
    public function testCases(
        ?AuctionStatusEnum $oldStatus,
        AuctionStatusEnum $newStatus,
        bool $isValid
    ): void {
        $auction = $this->setupAuction($oldStatus, $newStatus);

        $constraint = new AuctionModifiable();
        $this->validator->validate($auction, $constraint);

        if ($isValid) {
            $this->assertNoViolation();

            return;
        }

        $this->buildViolation($constraint->message)
            ->atPath('property.path.@id')
            ->assertRaised();
    }

    public function dataProviderCases(): array
    {
        return [
            'New, Pending' => [null, AuctionStatusEnum::Pending, true],
            'New, Accepted' => [null, AuctionStatusEnum::Accepted, true],
            'New, Rejected' => [null, AuctionStatusEnum::Rejected, true],

            'Pending, Pending' => [AuctionStatusEnum::Pending, AuctionStatusEnum::Pending, true],
            'Pending, Accepted' => [AuctionStatusEnum::Pending, AuctionStatusEnum::Accepted, true],
            'Pending, Rejected' => [AuctionStatusEnum::Pending, AuctionStatusEnum::Rejected, true],

            'Accepted, Pending' => [AuctionStatusEnum::Accepted, AuctionStatusEnum::Pending, false],
            'Accepted, Accepted' => [AuctionStatusEnum::Accepted, AuctionStatusEnum::Accepted, true],
            'Accepted, Rejected' => [AuctionStatusEnum::Accepted, AuctionStatusEnum::Rejected, false],

            'Rejected, Pending' => [AuctionStatusEnum::Rejected, AuctionStatusEnum::Pending, false],
            'Rejected, Accepted' => [AuctionStatusEnum::Rejected, AuctionStatusEnum::Accepted, false],
            'Rejected, Rejected' => [AuctionStatusEnum::Rejected, AuctionStatusEnum::Rejected, true],
        ];
    }

    #[\Override]
    protected function createValidator(): ConstraintValidatorInterface
    {
        return new AuctionModifiableValidator(
            $this->entityManager,
        );
    }

    private function setupAuction(
        ?AuctionStatusEnum $oldStatus,
        AuctionStatusEnum $newStatus,
    ): MockObject|Auction {
        $unitOfWork = $this->createMock(UnitOfWork::class);
        $unitOfWork
            ->method('getOriginalEntityData')
            ->willReturn([
                'auctionStatus' => $oldStatus,
            ]);
        $this->entityManager
            ->method('getUnitOfWork')
            ->willReturn($unitOfWork);

        $auction = $this->createMock(Auction::class);
        $auction
            ->method('getAuctionStatus')
            ->willReturn($newStatus);

        return $auction;
    }
}
