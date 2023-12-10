<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\OwnedEntityInterface;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;

#[AsDecorator('api_platform.doctrine.orm.state.persist_processor')]
final readonly class OwnedEntityProcessor implements ProcessorInterface
{
    public function __construct(
        private ProcessorInterface $innerProcessor,
        private Security $security
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        /** @var User $user */
        $user = $this->security->getUser();
        if ($data instanceof OwnedEntityInterface && null === $data->getOwner() && $user) {
            $data->setOwner($user);
        }

        return $this->innerProcessor->process($data, $operation, $uriVariables, $context);
    }
}
