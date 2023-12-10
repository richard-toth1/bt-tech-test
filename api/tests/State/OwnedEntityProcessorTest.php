<?php

namespace App\Tests\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\OwnedEntityInterface;
use App\Entity\User;
use App\State\OwnedEntityProcessor;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Bundle\SecurityBundle\Security;

class OwnedEntityProcessorTest extends TestCase
{
    private MockObject|ProcessorInterface $innerProcessor;
    private MockObject|Security $security;
    private MockObject|OwnedEntityInterface $ownedEntity;
    private MockObject|Operation $operationMock;
    private OwnedEntityProcessor $ownedEntityProcessor;

    protected function setUp(): void
    {
        $this->innerProcessor = $this->createMock(ProcessorInterface::class);
        $this->security = $this->createMock(Security::class);
        $this->ownedEntity = $this->createMock(OwnedEntityInterface::class);
        $this->operationMock = $this->createMock(Operation::class);

        $this->ownedEntityProcessor = new OwnedEntityProcessor(
            $this->innerProcessor,
            $this->security
        );
    }

    public function testProcessUpdatesOwnerWhenNull(): void
    {
        $user = new User();

        $this->security
            ->expects($this->once())
            ->method('getUser')
            ->willReturn($user)
        ;

        $this->ownedEntity
            ->expects($this->once())
            ->method('getOwner')
            ->willReturn(null)
        ;

        $this->ownedEntity
            ->expects($this->once())
            ->method('setOwner')
            ->with($user)
        ;

        $this->ownedEntityProcessor->process($this->ownedEntity, $this->operationMock);
    }

    public function testProcessDoesntUpdateOwnerWhenNotNull(): void
    {
        $user = new User();

        $this->security
            ->expects($this->once())
            ->method('getUser')
            ->willReturn($user)
        ;

        $this->ownedEntity
            ->expects($this->once())
            ->method('getOwner')
            ->willReturn($user)
        ;

        $this->ownedEntity
            ->expects($this->never())
            ->method('setOwner')
        ;

        $this->ownedEntityProcessor->process($this->ownedEntity, $this->operationMock);
    }

    public function testProcessDoesntUpdateOwnerWhenNotAuthenticated(): void
    {
        $this->security
            ->expects($this->once())
            ->method('getUser')
            ->willReturn(null)
        ;

        $this->ownedEntity
            ->expects($this->once())
            ->method('getOwner')
            ->willReturn(null)
        ;

        $this->ownedEntity
            ->expects($this->never())
            ->method('setOwner')
        ;

        $this->ownedEntityProcessor->process($this->ownedEntity, $this->operationMock);
    }

    public function testProcessCallsDecoratedService(): void
    {
        $user = new User();

        $this->security
            ->expects($this->once())
            ->method('getUser')
            ->willReturn($user)
        ;

        $this->innerProcessor
            ->expects($this->once())
            ->method('process')
        ;

        $this->ownedEntityProcessor->process($this->ownedEntity, $this->operationMock);
    }
}
