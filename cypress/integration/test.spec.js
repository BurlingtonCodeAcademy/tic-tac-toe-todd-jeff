describe('Cypress', function () {
  it('successfully visits the home page', function () {
    cy.visit('/');
  });
});

describe('Before the game begins', function() {
  it('the start button is enabled', function(){
    cy.get('#start').should('be.enabled')
  })

  it('disables the start button when clicked', function() {
    cy.get('#start').click()
    cy.get('#start').should('be.disabled')
  })
})