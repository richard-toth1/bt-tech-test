<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231210113258 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add auction entity';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE auction_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE auction (id INT NOT NULL, picture_id INT DEFAULT NULL, owner_id INT NOT NULL, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, starting_price INT NOT NULL, closing_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, auction_status VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_DEE4F593EE45BDBF ON auction (picture_id)');
        $this->addSql('CREATE INDEX IDX_DEE4F5937E3C61F9 ON auction (owner_id)');
        $this->addSql('ALTER TABLE auction ADD CONSTRAINT FK_DEE4F593EE45BDBF FOREIGN KEY (picture_id) REFERENCES media_object (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE auction ADD CONSTRAINT FK_DEE4F5937E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP SEQUENCE auction_id_seq CASCADE');
        $this->addSql('ALTER TABLE auction DROP CONSTRAINT FK_DEE4F593EE45BDBF');
        $this->addSql('ALTER TABLE auction DROP CONSTRAINT FK_DEE4F5937E3C61F9');
        $this->addSql('DROP TABLE auction');
    }
}
