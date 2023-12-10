<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Auction;
use App\Enum\AuctionStatus;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;

#[AsDecorator('api_platform.doctrine.orm.state.persist_processor')]
final readonly class AuctionStatusProcessor implements ProcessorInterface
{
    public function __construct(
        private ProcessorInterface $innerProcessor,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($data instanceof Auction && null === $data->getAuctionStatus()) {
            $data->setAuctionStatus(AuctionStatus::Pending);
        }

        return $this->innerProcessor->process($data, $operation, $uriVariables, $context);
    }
}
