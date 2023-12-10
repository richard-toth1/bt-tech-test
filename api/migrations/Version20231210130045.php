<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231210130045 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add bid entity';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE bid_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE bid (id INT NOT NULL, auction_id INT NOT NULL, owner_id INT NOT NULL, price INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_4AF2B3F357B8F0DE ON bid (auction_id)');
        $this->addSql('CREATE INDEX IDX_4AF2B3F37E3C61F9 ON bid (owner_id)');
        $this->addSql('ALTER TABLE bid ADD CONSTRAINT FK_4AF2B3F357B8F0DE FOREIGN KEY (auction_id) REFERENCES auction (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE bid ADD CONSTRAINT FK_4AF2B3F37E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE bid_id_seq CASCADE');
        $this->addSql('ALTER TABLE bid DROP CONSTRAINT FK_4AF2B3F357B8F0DE');
        $this->addSql('ALTER TABLE bid DROP CONSTRAINT FK_4AF2B3F37E3C61F9');
        $this->addSql('DROP TABLE bid');
    }
}
