🚀 1. One-to-Many (1:N)
Rule: The table that has the foreign key "belongs to" the other table, meaning the other table can have many records of it.

Foreign key is in the "child" table (the "many" side).
The "parent" table does not store any references to the child.
Example:

A Profile belongs to one RelationshipStatus, but one RelationshipStatus can be used by many Profiles.
prisma

model Profile {
  id                   String   @id @default(uuid()) @db.Uuid
  relationshipStatusId String?  @db.Uuid  // FK to RelationshipStatus

  relationshipStatus   RelationshipStatus? @relation(fields: [relationshipStatusId], references: [id], onDelete: SetNull)
}

model RelationshipStatus {
  id        String   @id @default(uuid()) @db.Uuid
  status    String   @unique // "Single", "In a Relationship", "Married"
  profiles  Profile[] // One status can be linked to multiple profiles
}
✅ Since the foreign key (relationshipStatusId) is in Profile, many Profile records can have the same status.
✅ 1 RelationshipStatus → Multiple Profiles (1:N).

🛠 Quick Way to Identify (1:N)
If Table A has the foreign key pointing to Table B, then:
A belongs to B (one B can have many A).
ER Diagram (DBeaver):
Black dot (⚫) on the foreign key column.
Solid line connecting them.
🚀 2. One-to-One (1:1)
Rule: If the foreign key is @unique, then only one record in Table A can exist per record in Table B.

Foreign key is in one table but also marked as @unique.
Each parent has exactly one child record.
Example:

A Profile can have only one ProfileDetails, and each ProfileDetails belongs to exactly one Profile.
prisma

model Profile {
  id              String   @id @default(uuid()) @db.Uuid
  profileDetails  ProfileDetails?
}

model ProfileDetails {
  id         String  @id @default(uuid()) @db.Uuid
  profileId  String  @unique @db.Uuid  // Ensures 1:1 mapping
  bio        String?  
  avatarUrl  String?  

  profile    Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)
}
✅ Since profileId is @unique, no two ProfileDetails can have the same Profile.
✅ 1 Profile → 1 ProfileDetails (1:1).

🛠 Quick Way to Identify (1:1)
If Table A has the foreign key pointing to Table B AND the foreign key is @unique, then:
A can have only one B (strict 1:1).
ER Diagram (DBeaver):
Black dot (⚫) on the foreign key.
Solid line connecting them.
Unique constraint ensures strict one-to-one mapping.
🚀 3. Many-to-Many (M:N)
Rule: If two tables need many of each other, use a join table.

Neither table stores the foreign key directly.
Instead, a third table (join table) holds references to both.
Example:

A Profile can have multiple MovingPreferences, and each MovingPreference can be selected by multiple Profiles.
prisma

model Profile {
  id                  String   @id @default(uuid()) @db.Uuid
  movingPreferences   ProfileMovingPreference[]
}

model MovingPreference {
  id         String @id @default(uuid()) @db.Uuid
  type       String @unique  
  profiles   ProfileMovingPreference[]
}

model ProfileMovingPreference {
  id          String @id @default(uuid()) @db.Uuid
  profileId   String @db.Uuid
  movingPrefId String @db.Uuid  

  profile     Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  movingPref  MovingPreference @relation(fields: [movingPrefId], references: [id], onDelete: Cascade)

  @@unique([profileId, movingPrefId]) // Ensures a profile can't select the same option twice
}
✅ Since the foreign keys (profileId and movingPrefId) are stored in ProfileMovingPreference, multiple profiles can have multiple moving preferences.
✅ M:N (Many-to-Many).

🛠 Quick Way to Identify (M:N)
If a third table (join table) stores foreign keys for two tables, then:
A can have many B, and B can have many A.
ER Diagram (DBeaver):
Two black dots (⚫⚫) on the join table (holding two foreign keys).
Solid lines connecting it to both tables.
🚀 4. Self-Referencing (1:N or M:N)
Rule: When a table references itself, it means each record can be linked to other records in the same table.

Foreign key exists inside the same table.
Can be 1:N (hierarchies) or M:N (social relationships).
Example:

A User can have multiple friends, and each friend is also a User.
prisma

model User {
  id        String @id @default(uuid()) @db.Uuid
  friends   Friend[] @relation("UserFriends")
}

model Friend {
  id        String @id @default(uuid()) @db.Uuid
  userId    String @db.Uuid
  friendId  String @db.Uuid

  user      User @relation(fields: [userId], references: [id], onDelete: Cascade)
  friend    User @relation(fields: [friendId], references: [id], onDelete: Cascade)

  @@unique([userId, friendId])
}
✅ Each User can have multiple Friends, and each Friend is also a User.
✅ Self-referencing relationship (M:N).

🛠 Quick Way to Identify Self-Referencing
If Table A has a foreign key pointing to itself, then:
A can reference another A.
ER Diagram (DBeaver):
Black dot (⚫) on the foreign key inside the same table.
Line looping back to itself.
📌 Final Cheat Sheet
Foreign Key Is In…	Relationship Type	Example
Child Table (A) → Parent Table (B)	One-to-Many (1:N)	Profile.relationshipStatusId → RelationshipStatus.id ✅ (Many profiles can have the same status)
Parent Table (A) → Child Table (B) (with @unique)	One-to-One (1:1)	Profile.profileDetailsId → ProfileDetails.id ✅ (Each profile has at most one ProfileDetails)
Join Table (A_B) → Links A and B	Many-to-Many (M:N)	ProfileMovingPreference.profileId → Profile.id, ProfileMovingPreference.movingPrefId → MovingPreference.id ✅ (Profiles can have many moving preferences)
Foreign Key Inside the Same Table (Self-Referencing)	One-to-Many (1:N) or Many-to-Many (M:N)	User.friendId → User.id ✅ (Users can be friends with each other)
🚀 Final Summary
✔ One-to-Many (1:N) → Foreign key is in the "many" table (child table).
✔ One-to-One (1:1) → Foreign key is @unique (each record can only have one match).
✔ Many-to-Many (M:N) → Join table holds foreign keys for both tables.
✔ Self-Referencing → A table references itself using a foreign key.