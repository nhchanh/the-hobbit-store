function fn() {
  var config = {};
  var runId = java.util.UUID.randomUUID().toString().replace(/[^0-9]/g, '').substring(0, 5);
  config.runId = runId;
  config.envId = karate.properties['envId'] ? karate.properties['envId'] : 'ENV001';
  config.tenantId = karate.properties['tenantId'] ? karate.properties['tenantId'] : '01JW4VXXGF3HZRJKJ3EKDHTEM4';
  config.hobbitStoreServiceUrlBase = karate.properties['hobbitStoreServiceUrlBase'] ? karate.properties['hobbitStoreServiceUrlBase'] : 'http://localhost:8080';
  return config;
}
