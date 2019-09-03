import {Checker} from "./Checkers";

/**
 * kt风格的扩展方法，在React环境下直接扩展Object会出问题
 * */
function installKtExtensions() {
    // eslint-disable-next-line no-extend-native
    Object.defineProperty(Object.prototype, 'also', {
        value: function (handler) {
            handler(this);
            return this;
        }
    });

    // eslint-disable-next-line no-extend-native
    Object.defineProperty(Object.prototype, 'let', {
        value: function (mapper) {
            return mapper(this);
        }
    });

    // eslint-disable-next-line no-extend-native
    Boolean.prototype.yes = function (mapper) {
        return new Checker(this, true, mapper);
    };

    // eslint-disable-next-line no-extend-native
    Boolean.prototype.no = function (mapper) {
        return new Checker(this, false, mapper);
    };

    // eslint-disable-next-line no-extend-native
    Boolean.isNull = function () {
        return this === null;
    };

    // eslint-disable-next-line no-extend-native
    Boolean.isNotNull = function () {
        return this !== null;
    };
}

export default installKtExtensions;