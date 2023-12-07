<?php

namespace App\Command;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Exception\RuntimeException;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:add-user',
    description: 'Creates users and stores them in the database'
)]
final class AddUserCommand extends Command
{
    private SymfonyStyle $io;

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly UserRepository $users
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('username', InputArgument::REQUIRED, 'The username of the new user')
            ->addArgument('password', InputArgument::REQUIRED, 'The plain password of the new user')
            ->addArgument('role', InputArgument::REQUIRED, 'The role of the new user. Either ROLE_BUYER or ROLE_SELLER')
            ->addOption('skip-if-invalid', description: 'Prevents throwing exception on validation error')
        ;
    }

    protected function initialize(InputInterface $input, OutputInterface $output): void
    {
        $this->io = new SymfonyStyle($input, $output);
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        if ($input->getOption('skip-if-invalid')) {
            return Command::SUCCESS;
        }
        /** @var string $username */
        $username = $input->getArgument('username');
        /** @var string $plainPassword */
        $plainPassword = $input->getArgument('password');
        /** @var string $role */
        $role = $input->getArgument('role');

        try {
            $this->validateUserData($username, $plainPassword, $role);
        } catch (\Throwable $throwable) {
            if ($input->getOption('skip-if-invalid')) {
                return Command::SUCCESS;
            }

            throw $throwable;
        }

        // create the user and hash its password
        $user = new User();
        $user->setUsername($username);
        $user->setRoles([$role]);
        $hashedPassword = $this->passwordHasher->hashPassword($user, $plainPassword);
        $user->setPassword($hashedPassword);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $this->io->success(sprintf('%s role user was successfully created: %s', User::ROLE_SELLER === $role ? 'Seller' : 'Buyer', $user->getUsername()));

        return Command::SUCCESS;
    }

    private function validateUserData(string $username, string $password, string $role): void
    {
        if ('' === trim($username)) {
            throw new RuntimeException('Username cannot be empty');
        }

        if ('' === trim($password)) {
            throw new RuntimeException('Password cannot be empty');
        }

        $validRoles = [User::ROLE_BUYER, User::ROLE_SELLER];
        if (!in_array($role, $validRoles)) {
            throw new RuntimeException(sprintf('User role must be one of these: %s', implode(', ', $validRoles)));
        }

        $existingUser = $this->users->findOneBy(['username' => $username]);
        if (null !== $existingUser) {
            throw new RuntimeException(sprintf('There is already a user registered with the "%s" username.', $username));
        }
    }
}
