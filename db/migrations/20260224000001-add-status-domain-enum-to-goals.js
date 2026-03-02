"use strict";

const VALID_DOMAINS = [
  'Frontend',
  'Backend',
  'Full Stack',
  'DevOps',
  'Cybersecurity',
  'Networking',
  'Cloud Computing',
  'Artificial Intelligence',
  'Data Science',
  'Mobile Development',
  'Game Development',
  'Blockchain',
  'Embedded Systems',
  'UI/UX Design',
  'Database Engineering',
  'Software Architecture',
  'Testing & QA',
  'System Administration',
  'Tech Stack'
];

module.exports = {
  async up(queryInterface, Sequelize) {
    const q = queryInterface.sequelize;

    //
    await q.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_goals_status" AS ENUM ('In-Progress', 'Completed');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await q.query(`
      ALTER TABLE goals
        ADD COLUMN IF NOT EXISTS "status" "enum_goals_status" NOT NULL DEFAULT 'In-Progress';
    `);

    // Create domain ENUM type
    const domainValues = VALID_DOMAINS.map(d => `'${d}'`).join(', ');
    await q.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_goals_domain" AS ENUM (${domainValues});
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    // Cast existing domain values to the ENUM (unknown/null values → null)
    await q.query(`
      ALTER TABLE goals
        ALTER COLUMN domain DROP DEFAULT,
        ALTER COLUMN domain TYPE "enum_goals_domain"
          USING CASE
            WHEN domain IN (${domainValues}) THEN domain::"enum_goals_domain"
            ELSE NULL
          END,
        ALTER COLUMN domain SET DEFAULT NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    const q = queryInterface.sequelize;

    // Revert status
    await q.query(`ALTER TABLE goals DROP COLUMN IF EXISTS "status";`);
    await q.query(`DROP TYPE IF EXISTS "enum_goals_status";`);

    // Revert domain to varchar
    await q.query(`
      ALTER TABLE goals
        ALTER COLUMN domain TYPE VARCHAR(255) USING domain::text;
    `);
    await q.query(`DROP TYPE IF EXISTS "enum_goals_domain";`);
  },
};
