<?php

namespace App\Tests\Command;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Exception\RuntimeException;
use Symfony\Component\Console\Tester\CommandTester;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class AddUserCommandTest extends KernelTestCase
{
    /**
     * @var string[]
     */
    private const BUYER = [
        'username' => 'test_buyer',
        'password' => 'foobar',
        'role' => 'ROLE_BUYER',
    ];
    private const SELLER = [
        'username' => 'test_seller',
        'password' => 'foobar',
        'role' => 'ROLE_SELLER',
    ];

    /**
     * @dataProvider addUserProvider
     */
    public function testAddUser(array $user, bool $expectException): void
    {
        if ($expectException) {
            $this->expectException(RuntimeException::class);
        }
        $this->executeCommand($user);

        if (!$expectException) {
            $this->assertUserCreated($user);
        }
    }

    public function testDuplicatedUsernameThrowsException(): void
    {
        $this->expectException(RuntimeException::class);
        $this->executeCommand(self::BUYER);
        $this->executeCommand(self::BUYER);
    }

    /**
     * @dataProvider addUserProvider
     */
    public function testSkipIfInvalidDoesNotThrow(array $user, bool $expectException): void
    {
        $commandTester = $this->executeCommand([...$user, '--skip-if-invalid' => true]);

        $this->assertEquals(Command::SUCCESS, $commandTester->getStatusCode());

        if (!$expectException) {
            $this->assertUserCreated($user);
        }
    }

    public function addUserProvider(): array
    {
        return [
            'Valid buyer' => ['user' => [...self::BUYER], 'expectException' => false],
            'Valid seller' => ['user' => [...self::SELLER], 'expectException' => false],
            'Invalid username' => ['user' => ['username' => '', 'password' => 'asd', 'role' => 'ROLE_BUYER'], 'expectException' => true],
            'Invalid password' => ['user' => ['username' => 'test', 'password' => '', 'role' => 'ROLE_BUYER'], 'expectException' => true],
            'Invalid role' => ['user' => ['username' => 'test', 'password' => 'asd', 'role' => 'x'], 'expectException' => true],
        ];
    }

    private function assertUserCreated(array $userData): void
    {
        /** @var UserRepository $repository */
        $repository = $this->getContainer()->get(UserRepository::class);

        /** @var UserPasswordHasherInterface $passwordHasher */
        $passwordHasher = $this->getContainer()->get(UserPasswordHasherInterface::class);

        $user = $repository->findOneByUsername($userData['username']);

        $this->assertNotNull($user);
        $this->assertTrue($passwordHasher->isPasswordValid($user, $userData['password']));
        $this->assertContains($userData['role'], $user->getRoles());
    }

    private function executeCommand(array $arguments): CommandTester
    {
        $kernel = self::bootKernel();
        $application = new Application($kernel);

        $command = $application->find('app:add-user');
        $commandTester = new CommandTester($command);
        $commandTester->execute($arguments);

        return $commandTester;
    }
}
