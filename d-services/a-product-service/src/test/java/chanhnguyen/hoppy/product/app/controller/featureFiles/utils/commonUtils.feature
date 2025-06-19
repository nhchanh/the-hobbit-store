@ignore
Feature: Common utilities for testing

Scenario:
	* def nextULID =
   	"""
  		function() {
 			var ulidGen = Java.type('de.huxhorn.sulky.ulid.ULID');
 			return new ulidGen().nextULID();
		}
   	"""
