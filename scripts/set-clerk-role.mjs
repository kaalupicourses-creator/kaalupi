// Script untuk set role ke user Clerk via API
// Usage: node scripts/set-clerk-role.mjs <email> <role>
//        node scripts/set-clerk-role.mjs --list
// Example: node scripts/set-clerk-role.mjs admin@kaalupi.com admin

import { readFileSync } from "fs";

// Load .env file
const envContent = readFileSync(".env", "utf-8");
const envVars = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#][^=]+)=(.*)/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
}

const CLERK_SECRET_KEY = envVars.CLERK_SECRET_KEY;
const CLERK_API = "https://api.clerk.com/v1";

async function setRole(email, role) {
  try {
    // Find user by email
    const searchRes = await fetch(`${CLERK_API}/users?email_address=${encodeURIComponent(email)}`, {
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!searchRes.ok) {
      const body = await searchRes.text();
      console.error(`Search failed (${searchRes.status}): ${body}`);
      process.exit(1);
    }

    const users = await searchRes.json();
    if (users.length === 0) {
      console.error(`User ${email} not found`);
      process.exit(1);
    }

    const user = users[0];
    const currentMetadata = user.public_metadata || {};

    // Update user with new role
    const updateRes = await fetch(`${CLERK_API}/users/${user.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_metadata: { ...currentMetadata, role },
      }),
    });

    if (!updateRes.ok) {
      const body = await updateRes.text();
      console.error(`Update failed (${updateRes.status}): ${body}`);
      process.exit(1);
    }

    const updated = await updateRes.json();
    console.log(`✅ Role "${role}" set for ${email}`);
    console.log(`   User ID: ${updated.id}`);
    console.log(`   Public metadata: ${JSON.stringify(updated.public_metadata)}`);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

async function listUsers() {
  try {
    const res = await fetch(`${CLERK_API}/users`, {
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Failed (${res.status}): ${body}`);
      process.exit(1);
    }

    const data = await res.json();
    const users = Array.isArray(data) ? data : data.data || [];

    if (users.length === 0) {
      console.log("No users found. Sign up at /login first.");
    } else {
      console.log(`Found ${users.length} user(s):`);
      users.forEach(u => {
        const email = u.email_addresses?.[0]?.email_address || "N/A";
        const role = u.public_metadata?.role || "(not set)";
        console.log(`  ${email} — role: ${role}`);
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

const email = process.argv[2];
const role = process.argv[3];
const listOnly = process.argv.includes("--list");

if (listOnly) {
  listUsers();
} else if (!email || !role) {
  console.error("Usage: node scripts/set-clerk-role.mjs <email> <role>");
  console.error("       node scripts/set-clerk-role.mjs --list");
  console.error("Roles: admin, instructor, student");
  process.exit(1);
} else if (!["admin", "instructor", "student"].includes(role)) {
  console.error("Invalid role. Must be: admin, instructor, student");
  process.exit(1);
} else {
  setRole(email, role);
}
