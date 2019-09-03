class UndefinedExt {
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

class UndefinedChecker {
    constructor(value) {
        this.value = value;
    }

    static of(value) {
        return new UndefinedChecker(value);
    }

    isUndefined(mapper) {
        return new UndefinedExt(this.value, undefined, mapper);
    }

    isNotUndefined(mapper) {
        return new UndefinedExt(this.value, this.value, mapper);
    }
}

export default UndefinedChecker;