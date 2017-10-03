exports.getXpVersion = function () {
    return Java.type("se.bellfalasch.xp.harvest.XpVersionSupplier").get();
}
