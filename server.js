// Hackathon tracker used by a large audience (fictional demo app).
const express = require("express");
const { DynamoDBClient, ScanCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const app = express();
app.use(express.json());
const db = new DynamoDBClient({});
const TABLE = process.env.TRACKER_TABLE || "demo-hackathon-entries";

app.get("/entries", async (_req, res) => {
  const out = await db.send(new ScanCommand({ TableName: TABLE }));
  res.json(out.Items || []);
});

app.post("/entries", async (req, res) => {
  await db.send(
    new PutItemCommand({
      TableName: TABLE,
      Item: { id: { S: req.body.id }, team: { S: req.body.team } },
    })
  );
  res.json({ ok: true });
});

app.listen(3000);
