<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Enum\AuctionStatus;
use App\Repository\AuctionRepository;
use App\Validator\AuctionModifiable;
use App\Validator\ClosingTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: AuctionRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    normalizationContext: [
        'groups' => ['auction:read'],
        DateTimeNormalizer::FORMAT_KEY => 'Y-m-d H:i',
    ],
    denormalizationContext: ['groups' => ['auction:write']],
    collectDenormalizationErrors: true,
    mercure: true
)]
#[Get]
#[GetCollection]
#[Post(security: "is_granted('".User::ROLE_SELLER."')")]
#[Put(security: 'object.getOwner() == user')]
#[Delete(security: 'object.getOwner() == user')]
#[ApiFilter(SearchFilter::class, properties: ['title' => 'partial', 'description' => 'partial'])]
#[\App\Validator\AuctionStatus]
#[ClosingTime]
#[AuctionModifiable]
class Auction implements OwnedEntityInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['auction:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['auction:read', 'auction:write'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Assert\NotBlank]
    #[Groups(['auction:read', 'auction:write'])]
    private ?string $description = null;

    #[ORM\ManyToOne]
    #[Assert\NotNull]
    #[Groups(['auction:read', 'auction:write'])]
    private ?MediaObject $picture = null;

    #[ORM\Column]
    #[Assert\NotNull]
    #[Assert\Positive]
    #[Groups(['auction:read', 'auction:write'])]
    private ?int $startingPrice = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Assert\NotNull]
    #[Groups(['auction:read', 'auction:write'])]
    private ?\DateTimeInterface $closingTime = null;

    #[ORM\Column(type: 'string', enumType: AuctionStatus::class)]
    #[Groups(['auction:read', 'auction:write'])]
    #[Assert\Type(type: AuctionStatus::class)]
    private ?AuctionStatus $auctionStatus = null;

    #[ORM\ManyToOne(inversedBy: 'auctions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['auction:read'])]
    private ?User $owner = null;

    #[ORM\OneToMany(mappedBy: 'auction', targetEntity: Bid::class, orphanRemoval: true)]
    #[Groups(['auction:read'])]
    private Collection $bids;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $lastModified = null;

    public function __construct()
    {
        $this->bids = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getPicture(): ?MediaObject
    {
        return $this->picture;
    }

    public function setPicture(?MediaObject $picture): static
    {
        $this->picture = $picture;

        return $this;
    }

    public function getStartingPrice(): ?int
    {
        return $this->startingPrice;
    }

    public function setStartingPrice(int $startingPrice): static
    {
        $this->startingPrice = $startingPrice;

        return $this;
    }

    public function getClosingTime(): ?\DateTimeInterface
    {
        return $this->closingTime;
    }

    public function setClosingTime(\DateTimeInterface $closingTime): static
    {
        $this->closingTime = $closingTime;

        return $this;
    }

    public function getAuctionStatus(): ?AuctionStatus
    {
        return $this->auctionStatus;
    }

    public function setAuctionStatus(?AuctionStatus $auctionStatus): void
    {
        $this->auctionStatus = $auctionStatus;
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

    /**
     * @return Collection<int, Bid>
     */
    public function getBids(): Collection
    {
        return $this->bids;
    }

    public function addBid(Bid $bid): static
    {
        if (!$this->bids->contains($bid)) {
            $this->updateLastModified();
            $this->bids->add($bid);
            $bid->setAuction($this);
        }

        return $this;
    }

    public function removeBid(Bid $bid): static
    {
        if ($this->bids->removeElement($bid)) {
            $this->updateLastModified();
            // set the owning side to null (unless already changed)
            if ($bid->getAuction() === $this) {
                $bid->setAuction(null);
            }
        }

        return $this;
    }

    public function getLastModified(): \DateTimeInterface
    {
        return $this->lastModified;
    }

    #[ORM\PreUpdate]
    #[ORM\PrePersist]
    public function updateLastModified(): void
    {
        $this->lastModified = new \DateTime();
    }
}
