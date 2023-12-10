<?php

namespace App\Repository;

use App\Entity\Auction;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Auction>
 *
 * @method Auction|null find($id, $lockMode = null, $lockVersion = null)
 * @method Auction|null findOneBy(array $criteria, array $orderBy = null)
 * @method Auction[]    findAll()
 * @method Auction[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AuctionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Auction::class);
    }

    public function findCurrentPrice(int $id): int
    {
        return $this->createQueryBuilder('a')
            ->select('MAX(GREATEST(a.startingPrice - 1, b.price))')
            ->leftJoin('a.bids', 'b')
            ->where('a = :id')
            ->setParameters([
                'id' => $id,
            ])
            ->getQuery()
            ->getSingleScalarResult()
        ;
    }
}
