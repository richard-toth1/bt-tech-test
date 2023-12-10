<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use App\Repository\BidRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: BidRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['bid:read']],
    denormalizationContext: ['groups' => ['bid:write']]
)]
#[Get]
#[Post(security: "is_granted('".User::ROLE_BUYER."')")]
class Bid implements OwnedEntityInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['bid:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'bids')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    #[Groups(['bid:read', 'bid:write'])]
    private ?Auction $auction = null;

    #[ORM\ManyToOne(inversedBy: 'bids')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['bid:read'])]
    private ?User $owner = null;

    #[ORM\Column]
    #[Assert\NotNull]
    #[Assert\Positive]
    #[Groups(['bid:read', 'bid:write'])]
    private ?int $price = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAuction(): ?Auction
    {
        return $this->auction;
    }

    public function setAuction(?Auction $auction): static
    {
        $this->auction = $auction;

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(int $price): static
    {
        $this->price = $price;

        return $this;
    }
}
