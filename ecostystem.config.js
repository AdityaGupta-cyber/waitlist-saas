module.exports = {
  apps: [
    {
      name: "waitlist",
      script: "ts-node",
      args: "src/apps/waitlist.ts",
      watch: ["src"]
    },
    {
      name: "organisation",
      script: "ts-node",
      args: "src/apps/organisation.ts",
      watch: ["src"]
    },
    {
      name: "user",
      script: "ts-node",
      args: "src/apps/user.ts",
      watch: ["src"]
    },
    {
      name: "waitlist-entries",
      script: "ts-node",
      args: "src/apps/waitlistEntries.ts",
      watch: ["src"]
    },
    {
      name: "plan",
      script: "ts-node",
      args: "src/apps/plan.ts",
      watch: ["src"]
    },
    {
      name: "payment",
      script: "ts-node",
      args: "src/apps/payment.ts",
      watch: ["src"]
    }
  ]
};