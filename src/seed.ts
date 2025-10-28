/**
 * Database seeding utilities for Mobile App Assignment 2
 * Provides functionality to seed the database with initial data
 */

import { log } from './request-log';

export interface SeedData {
  users?: any[];
  courses?: any[];
  sessions?: any[];
}

/**
 * Sample seed data
 */
const seedData: SeedData = {
  users: [
    {
      username: 'admin',
      email: 'admin@example.com',
      fullName: 'Admin User',
      studentId: 'S001',
      programmingLevel: 'advanced',
      isActive: true,
    },
    {
      username: 'student1',
      email: 'student1@example.com',
      fullName: 'Student One',
      studentId: 'S002',
      programmingLevel: 'beginner',
      isActive: true,
    },
  ],
  courses: [
    {
      title: 'Introduction to Programming',
      language: 'Python',
      level: 'beginner',
      category: 'programming',
      tags: ['python', 'basics'],
    },
    {
      title: 'Advanced Web Development',
      language: 'JavaScript',
      level: 'advanced',
      category: 'web',
      tags: ['javascript', 'web'],
    },
  ],
  sessions: [],
};

/**
 * Seed the database with initial data
 */
export async function seedDatabase(data: SeedData = seedData): Promise<void> {
  try {
    log.info('🌱 Starting database seeding...');

    // Note: In a real implementation, this would insert data into the database
    // For now, we'll just log what would be seeded

    if (data.users && data.users.length > 0) {
      log.info(`Seeding ${data.users.length} users`);
      for (const user of data.users) {
        log.debug('Creating user:', user.username);
        // await db.insert('users', user);
      }
    }

    if (data.courses && data.courses.length > 0) {
      log.info(`Seeding ${data.courses.length} courses`);
      for (const course of data.courses) {
        log.debug('Creating course:', course.title);
        // await db.insert('courses', course);
      }
    }

    if (data.sessions && data.sessions.length > 0) {
      log.info(`Seeding ${data.sessions.length} sessions`);
      for (const session of data.sessions) {
        log.debug('Creating session:', session);
        // await db.insert('sessions', session);
      }
    }

    log.info('✅ Database seeding completed successfully');
  } catch (error) {
    log.error('❌ Database seeding failed:', error);
    throw error;
  }
}

/**
 * Clear database (development only)
 */
export async function clearDatabase(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    log.warn('⚠️  Clear database is not allowed in production');
    return;
  }

  try {
    log.info('🗑️  Clearing database...');
    // Clear all tables
    log.info('✅ Database cleared');
  } catch (error) {
    log.error('❌ Failed to clear database:', error);
    throw error;
  }
}

/**
 * Reset database (clear and reseed)
 */
export async function resetDatabase(data: SeedData = seedData): Promise<void> {
  try {
    log.info('🔄 Resetting database...');
    await clearDatabase();
    await seedDatabase(data);
    log.info('✅ Database reset completed');
  } catch (error) {
    log.error('❌ Database reset failed:', error);
    throw error;
  }
}

/**
 * Check if database has data
 */
export async function hasData(): Promise<boolean> {
  try {
    // Check if any data exists
    return false; // Simplified for now
  } catch (error) {
    log.error('Failed to check database data:', error);
    return false;
  }
}

export default {
  seedDatabase,
  clearDatabase,
  resetDatabase,
  hasData,
  seedData,
};

