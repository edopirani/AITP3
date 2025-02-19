📌 Prisma Syntax Differences for 1:1, 1:M, and M:M Relationships
Yes, Prisma uses different syntax for 1:1, 1:M, and M:M relationships. Here’s how they work and when to use them.

1️⃣ One-to-One (1:1) Relationship
🔹 Definition: Each row in Table A has at most one related row in Table B, and vice versa.

📌 Example: User ↔ Profile (Each User Has One Profile)
prisma

model User {
  id       String  @id @default(uuid()) @db.Uuid
  email    String  @unique
  password String
  
  profileId String? @unique @db.Uuid // Foreign key to Profile

  profile  Profile? @relation(fields: [profileId], references: [id], onDelete: Cascade)

}

model Profile {
  id      String @id @default(uuid()) @db.Uuid

  userId  String @unique @db.Uuid // Foreign key to User

  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
}
✅ Key Rules:

Foreign key must be @unique in both models to enforce a strict 1:1 relation.
One side (User) can have an optional Profile (Profile?).
Deleting a User also deletes the Profile (onDelete: Cascade).
2️⃣ One-to-Many (1:M) Relationship
🔹 Definition: Each row in Table A can have many related rows in Table B, but each row in Table B belongs to only one row in Table A.

📌 Example: User ↔ Trips (One User Can Have Multiple Trips)
prisma

model User {
  id    String  @id @default(uuid()) @db.Uuid
  email String  @unique
  
  trips Trip[]  // One User → Many Trips
}

model Trip {
  id      String  @id @default(uuid()) @db.Uuid
  name    String?

  userId  String  @db.Uuid
  
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}

✅ Key Rules:

One User can have multiple Trip records.
Each Trip has only one userId foreign key (which refers back to User).
Deleting a User deletes all their Trip records (onDelete: Cascade).
No @unique constraint on userId, because one user can have many trips.
3️⃣ Many-to-Many (M:M) Relationship
🔹 Definition: Each row in Table A can be related to many rows in Table B, and vice versa.

📌 Example: Profiles ↔ Interests (Each Profile Can Have Many Interests, and Each Interest Can Belong to Many Profiles)
prisma

model Profile {
  id        String  @id @default(uuid()) @db.Uuid
  name      String

  interests ProfileInterest[]
}

model Interest {
  id        String  @id @default(uuid()) @db.Uuid
  name      String

  profiles  ProfileInterest[]
}

model ProfileInterest {
  profileId String @db.Uuid
  interestId String @db.Uuid

  @@id([profileId, interestId]) // Composite Primary Key

  profile Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  interest Interest @relation(fields: [interestId], references: [id], onDelete: Cascade)
}

✅ Key Rules:

A Profile can have many Interests, and an Interest can belong to many Profiles.
We use a "Join Table" (ProfileInterest) to store the relationship.
@@id([profileId, interestId]) ensures each pair is unique (no duplicates).
Deleting a Profile or Interest removes its connections (onDelete: Cascade).
