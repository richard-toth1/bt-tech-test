<?php

namespace App\Tests\Validator;

use App\Entity\Auction;
use App\Entity\Bid;
use App\Repository\AuctionRepository;
use App\Validator\MinimumBid;
use App\Validator\MinimumBidValidator;
use PHPUnit\Framework\MockObject\MockObject;
use Symfony\Component\Validator\ConstraintValidatorInterface;
use Symfony\Component\Validator\Exception\UnexpectedValueException;
use Symfony\Component\Validator\Test\ConstraintValidatorTestCase;

final class MinimumBidValidatorTest extends ConstraintValidatorTestCase
{
    private const int CURRENT_AUCTION_PRICE = 10;
    private MockObject|AuctionRepository $auctionRepository;

    protected function setUp(): void
    {
        $this->auctionRepository = $this->createMock(AuctionRepository::class);

        parent::setUp();
    }

    #[\Override]
    protected function createValidator(): ConstraintValidatorInterface
    {
        return new MinimumBidValidator($this->auctionRepository);
    }

    public function testNullIsValid(): void
    {
        $this->validator->validate(null, new MinimumBid());

        $this->assertNoViolation();
    }

    public function testTypeChecked(): void
    {
        $this->expectException(UnexpectedValueException::class);

        $this->validator->validate('x', new MinimumBid());
    }

    public function testValidCase(): void
    {
        $bid = $this->createBid(self::CURRENT_AUCTION_PRICE + 1);

        $this->auctionRepository
            ->expects(self::once())
            ->method('findCurrentPrice')
            ->willReturn(self::CURRENT_AUCTION_PRICE)
        ;

        $this->validator->validate($bid, new MinimumBid());

        $this->assertNoViolation();
    }

    /**
     * @dataProvider dataProviderInvalidCases
     */
    public function testInvalidCases(int $price): void
    {
        $bid = $this->createBid($price);

        $this->auctionRepository
            ->expects(self::once())
            ->method('findCurrentPrice')
            ->willReturn(self::CURRENT_AUCTION_PRICE)
        ;

        $this->validator->validate($bid, new MinimumBid());
    }

    public function dataProviderInvalidCases(): array
    {
        return [
            'Exact' => [self::CURRENT_AUCTION_PRICE],
            'Smaller' => [self::CURRENT_AUCTION_PRICE - 1],
            'Even smaller' => [self::CURRENT_AUCTION_PRICE - 1000],
        ];
    }

    private function createBid(int $price): MockObject|Bid
    {
        $auction = $this->createMock(Auction::class);
        $auction
            ->method('getId')
            ->willReturn(1)
        ;
        $bid = $this->createMock(Bid::class);
        $bid
            ->method('getPrice')
            ->willReturn($price)
        ;
        $bid
            ->method('getAuction')
            ->willReturn($auction)
        ;

        return $bid;
    }
}
