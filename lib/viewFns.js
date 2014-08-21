module.exports = function (app) {
  app.proto.$formatEmail = function (name, address) {
    return name + ' <' + address + '>';
  };
};
