<?php

namespace App\Tests\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Auction;
use App\Enum\AuctionStatus;
use App\State\AuctionStatusProcessor;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

class AuctionStatusProcessorTest extends TestCase
{
    private MockObject|ProcessorInterface $innerProcessor;
    private MockObject|Auction $auction;
    private MockObject|Operation $operationMock;
    private AuctionStatusProcessor $auctionStatusProcessor;

    protected function setUp(): void
    {
        $this->innerProcessor = $this->createMock(ProcessorInterface::class);
        $this->auction = $this->createMock(Auction::class);
        $this->operationMock = $this->createMock(Operation::class);

        $this->auctionStatusProcessor = new AuctionStatusProcessor(
            $this->innerProcessor,
        );
    }

    public function testProcessUpdatesAuctionStatusWhenNull(): void
    {
        $this->auction
            ->expects($this->once())
            ->method('getAuctionStatus')
            ->willReturn(null)
        ;

        $this->auction
            ->expects($this->once())
            ->method('setAuctionStatus')
            ->with(AuctionStatus::Pending)
        ;

        $this->auctionStatusProcessor->process($this->auction, $this->operationMock);
    }

    /**
     * @dataProvider dataProviderAuctionStatuses
     */
    public function testProcessDoesntUpdateAuctionStatusWhenNotNull(AuctionStatus $status): void
    {
        $this->auction
            ->expects($this->once())
            ->method('getAuctionStatus')
            ->willReturn($status)
        ;

        $this->auction
            ->expects($this->never())
            ->method('setAuctionStatus')
        ;

        $this->auctionStatusProcessor->process($this->auction, $this->operationMock);
    }

    public function testProcessCallsDecoratedService(): void
    {
        $this->innerProcessor
            ->expects($this->once())
            ->method('process')
        ;

        $this->auctionStatusProcessor->process($this->auction, $this->operationMock);
    }

    public function dataProviderAuctionStatuses(): array
    {
        return array_map(
            fn (\UnitEnum $case) => [$case],
            AuctionStatus::cases()
        );
    }
}
