class Checker {
    constructor(value, flag, mapper) {
        this.value = value;
        this.flag = flag;
        this.mapperValue = null;
        if (value === flag) {
            this.mapperValue = mapper(value);
        }
    }

    otherwise(mapper) {
        if (this.value === this.flag) {
            return this.mapperValue;
        } else {
            return mapper(this.value);
        }
    }
}

class Nullable {
    constructor(value) {
        this.value = value;
    }

    static of(value) {
        return new Nullable(value);
    }

    isNull(mapper) {
        return new Checker(this.value, null, mapper);
    }

    isNotNull(mapper) {
        return new Checker(this.value, this.value, mapper);
    }
}

class UndefinedChecker {
    constructor(value) {
        this.value = value;
    }

    static of(value) {
        return new UndefinedChecker(value);
    }

    isUndefined(mapper) {
        return new Checker(this.value, undefined, mapper);
    }

    isNotUndefined(mapper) {
        return new Checker(this.value, this.value, mapper);
    }
}

export {
    Nullable,
    UndefinedChecker,
    Checker
} ;