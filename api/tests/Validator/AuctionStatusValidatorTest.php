<?php

namespace App\Tests\Validator;

use App\Entity\Auction;
use App\Enum\AuctionStatus as AuctionStatusEnum;
use App\Validator\AuctionStatus;
use App\Validator\AuctionStatusValidator;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\UnitOfWork;
use PHPUnit\Framework\MockObject\MockObject;
use Symfony\Component\Clock\MockClock;
use Symfony\Component\Validator\ConstraintValidatorInterface;
use Symfony\Component\Validator\Exception\UnexpectedValueException;
use Symfony\Component\Validator\Test\ConstraintValidatorTestCase;

class AuctionStatusValidatorTest extends ConstraintValidatorTestCase
{
    private const string BEFORE_NOW = '2023-12-16 13:34:00';
    private const string NOW = '2023-12-16 13:35:00';
    private const string AFTER_NOW = '2023-12-16 13:36:00';

    private MockObject|EntityManagerInterface $entityManager;
    private MockClock $clock;

    protected function setUp(): void
    {
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->clock = new MockClock(self::NOW);

        parent::setUp();
    }

    #[\Override]
    protected function createValidator(): ConstraintValidatorInterface
    {
        return new AuctionStatusValidator(
            $this->entityManager,
            $this->clock,
        );
    }

    public function testNullIsValid(): void
    {
        $this->validator->validate(null, new AuctionStatus());

        $this->assertNoViolation();
    }

    public function testTypeChecked(): void
    {
        $this->expectException(UnexpectedValueException::class);

        $this->validator->validate('x', new AuctionStatus());
    }

    /**
     * @dataProvider dataProviderCases
     */
    public function testCases(
        ?AuctionStatusEnum $oldStatus,
        AuctionStatusEnum $newStatus,
        string $closeTime,
        bool $isValid
    ): void {
        $auction = $this->setupAuction($oldStatus, $newStatus, $closeTime);

        $constraint = new AuctionStatus();
        $this->validator->validate($auction, $constraint);

        if ($isValid) {
            $this->assertNoViolation();

            return;
        }

        $this->buildViolation($constraint->message)
            ->atPath('property.path.auctionStatus')
            ->assertRaised();
    }

    public function dataProviderCases(): array
    {
        return [
            'New, Not closed, Pending' => [null, AuctionStatusEnum::Pending, self::AFTER_NOW, true],
            'New, Not closed, Accepted' => [null, AuctionStatusEnum::Accepted, self::AFTER_NOW, false],
            'New, Not closed, Rejected' => [null, AuctionStatusEnum::Rejected, self::AFTER_NOW, false],

            'Existing Pending, Not closed, Pending' => [
                AuctionStatusEnum::Pending, AuctionStatusEnum::Pending, self::AFTER_NOW, true,
            ],
            'Existing Pending, Closed, Pending' => [
                AuctionStatusEnum::Pending, AuctionStatusEnum::Pending, self::BEFORE_NOW, true,
            ],

            'Existing Pending, Not closed, Accepted' => [
                AuctionStatusEnum::Pending, AuctionStatusEnum::Accepted, self::AFTER_NOW, false,
            ],
            'Existing Pending, Not closed, Rejected' => [
                AuctionStatusEnum::Pending, AuctionStatusEnum::Rejected, self::AFTER_NOW, false,
            ],
            'Existing Pending, Closed, Accepted' => [
                AuctionStatusEnum::Pending, AuctionStatusEnum::Accepted, self::BEFORE_NOW, true,
            ],
            'Existing Pending, Closed, Rejected' => [
                AuctionStatusEnum::Pending, AuctionStatusEnum::Rejected, self::BEFORE_NOW, true,
            ],
        ];
    }

    private function setupAuction(
        ?AuctionStatusEnum $oldStatus,
        AuctionStatusEnum $newStatus,
        string $closeTime,
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
        $auction
            ->method('getClosingTime')
            ->willReturn(new \DateTime($closeTime));

        return $auction;
    }
}
