describe("e2e", () => {
  it("should source images from S3", () => {
    cy.visit("http://localhost:9000");

    cy.get("img").should("exist");
  });
});
