// tests/feedback.test.ts
import request from "supertest";
import app from "../src/app"; // ajuste se seu app estiver em outro caminho

describe("Feedback Routes", () => {
  it("GET /feedback deve retornar status 200", async () => {
    const response = await request(app).get("/feedback");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
