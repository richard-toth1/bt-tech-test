<?php

namespace App\Tests\Validator;

use App\Entity\Auction;
use App\Entity\Bid;
use App\Validator\BidClosingTime;
use App\Validator\BidClosingTimeValidator;
use PHPUnit\Framework\MockObject\MockObject;
use Symfony\Component\Clock\MockClock;
use Symfony\Component\Validator\ConstraintValidatorInterface;
use Symfony\Component\Validator\Exception\UnexpectedValueException;
use Symfony\Component\Validator\Test\ConstraintValidatorTestCase;

final class BidClosingTimeValidatorTest extends ConstraintValidatorTestCase
{
    private const string BEFORE_NOW = '2023-12-16 13:34:00';
    private const string NOW = '2023-12-16 13:35:00';
    private const string AFTER_NOW = '2023-12-16 13:36:00';

    private MockClock $clock;

    protected function setUp(): void
    {
        $this->clock = new MockClock(self::NOW);

        parent::setUp();
    }

    #[\Override]
    protected function createValidator(): ConstraintValidatorInterface
    {
        return new BidClosingTimeValidator(
            $this->clock
        );
    }

    public function testNullIsValid(): void
    {
        $this->validator->validate(null, new BidClosingTime());

        $this->assertNoViolation();
    }

    public function testTypeChecked(): void
    {
        $this->expectException(UnexpectedValueException::class);

        $this->validator->validate('x', new BidClosingTime());
    }

    /**
     * @dataProvider dataProviderCases
     */
    public function testCases(string $closingTime, bool $isValid): void
    {
        $bid = $this->createBid($closingTime);

        $constraint = new BidClosingTime();
        $this->validator->validate($bid, $constraint);

        if ($isValid) {
            $this->assertNoViolation();

            return;
        }

        $this->buildViolation($constraint->message)
            ->atPath('property.path.price')
            ->assertRaised();
    }

    public function dataProviderCases(): array
    {
        return [
            'Closing time in future' => [self::AFTER_NOW, true],
            'Closing time is now' => [self::NOW, false],
            'Closing time in past' => [self::BEFORE_NOW, false],
        ];
    }

    private function createBid(string $closingTime): MockObject|Bid
    {
        $auction = $this->createMock(Auction::class);
        $auction
            ->method('getClosingTime')
            ->willReturn(new \DateTime($closingTime))
        ;
        $bid = $this->createMock(Bid::class);
        $bid
            ->method('getAuction')
            ->willReturn($auction)
        ;

        return $bid;
    }
}
