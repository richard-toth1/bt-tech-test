<?php

namespace App\Entity;

interface OwnedEntityInterface
{
    public function getOwner(): ?User;

    public function setOwner(?User $owner): static;
}
