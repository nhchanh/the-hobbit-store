Feature: Integration test for Cart REST controller
  As a developer
  I want to verify the Cart REST API with dynamic environment and tenant ids

  Background:
	* def cartBaseUrl = hobbitStoreServiceUrlBase + '/api/v1/carts'
    * url cartBaseUrl
    * def envId = karate.get('envId')
    * def tenantId = karate.get('tenantId')
    * def runId = karate.get('runId')
   	* def util = call read('utils/commonUtils.feature')
    * def customerId = '01JW4VXXGFZVJ5X28QTBGFPWAY'
    * def cartId = util.nextULID()

  Scenario: Create a new cart
	print customer id: #(customerId)
    Given request
		"""{ id: '#(cartId)', customerId: '#(customerId)', status: 'ACTIVE', createdAt: '2025-05-18T12:00:00Z', updatedAt: '2025-05-18T12:30:00Z',
			"cartItems": [
			{
			"productId": "01JW4VXXGGZ0E4BH0PM29P0HFX",
			"quantity": 2,
			"itemPrice": 59.98
			}
		]
	   }"""
    And header X-Environment-Id = envId
    And header X-Tenant-Id = tenantId
    When method POST
    Then status 200
    And match response.cartItems[0].quantity == 2
    And match response.cartItems[0].itemPrice == 59.98

  Scenario: Update the cart
	print customer id: #(customerId)
    Given request
		"""{ id: '#(cartId)', customerId: '#(customerId)', status: 'ACTIVE', createdAt: '2025-05-18T12:00:00Z', updatedAt: '2025-05-18T12:30:00Z',
			"cartItems": [
			{
			"productId": "01JW4VXXGGZ0E4BH0PM29P0HFX",
			"quantity": 2,
			"itemPrice": 9.99
			}
		]
	   }"""
    And header X-Environment-Id = envId
    And header X-Tenant-Id = tenantId
    When method POST
    Then status 200
    And match response.cartItems[0].quantity == 2
    And match response.cartItems[0].itemPrice == 9.99
	* def createdCart = response
	* set createdCart.cartItems[0].quantity = 4
    Given request createdCart
	And url cartBaseUrl + "/" + createdCart.id
    And header X-Environment-Id = envId
    And header X-Tenant-Id = tenantId
    When method PUT
    Then status 200
    And match response.cartItems[0].quantity == 2
    And match response.cartItems[0].itemPrice == 9.99
