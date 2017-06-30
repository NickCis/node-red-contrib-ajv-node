var Ajv = require('ajv');

module.exports = function(RED) {
  RED.nodes.registerType('ajv', function(config) {
    RED.nodes.createNode(this, config);

    var node = this;
    var ajv = new Ajv();
    var validate;
    try {
      validate = ajv.compile(JSON.parse(config.schema));
      this.status({});
    } catch(e) {
      validate = function() { return false; };
      validate.errors = "Invalid schema";
      this.status({fill:"red",shape:"ring",text:"invalid schema"});
    }

    this.on('input', function(msg) {
      msg.valid = validate(msg.payload);
      if (msg.valid) {
        node.send([msg, null]);
      } else {
        msg.errors = validate.errors;
        node.send([null, msg]);
      }
    });
  });
};
