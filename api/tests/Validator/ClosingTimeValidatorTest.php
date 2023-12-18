<?php

namespace App\Tests\Validator;

use App\Entity\Auction;
use App\Validator\ClosingTime;
use App\Validator\ClosingTimeValidator;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\UnitOfWork;
use PHPUnit\Framework\MockObject\MockObject;
use Symfony\Component\Clock\MockClock;
use Symfony\Component\Validator\ConstraintValidatorInterface;
use Symfony\Component\Validator\Exception\UnexpectedValueException;
use Symfony\Component\Validator\Test\ConstraintValidatorTestCase;

final class ClosingTimeValidatorTest extends ConstraintValidatorTestCase
{
    private const string BEFORE_NOW = '2023-12-16 13:34:00';
    private const string BEFORE_NOW_2 = '2023-12-16 13:33:00';
    private const string NOW = '2023-12-16 13:35:00';
    private const string AFTER_NOW = '2023-12-16 13:36:00';
    private const string AFTER_NOW_2 = '2023-12-16 13:37:00';

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
        return new ClosingTimeValidator(
            $this->entityManager,
            $this->clock,
        );
    }

    public function testNullIsValid(): void
    {
        $this->validator->validate(null, new ClosingTime());

        $this->assertNoViolation();
    }

    public function testTypeChecked(): void
    {
        $this->expectException(UnexpectedValueException::class);

        $this->validator->validate('x', new ClosingTime());
    }

    /**
     * @dataProvider dataProviderCases
     */
    public function testCases(?string $old, string $new, bool $isValid)
    {
        $auction = $this->setupAuction($old, $new);

        $constraint = new ClosingTime();
        $this->validator->validate($auction, $constraint);

        if ($isValid) {
            $this->assertNoViolation();

            return;
        }

        $this->buildViolation($constraint->message)
            ->atPath('property.path.closingTime')
            ->assertRaised();
    }

    public function dataProviderCases(): array
    {
        return [
            'New auction, future' => [null, self::AFTER_NOW, true],
            'New auction, now' => [null, self::NOW, false],
            'New auction, past' => [null, self::BEFORE_NOW, false],
            'Existing auction, in past, no change' => [self::BEFORE_NOW, self::BEFORE_NOW, true],
            'Existing auction, in past, change to future' => [self::BEFORE_NOW, self::AFTER_NOW, true],
            'Existing auction, in past, change to past' => [self::BEFORE_NOW, self::BEFORE_NOW_2, false],
            'Existing auction, in future, no change' => [self::AFTER_NOW, self::AFTER_NOW, true],
            'Existing auction, in future, change to future' => [self::AFTER_NOW, self::AFTER_NOW_2, true],
            'Existing auction, in future, change to past' => [self::AFTER_NOW, self::BEFORE_NOW, false],
        ];
    }

    private function setupAuction(?string $oldClosingTime, ?string $newClosingTime): MockObject|Auction
    {
        $unitOfWork = $this->createMock(UnitOfWork::class);
        $unitOfWork
            ->method('getOriginalEntityData')
            ->willReturn([
                'closingTime' => $oldClosingTime ? new \DateTime($oldClosingTime) : null,
            ]);
        $this->entityManager
            ->method('getUnitOfWork')
            ->willReturn($unitOfWork);

        $auction = $this->createMock(Auction::class);
        $auction
            ->method('getClosingTime')
            ->willReturn($newClosingTime ? new \DateTime($newClosingTime) : null)
        ;

        return $auction;
    }
}
