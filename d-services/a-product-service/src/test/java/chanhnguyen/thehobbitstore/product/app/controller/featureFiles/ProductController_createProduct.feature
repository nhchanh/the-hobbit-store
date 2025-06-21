Feature: Create Product API

  Background:
	* def baseUrl = hobbitStoreServiceUrlBase + '/api/v1/products'
    * url baseUrl
    * def envId = karate.get('envId')
    * def tenantId = karate.get('tenantId')
    * def runId = karate.get('runId')
   	* def util = call read('utils/commonUtils.feature')
    * def product =
		"""
		{
			categoryId: '01JW4VXXGGGKN8E2BHNG454QHH',
			name: 'The Hobbit',
			description: 'A fantasy novel',
			rating: 4.8,
			price: 19.99,
			imageUrls: ['https://example.com/hobbit.jpg']
      	}
		"""

  Scenario: Create a new product successfully
    Given request product
    And header X-Environment-Id = envId
    And header X-Tenant-Id = tenantId
    When method post
    Then status 200
    And match response.name == product.name
    And match response.description == product.description
    And match response.price == product.price
    And match response.rating == product.rating

  Scenario: Create product with missing required field
    * def invalidProduct = product
    * remove invalidProduct.name
    Given request invalidProduct
    And header X-Environment-Id = envId
    And header X-Tenant-Id = tenantId
    When method post
    Then status 400
